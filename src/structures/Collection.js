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
	 * Returns the first value in this collection
	 * @returns {*} The first value
	 */
	first() {
		return this.values().next().value;
	}

	/**
	 * Returns true if the object is in this collection
	 * @param {Object} search The object to search for
	 * @returns {boolean} Whether the object was found
	 */
	includes(search) {
		for (const [, item] of this) {
			if (item === search) {
				return true;
			}
		}
		return false;
	}
}

module.exports = Collection;