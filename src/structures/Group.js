const Base = require('./Base');
const Collection = require('./Collection');
const GroupMember = require('./GroupMember');
const Shout = require('./Shout');
const User = require('./User');

/**
 * Represents a group
 */
class Group extends Base {
	constructor(client, data) {
		super(client);
		/**
		 * @property {integer} id The id of this group
		 */
		Object.defineProperty(this, 'id', { value: data.id });
		/**
		 * @property {string} name The name of this group
		 */
		Object.defineProperty(this, 'name', { value: data.name });
		/**
		 * @property {string} description The description of this group
		 */
		this.description = data.description;
		/**
		 * @property {User} owner The owner of this group
		 */
		const owner = client.users.get(data.owner.userId);
		owner && owner.update(data.owner);
		this.owner = owner || new User(client, data.owner);
		/**
		 * @property {Shout} shout The current group shout
		 */
		this.shout = data.shout && new Shout(client, data.shout);
		/**
		 * @property {integer} memberCount The current amount of members in this group
		 */
		this.memberCount = data.memberCount;
		/**
		 * @property {boolean} isBuildersClubOnly If true, only users with builders club or roblox premium can join this group
		 */
		this.isBuildersClubOnly = data.isBuildersClubOnly;
		/**
		 * @property {boolean} hasClan Determines whether this group has a clan
		 */
		this.hasClan = data.hasClan;
		/**
		 * @property {boolean} public If true, anyone can join this group. If false, users have to send a join request first
		 */
		this.public = data.publicEntryAllowed;
		/**
		 * @property {boolean} locked If true, the group can't be joined
		 */
		this.locked = data.isLocked;
		/**
		 * @property {Collection} roles All known roles in this group
		 */
		this.roles = new Collection();
		client.groups.set(this.id, this);
	}

	update(data) {
		this.description = data.description;
		this.owner = this.client.users.get(data.owner.userId) || new User(this.client, data.owner);
		this.shout = data.shout && new Shout(this.client, data.shout);
		this.memberCount = data.memberCount;
		this.isBuildersClubOnly = data.isBuildersClubOnly;
		this.hasClan = data.hasClan;
		this.public = data.publicEntryAllowed;
		this.locked = data.isLocked;
	}

	/**
	 * Function to retrieve all current members of the group
	 */
	async getUsers() {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
		this.members = this.client.getPages(url, GroupMember, this);
		return this.members;
	}

	/**
	 * Shouts on the group
	 * @param {string} message The content of the shout
	 */
	async shout(message) {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/status`;
		const response = await this.client.http(url, {
			method: 'patch',
			data: {
				message: message,
			},
		});
		return new Shout(response);
	}

	async setDescription(description) {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/description`;
		await this.client.http(url, {
			method: 'patch',
			data: {
				description: description,
			},
		}).catch(err => {
			switch(err.response.status) {
			case 403: {
				switch(err.response.data.errors[1].code) {
				case 18: {
					throw new Error('Description too long');
				}
				case 23: {
					throw new Error('Lacking permissions');
				}
				}
			}
			}
		});
		return this;
	}
}

module.exports = Group;