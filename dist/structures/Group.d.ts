import Joi from 'joi';
import { Base } from './Base';
import { Collection } from './Collection';
import { Client } from './Client';
import { User, UserData } from './User';
import { Role } from './Role';
import { GroupMember } from './GroupMember';
import { Shout, ShoutData } from './Shout';

interface GroupData {
  owner: UserData;
  shout: ShoutData;
  memberCount: number;
  isBuildersClubOnly: boolean;
  hasClan: boolean;
  publicEntryAllowed: boolean;
  isLocked: boolean;
  id: number;
  name: string;
  description: string;
}
declare const GroupData: Joi.ObjectSchema;
export declare class Group extends Base {
  name: string;

  description: string;

  owner: Promise<GroupMember>;

  status: Shout;

  memberCount: number;

  isBuildersClubOnly: boolean;

  hasClan: boolean;

  isPublic: boolean;

  isLocked: boolean;

  roles: Collection<Base['id'], Role>;

  members: Collection<Base['id'], GroupMember>;

  constructor(client: Client, data: GroupData);

  update(data: GroupData): void;

  refresh(): Promise<this>;

  private getOwner;

  member(user: User): Promise<GroupMember>;

  getMembers(): Promise<Collection<Base['id'], GroupMember>>;

  getRoles(): Promise<Collection<Base['id'], Role>>;

  shout(message: string): Promise<Shout>;

  setDescription(description: string): Promise<Group>;
}
export {};
