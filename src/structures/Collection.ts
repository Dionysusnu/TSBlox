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

	firstKey(): number {
		return this.keys().next().value;
	}

	last(count: number): stores | Array<stores> {
		const arr = this.array();
		if (count === undefined) {
			return arr[arr.length - 1];
		} else {
			return arr.slice(-count);
		}
	}

	lastKey(count: number): number | Array<number> {
		const arr = this.keyArray();
		if (count === undefined) {
			return arr[arr.length - 1];
		} else {
			return arr.slice(-count);
		}
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

	filter(filterFunction: Function): Collection<stores> {
		const filtered = new Collection<stores>(this.client);
		for (const [id, object] of this) {
			if (filterFunction(object)) {
				filtered.set(id, object);
			}
		}
		return filtered;
	}

	array(): Array<stores> {
		return [...this.values()];
	}

	keyArray(): Array<number> {
		return [...this.keys()];
	}
}