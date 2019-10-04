const EventEmitter = require('events');

const axios = require('axios');

const Collection = require('./Collection');
const Group = require('./Group');
const User = require('./User');
const Util = require('../util/Util');

/** Client for interacting with the API */
class Client extends EventEmitter {
	/**
	 * Returns a new client
	 * @param {string} [cookie] The .ROBLOSECURITY cookie to use when this client makes requests to the API
	 */
	constructor(cookie) {
		super();
		if (cookie) this.login(cookie);
		/**
		 * @property {Collection} badges A collection with all cached badges
		 */
		this.badges = new Collection();
		/**
		 * @property {Collection} groups A collection with all cached groups
		 */
		this.groups = new Collection();
		/**
		 * @property {Collection} roles A collection with all cached roles
		 */
		this.roles = new Collection();
		/**
		 * @property {Collection} users A collection with all cached users
		 */
		this.users = new Collection();
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
	async login(cookie) {
		this.cookie = cookie;
		// Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
		const response = await this.http('https://groups.roblox.com/v1/groups/7/audit-log');
		if (response.status !== 403 || response.data.errors[0].code !== 23) {
			throw new Error('Invalid cookie');
		}
		this.emit('ready', new Date());
	}

	async handleHttpQueue() {
		if (this.httpQueue.length) {
			const request = this.httpQueue.shift();
			this.debug && console.log(`http request to ${request[0]}`);
			const response = await axios(request[0], request[1]).catch(err => {
				this.debug && console.error(`http error: ${err}`);
				const errResponse = err.response;
				switch(errResponse.status) {
				case 401: {
					request[3](new Error('Client not logged in'));
					break;
				}
				case 403: {
					if(err.response.data.errors[0].code === 0) {
						request[3](new Error('Cookie verification failed'));
					}
					break;
				}
				case 429: {
					clearInterval(this.httpIntervalId);
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
					request[3](err);
				}
				}
			});
			// If no error, resolve promise
			request[2](response);
		} else {
			clearInterval(this.httpIntervalId);
			this.httpIntervalId = null;
		}
	}

	/**
	 * Internal function for making http calls to the API, taking care of cookie and X-CSRF tokens. Can be used for APIs that the library doesn't cover yet
	 * @param {string} url The url to make an API call to
	 * @param {Object} config The axios config
	 * @returns {Promise} Resolves when the request has been made, or rejects if an error occurred
	 */
	http(url, config) {
		return new Promise((resolve, reject) => {
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
	async getGroup(id) {
		const response = await this.http(`https://groups.roblox.com/v1/groups/${id}`);
		const cached = this.groups.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new Group(this, response.data);
	}

	async getUser(id) {
		const response = await this.http(`https://users.roblox.com/v1/users/${id}`);
		const cached = this.users.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new User(this, response.data);
	}
}

module.exports = Client;
