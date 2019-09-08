module.exports = class Collection extends Map {
	constructor(client, iterable) {
		super();
		Object.defineProperty(this, 'client', { value: client });
		if (iterable) for (const item of iterable) this.set(item.id, item);
	}
};