import { Client } from './Client';
/**
 * Base class for every library class that has an id
 */
export class Base {
	readonly client: Client;
	readonly id: number;
	protected constructor(client: Client, id: number) {
		this.client = client;
		this.id = id;
	}

	valueOf(): number {
		return this.id;
	}
}