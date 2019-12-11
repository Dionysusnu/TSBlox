import { Client } from './Client';
/**
 * Class to store objects with ID
 */
export class Collection<key, stores> extends Map<key, stores> {
	public client: Client;
	public constructor(client: Client, iterable?: readonly (readonly [key, stores])[]) {
		super(iterable);
		if (iterable) {
			for (const item of iterable) {
				this.set(item[0], item[1]);
			}
		}
		this.client = client;
	}

	public first(): stores {
		return this.values().next().value;
	}

	public firstKey(): key {
		return this.keys().next().value;
	}

	public last(count: number): stores | Array<stores> {
		if (count !== undefined && typeof count !== 'number') throw new TypeError();
		const arr = this.array();
		if (count === undefined) {
			return arr[arr.length - 1];
		} else {
			return arr.slice(-count);
		}
	}

	public lastKey(count: number): key | Array<key> {
		if (count !== undefined && typeof count !== 'number') throw new TypeError();
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
	public includes(search: stores): boolean {
		if (typeof search !== 'number') throw new TypeError('argument 1 must be a number');
		for (const [, item] of this) {
			if (item === search) {
				return true;
			}
		}
		return false;
	}

	public includesKey(search: key): boolean {
		for (const [key] of this) {
			if (key === search) {
				return true;
			}
		}
		return false;
	}

	public filter(filterFunction: Function): Collection<key, stores> {
		if (typeof filterFunction !== 'function') throw new TypeError('Argument 1 must be a function');
		const filtered = new Collection<key, stores>(this.client);
		for (const [id, object] of this) {
			if (filterFunction(object)) {
				filtered.set(id, object);
			}
		}
		return filtered;
	}

	public filterKeys(filterFunction: Function): Collection<key, stores> {
		if (typeof filterFunction !== 'function') throw new TypeError('Argument 1 must be a function');
		const filtered = new Collection<key, stores>(this.client);
		for (const [id, object] of this) {
			if (filterFunction(id)) {
				filtered.set(id, object);
			}
		}
		return filtered;
	}

	public array(): Array<stores> {
		return [...this.values()];
	}

	public keyArray(): Array<key> {
		return [...this.keys()];
	}
}