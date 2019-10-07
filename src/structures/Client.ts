import EventEmitter from 'events';
import axios, { AxiosRequestConfig, AxiosPromise, AxiosError } from 'axios';
import { Collection } from './Collection';
import { User } from './User';
import { Badge } from './Badge';
import { Role } from './Role';
import { Group } from './Group';
import { default as Util } from '../util/Util';

interface HttpRequest {
	0: string;
	1: AxiosRequestConfig;
	2: Function;
	3: Function;
}
/** Client for interacting with the API */
export class Client extends EventEmitter {
	badges: Collection<Badge>;
	groups: Collection<Group>;
	roles: Collection<Role>;
	users: Collection<User>;
	httpQueue: HttpRequest[];
	util: Util;
	httpTimeout: number;
	httpInterval: number;
	httpIntervalId?: NodeJS.Timeout;
	cookie?: string;
	debug?: boolean;
	/**
	 * Returns a new client
	 * @param {string} [cookie] The .ROBLOSECURITY cookie to use when this client makes requests to the API
	 */
	constructor(cookie: string) {
		super();
		if (cookie) this.login(cookie);
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
		this.util = new Util();
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
	async login(cookie: string): Promise<void> {
		this.cookie = cookie;
		// Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
		const response = await this.http('https://groups.roblox.com/v1/groups/7/audit-log');
		if (response.status !== 403 || response.data.errors[0].code !== 23) {
			throw new Error('Invalid cookie');
		}
		this.emit('ready', new Date());
	}

	async handleHttpQueue(): Promise<void> {
		if (this.httpQueue.length) {
			const request = this.httpQueue[0];
			this.httpQueue.shift();
			this.debug && console.log(`http request to ${request[0]}`);
			const response = await axios(request[0], request[1]).catch((err: AxiosError) => {
				this.debug && console.error(`http error: ${err}`);
				const errResponse = err.response;
				if (errResponse) {
					switch(errResponse.status) {
					case 401: {
						if (this.cookie) {
							request[3](new Error('Invalid cookie'));
						}
						request[3](new Error('Client not logged in'));
						break;
					}
					case 403: {
						if(errResponse.data.errors[0].code === 0) {
							request[3](new Error('Cookie verification failed'));
						}
						break;
					}
					case 429: {
						this.httpIntervalId && clearInterval(this.httpIntervalId);
						setTimeout(() => {
							this.httpIntervalId = setInterval(() => this.handleHttpQueue(), this.httpInterval);
						}, this.httpTimeout);
						break;
					}
					case 503: {
						request[3](new Error('Roblox API error'));
						break;
					}
					default: {
						if (errResponse.data.errors[0]) {
							request[3](errResponse.data.errors[0].message);
						}
						request[3](err);
					}
					}
				}
			});
			// If no error, resolve promise
			request[2](response);
		} else {
			this.httpIntervalId && clearInterval(this.httpIntervalId);
			this.httpIntervalId = undefined;
		}
	}

	/**
	 * Internal function for making http calls to the API, taking care of cookie and X-CSRF tokens. Can be used for APIs that the library doesn't cover yet
	 * @param {string} url The url to make an API call to
	 * @param {Object} config The axios config
	 * @returns {Promise} Resolves when the request has been made, or rejects if an error occurred
	 */
	http(url: string, config?: Record<string, any>): AxiosPromise {
		return new Promise((resolve, reject): void => {
			if (!config) {
				config = {};
			}
			if (!config.headers) {
				config.headers = {};
			}
			config.headers.cookie = '.ROBLOSECURITY=' + this.cookie + ';';
			this.httpQueue.push([url, config, resolve, reject]);
			if (!this.httpIntervalId) {
				this.httpIntervalId = setInterval(() => this.handleHttpQueue(), this.httpInterval);
			}
		});
	}

	/**
	 * Gets a group or updates its cached data
	 * @param {integer} id The id of the group to get
	 * @returns {Group} The requested group
	 */
	async getGroup(id: number): Promise<Group> {
		const response = await this.http(`https://groups.roblox.com/v1/groups/${id}`);
		const cached = this.groups.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new Group(this, response.data);
	}

	async getUser(id: number): Promise<User> {
		const response = await this.http(`https://users.roblox.com/v1/users/${id}`);
		const cached = this.users.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new User(this, response.data);
	}
}