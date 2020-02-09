import Base from './Base';
import Client from './Client';
import { RoleData } from '../util/Schemes';
/**
 * Represents a roleset in a group
 */
export default class Role extends Base {
  public rank: number;

  public name: string;

  public memberCount?: number;

  public constructor(client: Client, data: RoleData) {
    super(client, data.id);
    /**
     * @property {string} name The name of this roleset
     */
    this.name = data.name;
    /**
     * @property {integer} rank An integer between 1-255 representing the order of the roleset in the group
     */
    this.rank = data.rank;
    /**
     * @property {integer} memberCount An integer representing the amount of members with this role
     */
    this.memberCount = data.memberCount;

    client.roles.set(this.id, this);
  }

  public update(data: RoleData): void {
    this.rank = data.rank;
    this.memberCount = data.memberCount;
  }
}
