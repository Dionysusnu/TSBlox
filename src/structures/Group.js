const axios = require('axios');

const Base = require('./Base');
const Collection = require('./Collection');

module.exports = class Group extends Base {
	constructor(client) {
		super(client);
	}

	fillData() {
		const members = axios();
		this.members = new Collection(this.client, members);
	}
};