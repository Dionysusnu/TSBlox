const Base = require('./Base');
const User = require('./User');

module.exports = class Shout extends Base {
	constructor(client, data) {
		super(client);
		Object.defineProperty(this, 'message', data.body);
		Object.defineProperty(this, 'poster', client.users.get(data.poster.userId) || new User(data.poster));
		Object.defineProperty(this, 'timeUpdated', data.updated);
		// time subject to change
	}
};