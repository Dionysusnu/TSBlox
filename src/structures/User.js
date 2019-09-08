const Base = require('./Base');

module.exports = class User extends Base {
	constructor(client, data) {
		super(client);
		Object.defineProperty(this, 'id', { value: data.userId });
		this.username = data.username;
		this.membership = data.buildersClubMembershipType;
		client.users.set(this.id, this);
		// One of ['None', 'BC', 'TBC', 'OBC', 'RobloxPremium']
	}
};