const HTTP_TIMEOUT = 10000;
// 10 seconds cooldown
const HTTP_INTERVAL = 10;
// 100 requests per second

const EventEmitter = require('events');

const axios = require('axios');

const Collection = require('./Collection');
const Group = require('./Group');
const Util = require('../Util');

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
		 * @property {Collection} groups A collection with all cached groups
		 */
		this.groups = new Collection();
		/**
		 * @property {Collection} users A collection with all cached users
		 */
		this.users = new Collection();
		this.httpQueue = [];
		/**
		 * @property {Util} util An object with utility functions, mostly for internal use
		 */
		this.util = Util;
	}

	/**
	 * Logs in the client with the given cookie. Can be used after already setting a cookie
	 * @param {string} cookie The cookie to login with
	 */
	login(cookie) {
		this.cookie = cookie;
		// Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
		this.http('https://groups.roblox.com/v1/groups/7/audit-log').then(() => {
			this.emit('ready', new Date());
		});
	}

	async handleHttpQueue() {
		if (this.httpQueue.length) {
			const request = this.httpQueue.shift();
			// console.log('http request to ' + request[0]);
			const response = await axios(request[0], request[1]).catch(err => {
				switch(err.response.status) {
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
					clearInterval(this.httpInterval);
					setTimeout(() => {
						this.httpInterval = setInterval(() => this.handleHttpQueue(), HTTP_INTERVAL);
					}, HTTP_TIMEOUT);
					break;
				}
				}
			});
			request[2](response);
			// Change to reject on error
		} else {
			clearInterval(this.httpInterval);
			this.httpInterval = null;
		}
	}

	/**
	 * Internal function for making http calls to the API, taking care of cookie and X-CSRF tokens. Can be used for APIs that the library doesn't cover yet
	 * @param {string} url The url to make an API call to
	 * @param {Object} config The axios config
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
			if (!this.httpInterval) {
				this.httpInterval = setInterval(() => this.handleHttpQueue(), HTTP_INTERVAL);
			}
		});
	}

	/**
	 * Gets a group or updates its cached data
	 * @param {IdResolvable} id The id of the group to get
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
}

module.exports = Client;
