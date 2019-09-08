const axios = require('axios');

module.exports = class Client extends EventEmitter {
	constructor(cookie) {
		super()
		if (cookie) this.login(cookie);
	}
	
	login(cookie) {
		// Consistent endpoint for cookie verification
		axios.get('https://groups.roblox.com/v1/groups/7/audit-log', {
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
};
