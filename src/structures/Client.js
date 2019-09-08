const axios = require('axios');

module.exports = class Client extends EventEmitter {
	constructor() {
		super()
	}
	
	login(cookie) {
		// Consistent endpoint for cookie verification
		axios.get('https://groups.roblox.com/v1/groups/7/audit-log', {
			headers: {
				cookie: '.ROBLOXSECURITY=' + cookie + ';'
			}
		}).then(() => {
			client.cookie = cookie;
		}).catch(err => {
			console.error(err);
			console.error('Invalid cookie?');
		});
	}
};
