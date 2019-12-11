import { Client } from './Client';
/**
 * Base class for every library class that has an id
 */
export class Base {
	public readonly client: Client;
	public readonly id: number;
	protected constructor(client: Client, id: number) {
		if (!(typeof id === 'number')) throw new TypeError('Argument 2 must be a number');
		this.client = client;
		this.id = id;
	}

	public valueOf(): number {
		return this.id;
	}
}