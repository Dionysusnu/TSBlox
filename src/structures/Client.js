const HTTP_TIMEOUT = 10000;
// 10 seconds cooldown
const HTTP_INTERVAL = 10;
// 100 requests per second

const EventEmitter = require('events');

const axios = require('axios');

const Collection = require('./Collection');
const Group = require('./Group');
const Util = require('../Util');

module.exports = class Client extends EventEmitter {
	constructor(cookie) {
		super();
		if (cookie) this.login(cookie);
		this.groups = new Collection();
		this.users = new Collection();
		this.httpQueue = [];
		this.util = Util;
	}

	login(cookie) {
		this.cookie = cookie;
		// Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
		this.http('https://groups.roblox.com/v1/groups/7/audit-log').then(() => {
			this.emit('ready', new Date());
		}).catch(err => {
			console.error(err);
			console.error('Invalid cookie?');
		});
	}

	async handleHttpQueue() {
		if (this.httpQueue.length) {
			const request = this.httpQueue.shift();
			console.log('http request to ' + request[0]);
			const response = await axios(request[0], request[1]).catch(err => {
				switch(err.response.status) {
				case 401: {
					throw new Error('Client not logged in');
				}
				case 429: {
					clearInterval(this.httpInterval);
					setTimeout(() => {
						this.httpInterval = setInterval(() => this.handleHttpQueue(), HTTP_INTERVAL);
					}, HTTP_TIMEOUT);
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

	async getGroup(id) {
		const response = await this.http('https://groups.roblox.com/v1/groups/' + id);
		const cached = this.groups.get(id);
		if (cached) {
			cached.update(response.data);
			return cached;
		}
		return new Group(this, response.data);
	}
};
