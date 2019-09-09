const Collection = require('./structures/Collection');

module.exports = {
	function getPages(url, objectType) {
		// Supported types: [GroupMember, Asset]
		const initialResponse = await this.client.http(url, {
			params: {
				limit: 100,
			},
		});
		let nextCursor = initialResponse.data.nextPageCursor;
		const array = [];
		for (const user of initialResponse.data.data) {
			array.push(new objectType(this.client, user, this));
		}
		while (nextCursor) {
			const response = await this.client.http(url, { params: {
				cursor: nextCursor,
				limit: 100,
			},
			});
			nextCursor = response.data.nextPageCursor;
			for (const user of response.data.data) {
				array.push(new objectType(this.client, user, this));
			}
		}
		return new Collection(this.client, array);
	}
};
