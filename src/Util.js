const Collection = require('./structures/Collection');

module.exports = {
	/**
	 * Gets all data from a pages API
	 * @param {*} url URL to get pages from
	 * @param {*} objectType The class to construct
	 * @param {*} constructorParent The object to pass to the class constructor, or an object with a client property
	 * @returns {Collection} A collection filled with the retrieved items
	 */
	async getPages(url, objectType, constructorParent) {
		// Supported types: [GroupMember, Asset]
		const initialResponse = await constructorParent.client.http(url, {
			params: {
				limit: 100,
			},
		});
		let nextCursor = initialResponse.data.nextPageCursor;
		const array = [];
		for (const user of initialResponse.data.data) {
			array.push(new objectType(constructorParent.client, user, constructorParent));
		}
		while (nextCursor) {
			const response = await constructorParent.client.http(url, { params: {
				cursor: nextCursor,
				limit: 100,
			},
			});
			nextCursor = response.data.nextPageCursor;
			for (const user of response.data.data) {
				array.push(new objectType(constructorParent.client, user, constructorParent));
			}
		}
		return new Collection(constructorParent.client, array);
	},
};
