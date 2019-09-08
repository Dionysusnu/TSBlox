const Base = require('./Base');

module.exports = class Role extends Base {
	constructor(client, data, group) {
		super(client);
		Object.defineProperty(this, 'id', { value: data.id });
		Object.defineProperty(this, 'group', { value: group });
		group.roles.set(this.id, this);
		this.name = data.name;
		this.rank = data.rank;
		this.memberCount = data.memberCount;
	}
};