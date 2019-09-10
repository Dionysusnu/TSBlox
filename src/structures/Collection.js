/** Class to store objects with ID */
class Collection extends Map {
	/**
	 * @param {Client} client a Client
	 * @param {Iterable} iterable an iterable object, which will be used to fill the Collection
	 */
	constructor(client, iterable) {
		super();
		Object.defineProperty(this, 'client', { value: client });
		if (iterable) for (const item of iterable) this.set(item.id, item);
	}

	/**
	 * returns the first value
	 * @return {*}
	 */
	first() {
		return this.values().next().value;
	}
}

module.exports = Collection;