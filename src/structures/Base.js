module.exports = class Base {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });
	}

	valueOf() {
		return this.id;
	}
};