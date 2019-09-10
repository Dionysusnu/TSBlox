const Base = require('./Base');

/**
 * @typedef {('None'|'BC'|'TBC'|'OBC'|'RobloxPremium')} MembershipType
 */

/**
 * Represents a user on roblox
 */
class User extends Base {
	constructor(client, data) {
		super(client);
		/**
		 * @property {integer} id The id of this user
		 */
		Object.defineProperty(this, 'id', { value: data.userId });
		/**
		 * @property {string} username The username of this user
		 */
		this.username = data.username;
		/**
		 * @property {MembershipType} membership The builders club membership type
		 */
		this.membership = data.buildersClubMembershipType;
		client.users.set(this.id, this);
	}

	update(data) {
		this.username = data.username;
		this.membership = data.buildersClubMembershipType;
	}
}

module.exports = User;