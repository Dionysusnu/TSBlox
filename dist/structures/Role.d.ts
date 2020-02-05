import { Base } from './Base';
import { Client } from './Client';
import { Group } from './Group';

export interface RoleData {
  id: number;
  name: string;
  rank: number;
  memberCount?: number;
}
export declare class Role extends Base {
  readonly group: Group;

  rank: number;

  name: string;

  memberCount?: number;

  constructor(client: Client, data: RoleData, group: Group);

  update(data: RoleData): void;
}
