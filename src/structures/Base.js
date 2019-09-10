/**
 * Base class for every library class that has an id
 */
class Base {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });
	}

	valueOf() {
		return this.id || this;
	}
}

module.exports = Base;