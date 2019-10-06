import { Client } from './Client';
/**
 * Class to store objects with ID
 */
export class Collection<stores> extends Map<number, stores> {
	client: Client;
	constructor(client: Client, iterable?: readonly (readonly [number, stores])[]) {
		super(iterable);
		this.client = client;
	}

	first(): stores {
		return this.values().next().value;
	}

	/**
	 * Returns true if the object is in this collection
	 * @param {Object} search The object to search for
	 * @returns {boolean} Whether the object was found
	 */
	includes(search: stores): boolean {
		for (const [, item] of this) {
			if (item === search) {
				return true;
			}
		}
		return false;
	}
}