const axios = require('axios');

function handleGetQueue(self) {
	if (self.getQueue.length) {
		const request = self.getQueue.shift();
		const response = axios.get(request[0], request[1]);
		request[2](response); // Change to reject on error
	}
}
module.exports = class Client extends EventEmitter {
	constructor(cookie) {
		super()
		if (cookie) this.login(cookie);
	}
	
	login(cookie) {
		// Consistent endpoint for cookie verification
		this.http.get('https://groups.roblox.com/v1/groups/7/audit-log', {
			headers: {
				cookie: '.ROBLOXSECURITY=' + cookie + ';'
			}
		}).then(() => {
			this.cookie = cookie;
			this.emit('ready', new Date());
		}).catch(err => {
			console.error(err);
			console.error('Invalid cookie?');
		});
	}
	
	getQueue = [];
	getInterval = null;
	http = {
		function get(url, config) {
			return new Promise(resolve => {
				getQueue.push([url, config, resolve]);
				if (!getInterval) {
					getInterval = setInterval(handleGetQueue, 100, this);
				}
			})
		}
	};
};
