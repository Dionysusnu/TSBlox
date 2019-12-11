import EventEmitter from 'events';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Collection } from './Collection';
import { User } from './User';
import { Badge } from './Badge';
import { Role } from './Role';
import { Group } from './Group';
import { default as Util } from '../util/Util';
import { Base } from './Base';

interface HttpConfig extends AxiosRequestConfig {
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}

interface HttpRequest {
	0: string;
	1: AxiosRequestConfig;
	2: Function;
	3: Function;
	4: CatchConfig;
}

type CatchConfig = Record<number, string | Record<number, string>>

/** Client for interacting with the API */
export class Client extends EventEmitter {
	public badges: Collection<Base['id'], Badge>;
	public groups: Collection<Base['id'], Group>;
	public roles: Collection<Base['id'], Role>;
	public users: Collection<Base['id'], User>;
	private httpQueue: HttpRequest[];
	public util: Record<string, Function>;
	private httpTimeout: number;
	private httpInterval: number;
	private httpIntervalId?: NodeJS.Timeout;
	private cookie?: string;
	private token?: string;
	public readonly debug?: boolean;
	/**
	 * Returns a new client
	 * @param {string} [cookie] The .ROBLOSECURITY cookie to use when this client makes requests to the API
	 */
	public constructor(cookie: string) {
		super();
		if (cookie) {
			this.login(cookie).catch(err => {
				throw err;
			});
		}
		/**
		 * @property {Collection} badges A collection with all cached badges
		 */
		this.badges = new Collection(this);
		/**
		 * @property {Collection} groups A collection with all cached groups
		 */
		this.groups = new Collection(this);
		/**
		 * @property {Collection} roles A collection with all cached roles
		 */
		this.roles = new Collection(this);
		/**
		 * @property {Collection} users A collection with all cached users
		 */
		this.users = new Collection(this);
		this.httpQueue = [];
		/**
		 * @property {Util} util An object with utility functions, mostly for internal use
		 */
		this.util = Util;
		/**
		 * @property {integer} httpTimeout The number of ms to wait for when receiving a 429 response from the roblox API
		 * @default 10000
		 */
		this.httpTimeout = 10000;
		// 10 seconds cooldown
		/**
		 * @property {integer} httpInterval The time in ms between requests to the roblox API
		 * @default 10
		 */
		this.httpInterval = 10;
		// 100 requests per second
	}

	/**
	 * Logs in the client with the given cookie. Can be used after already setting a cookie
	 * @param {string} cookie The cookie to login with
	 */
	public async login(cookie: string): Promise<void> {
		this.cookie = cookie;
		// Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
		try {
			await this.http('https://groups.roblox.com/v1/groups/7/status', {
				method: 'PATCH',
			});
		} catch (e) {
			if (e.message !== 'Lacking permissions') {
				throw e;
			}
			this.emit('ready', new Date());
		}
	}

