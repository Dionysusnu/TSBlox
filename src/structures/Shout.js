const Base = require('./Base');
const User = require('./User');

module.exports = class Shout extends Base {
	constructor(client, data) {
		super(client);
		Object.defineProperty(this, 'message', { value: data.body });
		Object.defineProperty(this, 'poster', { value: client.users.get(data.poster.userId) || new User(client, data.poster) });
		Object.defineProperty(this, 'timeUpdated', { value: data.updated });
		// time subject to change
	}
};