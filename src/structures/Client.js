const EventEmitter = require('events');

const axios = require('axios');

const Collection = require('./Collection');
const Group = require('./Group');

module.exports = class Client extends EventEmitter {
	constructor(cookie) {
		super();
		if (cookie) this.login(cookie);
		this.groups = new Collection();
		this.users = new Collection();
		this.httpQueue = [];
	}

	login(cookie) {
		this.cookie = cookie;
		// Consistent endpoint for cookie verification, using roblox fan group which hopefully won't be deleted
		this.http.get('https://groups.roblox.com/v1/groups/7/audit-log').then(() => {
			this.emit('ready', new Date());
		}).catch(err => {
			console.error(err);
			console.error('Invalid cookie?');
		});
	}

	async handleHttpQueue() {
		if (this.httpQueue.length) {
			const request = this.httpQueue.shift();
			const response = await axios.get(request[0], request[1]);
			request[2](response);
			// Change to reject on error
		} else {
			clearInterval(this.httpInterval);
		}
	}

	http(url, config) {
		return new Promise((resolve, reject) => {
			this.httpQueue.push([url, config, resolve, reject]);
			if (!this.httpInterval) {
				this.httpInterval = setInterval(() => this.handleHttpQueue(), 100);
			}
		});
	}

	async getGroup(id) {
		const response = await this.http('https://groups.roblox.com/v1/groups/' + id);
		const cached = this.groups.get(id);
		if (cached) {
			cached.update(response);
			return cached;
		}
		return new Group(this, response.data);
	}
};