	private async handleHttpQueue(): Promise<void> {
		if (this.httpQueue.length) {
			const request = this.httpQueue[0];
			this.httpQueue.shift();
			this.debug && console.log(`${request[1].method} request to ${request[0]}`);
			const url = request[0];
			const config = request[1];
			const resolve = request[2];
			const reject = request[3];
			const catchConfig = request[4];
			if (!config.headers) {
				config.headers = {};
			}
			if (this.cookie) {
				config.headers.cookie = '.ROBLOSECURITY=' + this.cookie + ';';
			}
			if (this.token) {
				config.headers['x-csrf-token'] = this.token || '';
			} else if (config.method) {
				const response = await axios(url, config).catch((err: AxiosError) => err.response);
				const headers = response && response.headers;
				this.debug && console.log(headers);
				this.token = headers['x-csrf-token'];
				config.headers['x-csrf-token'] = this.token || '';
			}
			this.debug && console.log(config.headers);
			const response = await axios(request[0], request[1]).catch((err: AxiosError) => {
				this.debug && console.error(`http error: ${err}`);
				const errResponse = err.response;
				if (errResponse) {
					this.debug && console.error(errResponse.data);
					for (const status in catchConfig) {
						const parsedStatus = parseInt(status);
						if (parsedStatus !== errResponse.status) continue;
						const message = catchConfig[parsedStatus];
						if (typeof message === 'string') {
							reject(new Error(message));
						} else {
							for (const code in message) {
								const parsedCode = parseInt(code);
								if (parsedCode !== errResponse.data.errors[0].code) continue;
								reject(new Error(message[parsedCode]));
							}
						}
					}
					switch (errResponse.status) {
						case 401: {
							if (this.cookie) {
								reject(new Error('Invalid cookie'));
							}
							reject(new Error('Client not logged in'));
							break;
						}
						case 403: {
							this.debug && console.error(errResponse.data);
							reject(new Error('Lacking permissions'));
							break;
						}
						case 429: {
							this.httpIntervalId && clearInterval(this.httpIntervalId);
							setTimeout(() => {
								this.httpIntervalId = setInterval(() => {
									this.handleHttpQueue().catch(err => {
										throw err;
									});
								}, this.httpInterval);
							}, this.httpTimeout);
							break;
						}
						case 503: {
							reject(new Error('Roblox API error'));
							break;
						}
						default: {
							if (errResponse.data.errors[0]) {
								if (errResponse.data.errors[0].message === 'Token Validation Failed') {
									this.debug && console.log(errResponse.headers);
									return err.response;
								} else {
									reject(errResponse.data.errors[0].message);
								}
							}
							reject(err);
							break;
						}
					}
				}
				return err.response;
			});
			if (response && response.headers['x-csrf-token']) {
				this.token = response.headers['x-csrf-token'];
			}
			// If no error, resolve promise
			resolve(response);
		} else {
			this.httpIntervalId && clearInterval(this.httpIntervalId);
			this.httpIntervalId = undefined;
		}
	}

	/**
	 * Internal function for making http calls to the API, taking care of cookie and X-CSRF tokens. Can be used for APIs that the library doesn't cover yet
	 * @param {string} url The url to make an API call to
	 * @param {Object} config The axios config
	 * @param {Object} catchConfig The error message structure
	 * @returns {Promise} Resolves when the request has been made, or rejects if an error occurred
	 */
	public async http(url: string, config: HttpConfig, catchConfig: CatchConfig = {}): Promise<AxiosResponse> {
		return new Promise((resolve, reject): void => {
			this.httpQueue.push([url, config, resolve, reject, catchConfig]);
			if (!this.httpIntervalId) {
				this.httpIntervalId = setInterval(() => {
					this.handleHttpQueue().catch(err => {
						throw err;
					});
				}, this.httpInterval);
			}
		});
	}

	/**
	 * Gets a group or updates its cached data
	 * @param {integer} id The id of the group to get
	 * @returns {Group|undefined} The requested group
	 */
	public async getGroup(id: number): Promise<Group | undefined> {
		const response = await this.http(`https://groups.roblox.com/v1/groups/${id}`, {
			method: 'GET',
		}, {
			400: {
				1: 'Group is invalid',
			},
		});
		const cached = this.groups.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new Group(this, response.data);
	}

	public async getUser(id: number): Promise<User | undefined> {
		const response = await this.http(`https://users.roblox.com/v1/users/${id}`, {
			method: 'GET',
		});
		response.data.userId = response.data.id || response.data.userId;
		response.data.username = response.data.name || response.data.username;
		const cached = this.users.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new User(this, response.data);
	}

	public async getUserByName(name: string): Promise<User | undefined> {
		const response = await this.http('https://users.roblox.com/v1/usernames/users', {
			method: 'POST',
			data: {
				usernames: [
					name,
				],
			},
		});
		return await this.getUser(response.data.data[0].id);
	}
}