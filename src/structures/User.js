const Base = require('./Base');
const Badge = require('./Badge');

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
		Object.defineProperty(this, 'id', { value: data.userId || data.id });
		/**
		 * @property {string} username The username of this user
		 */
		this.username = data.username;
		/**
		 * @property {MembershipType} membership The builders club membership type
		 */
		this.membership = data.buildersClubMembershipType;
		/**
		 * @property {Collection} badges The badges this user has earned
		 */
		client.users.set(this.id, this);
	}

	update(data) {
		this.username = data.username;
		this.membership = data.buildersClubMembershipType;
	}

	async getBadges() {
		this.badges = await this.client.util.getPages(`https://badges.roblox.com/v1/users/${this.id}/badges`, Badge, this).catch(err => {
			switch(err.response && err.response.status) {
			case 404: {
				switch(err.response.data.errors[1].code) {
				case 4: {
					throw new Error('User is invalid');
				}
				}
				break;
			}
			}
			throw err;
		});
		for (const [, badge] of this.badges) {
			badge.owners.set(this.id, this);
		}
		return this.badges;
	}
}

module.exports = User;