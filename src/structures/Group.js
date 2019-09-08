const axios = require('axios');

const Base = require('./Base');
const Collection = require('./Collection');
const GroupMember = require('./GroupMember');
const User = require('./User');

module.exports = class Group extends Base {
	constructor(client, data) {
		super(client);
		Object.defineProperty(this, 'id', { value: data.id });
		Object.defineProperty(this, 'name', { value: data.name });
		this.description = data.description;
		this.owner = client.users.get(data.owner.userId) || new User(client, data.owner);
	}

	async fillData() {
		const url = 'https://groups.roblox.com/v1/groups/' + this.id + '/users';
		const initialResponse = await this.client.http.get(url, { params: {
			limit: 100,
		},
		});
		let nextCursor = initialResponse.body.nextPageCursor;
		const responseMembers = [];
		for (const user of initialResponse.body.data) {
			responseMembers.push(new GroupMember(this.client, user, this));
		}
		while (nextCursor) {
			const response = await axios.get(url, { params: {
				cursor: nextCursor,
				limit: 100,
			},
			});
			nextCursor = response.body.nextPageCursor;
			for (const user of response.body.data) {
				responseMembers.push(new GroupMember(this.client, user, this));
			}
		}
		this.members = new Collection(this.client, responseMembers);
	}
};
