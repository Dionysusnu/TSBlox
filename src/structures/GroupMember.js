const Base = require('./Base');
const Role = require('./Role');
const User = require('./User');

module.exports = class GroupMember extends Base {
	constructor(client, data, group) {
		super(client);
		Object.defineProperty(this, 'user', { value: new User(client, data.user) });
		Object.defineProperty(this, 'id', { value: this.user.id });
		Object.defineProperty(this, 'group', { value: group });
		this.role = group.roles.get(data.role.id) || new Role(client, data.role, group);
	}
	async setRole(role) {
		const config = {
			method: 'patch',
			data: {
				roleId: role.id,
			},
		};
		await this.client.http('https://groups.roblox.com/v1/groups/' + this.group.id + '/users/' + this.user.id, config);
		this.role = role;
		return this;
	}
};
