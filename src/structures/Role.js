const Base = require('./Base');

module.exports = class Role extends Base {
	constructor(client, data, group) {
		super(client);
		Object.defineProperty(this, 'group', { value: group });
		Object.defineProperty(this, 'id', { value: data.id });
		this.name = data.name;
		this.rank = data.rank;
		this.memberCount = data.memberCount;
	}
}
