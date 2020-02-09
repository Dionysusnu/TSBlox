import Joi from 'joi';
import Base from './Base';
import Collection from './Collection';
import Client from './Client';
import User from './User';
import Role from './Role';
import GroupMember from './GroupMember';
import Shout from './Shout';
import { getPages, typeCheck } from '../util/Util';
import MissingPermissionsError from '../util/MissingPermissionsError';
import {
  RoleData, UserData, GroupData, ShoutData,
} from '../util/Schemes';
import api from '../util/ApiSchemes';

interface GroupMemberResponse {
  role: RoleData;
  user: UserData;
}
/**
 * Represents a group.
 */
export default class Group extends Base {
  public name: string;

  public description: string;

  public owner: Promise<GroupMember>;

  public status: Shout;

  public memberCount: number;

  public isBuildersClubOnly: boolean;

  public hasClan: boolean;

  public isPublic: boolean;

  public isLocked: boolean;

  public roles: Collection<Base['id'], Role>;

  public members: Collection<Base['id'], GroupMember>;

  public constructor(client: Client, data: GroupData) {
    super(client, data.id);
    /**
     * @property {string} name The name of this group.
     */
    this.name = data.name;
    /**
     * @property {string} description The description of this group.
     */
    this.description = data.description;
    /**
     * @property {Promise<GroupMember>} owner The owner of this group.
     */
    this.owner = this.getOwner(data.owner);
    /**
     * @property {Shout} status The current group shout.
     */
    this.status = data.shout && new Shout(client, data.shout, this);
    /**
     * @property {number} memberCount The current amount of members in this group.
     */
    this.memberCount = data.memberCount;
    /**
     * @property {boolean} isBuildersClubOnly If true, only users with builders club or roblox premium can join this group.
     */
    this.isBuildersClubOnly = data.isBuildersClubOnly;
    /**
     * @property {boolean} hasClan Determines whether this group has a clan.
     */
    this.hasClan = data.hasClan;
    /**
     * @property {boolean} public If true, anyone can join this group. If false, users have to send a join request first.
     */
    this.isPublic = data.publicEntryAllowed;
    /**
     * @property {boolean} locked If true, the group can't be joined.
     */
    this.isLocked = data.isLocked;
    this.members = new Collection(this.client);
    /**
     * @property {Collection} roles All cached roles in this group.
     */
    this.roles = new Collection(this.client);
    client.groups.set(this.id, this);
  }

  public update(data: GroupData): void {
    this.description = data.description || this.description; // For short responses
    this.owner = this.getOwner(data.owner);
    this.status = data.shout && new Shout(this.client, data.shout, this) || this.status;
    this.memberCount = data.memberCount || this.memberCount;
    this.isBuildersClubOnly = data.isBuildersClubOnly || this.isBuildersClubOnly;
    this.hasClan = data.hasClan;
    this.isPublic = data.publicEntryAllowed;
    this.isLocked = data.isLocked;
  }

  public async refresh(): Promise<this> {
    return this.client.getGroup(this.id, this);
  }

  private async getOwner(owner: UserData): Promise<GroupMember> {
    const member = await this.member(this.client.users.get(owner.userId) || new User(this.client, owner)).catch((err) => {
      throw err;
    });
    if (!member) {
      throw new Error('Group owner not in group');
    }
    return member;
  }

  public async member(user: User): Promise<GroupMember | undefined> {
    typeCheck(user, User);
    const response = await this.client.http(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`, {
      method: 'GET',
    }, {
      400: {
        3: (errResponse): Error => new ItemNotFoundError('User is invalid', errResponse, User),
      },
    });
    const userGroups = response.data.data;
    userGroups.forEach((groupResponse) => {
      if (groupResponse.group.id === this.id) {
        const cached = this.members.get(user.id);
        const groupRole = this.roles.get(groupResponse.role.id);
        if (cached) {
          if (cached.role === groupRole) {
            cached.role.update(groupResponse.role);
          } else {
            cached.role = groupRole ?? new Role(this.client, groupResponse.role, this);
          }
          return cached;
        }
        return new GroupMember(this.client, {
          role: groupRole ?? new Role(this.client, groupResponse.role, this),
          user,
        }, this);
      }
    });
    return undefined;
  }

  /**
   * Function to retrieve all current members of the group.
   *
   * @returns {Collection} The members of the group.
   */
  public async getMembers(): Promise<Collection<Base['id'], GroupMember>> {
    const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
    this.members = await getPages(url, GroupMember, this, {
      400: {
        1: (errResponse): Error => new ItemNotFoundError('Group is invalid', errResponse, Group),
      },
    }, (data: GroupMemberResponse) => ({
      user: this.client.users.get(data.user.userId) || new User(this.client, data.user),
      role: this.roles.get(data.role.id) || new Role(this.client, data.role, this),
    }));
    return this.members;
  }

  /**
   * Function to retrieve all rolesets.
   *
   * @returns {Collection} The rolesets in the group.
   */
  public async getRoles(): Promise<Collection<Base['id'], Role>> {
    const response = await this.client.http(`https://groups.roblox.com/v1/groups/${this.id}/roles`, {
      method: 'GET',
    }, {
      400: {
        3: (errResponse): Error => new ItemNotFoundError('Group is invalid', errResponse, Group),
      },
    });
    let memberCount = 0;
    response.data.roles.forEach((data) => {
      let role = this.client.roles.get(data.id);
      if (role) {
        role.update(data);
      } else {
        role = new Role(this.client, data);
      }
      memberCount += data.memberCount;
    });
    this.memberCount = memberCount;
    return this.roles;
  }

  /**
   * Shouts a message on the group.
   *
   * @param {string} message The content of the shout.
   * @returns {Shout} The posted shout.
   */
  public async shout(message: string): Promise<Shout> {
    typeCheck(message, 'string');
    const url = `https://groups.roblox.com/v1/groups/${this.id}/status`;
    const response = await this.client.http(url, {
      method: 'PATCH',
      data: {
        message,
      },
    }, {
      400: {
        1: (errResponse): Error => new ItemNotFoundError('Group is invalid', errResponse, Group),
        6: (errResponse): Error => new MissingPermissionsError('MANAGE_STATUS', errResponse, this),
        7: new Error('Empty shout not possible'),
      },
      500: {
        0: new Error('Shout too long'),
      },
    });
    Joi.assert(response.data, ShoutData);
    return new Shout(this.client, response.data, this);
  }

  /**
   * Updates the group's description.
   *
   * @param {string} description The new description for the group.
   * @returns {Group} This group, with the updated description.
   */
  public async setDescription(description: string): Promise<Group> {
    if (typeof description !== 'string') throw new TypeError('argument 1 must be a string');
    const url = `https://groups.roblox.com/v1/groups/${this.id}/description`;
    await this.client.http(url, {
      method: 'PATCH',
      data: {
        description,
      },
    }, {
      400: {
        1: (errResponse): Error => new ItemNotFoundError('Group is invalid', errResponse, Group),
        29: new Error('Empty description not possible'),
      },
      403: {
        18: new Error('Description too long'),
        23: (errResponse): Error => new MissingPermissionsError('MANAGE_GROUP', errResponse, this),
      },
    });
    this.description = description;
    return this;
  }
}
