import { Base } from './Base';
import { Client } from './Client';
import { Group } from './Group';

export interface RoleData {
	id: number;
	name: string;
	rank: number;
	memberCount?: number;
}
/**
 * Represents a roleset in a group
 */
export class Role extends Base {
	public readonly group: Group;
	public rank: number;
	public memberCount?: number;
	public constructor(client: Client, data: RoleData, group: Group) {
		if (!(group instanceof Group)) throw new TypeError('argument 3 must be a group instance');
		super(client, data.id);
		/**
		 * @property {Group} group The group this roleset belongs to
		 */
		this.group = group;
		/**
		 * @property {string} name The name of this roleset
		 */
		Object.defineProperty(this, 'name', { value: data.name });
		/**
		 * @property {integer} rank An integer between 1-255 representing the order of the roleset in the group
		 */
		this.rank = data.rank;
		/**
		 * @property {integer} memberCount An integer representing the amount of members with this role
		 */
		this.memberCount = data.memberCount;

		group.roles.set(this.id, this);
		client.roles.set(this.id, this);
	}

	public update(data: RoleData): void {
		this.rank = data.rank;
		this.memberCount = data.memberCount;
	}
}