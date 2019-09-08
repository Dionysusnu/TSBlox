const Base = require('./Base');
const Role = require('./Role');

module.exports = class GroupMember extends Base {
	constructor(client, data, group) {
		super(client);
    Object.defineProperty(this, 'user', { value: new User(client, data.user) });
    Object.defineProperty(this, 'group', { value: group });
    this.role = group.roles.get(data.role.id) || new Role(client, data, group);
	}
  
  setRole(role) {
    // WIP
  }
};
