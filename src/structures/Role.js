const Base = require('./Base');

class Role extends Base {
	constructor(client, data, group) {
		super(client);
		/**
		 * @property {integer} id The id of this roleset
		 */
		Object.defineProperty(this, 'id', { value: data.id });
		/**
		 * @property {Group} group The group this roleset belongs to
		 */
		Object.defineProperty(this, 'group', { value: group });
		group.roles.set(this.id, this);
		/**
		 * @property {string} name The name of this roleset
		 */
		this.name = data.name;
		/**
		 * @property {integer} rank An integer between 1-255 representing the order of the roleset in the group
		 */
		this.rank = data.rank;
		/**
		 * @property {integer} memberCount An integer representing the amount of members with this role
		 */
		this.memberCount = data.memberCount;
	}
}

module.exports = Role;