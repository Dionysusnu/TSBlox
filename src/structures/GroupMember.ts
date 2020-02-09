import Base from './Base';
import Client from './Client';
import User from './User';
import Group from './Group';
import Role from './Role';
import MissingPermissionsError from '../util/MissingPermissionsError';

interface GroupMemberData {
  role: Role;
  user: User;
}

/**
 * Represents a user in a group
 */
export default class GroupMember extends Base {
  public readonly user: User;

  public readonly group: Group;

  public role: Role;

  public constructor(client: Client, data: GroupMemberData, group: Group) {
    super(client, data.user.id);
    /**
     * @property {User} user The user
     */
    this.user = data.user;
    /**
     * @property {Group} group The group this member is part of
     */
    this.group = group;
    /**
     * @property {Role} role The current role of this member
     */
    this.role = data.role;
  }

  /**
   * Sets the member's role
   * @param {Role} role The new role for this user
   * @returns {GroupMember} This member, with the updated role
   */
  public async setRole(role: Role): Promise<GroupMember> {
    await this.client.http(`https://groups.roblox.com/v1/groups/${this.group.id}/users/${this.user.id}`, {
      method: 'PATCH',
      data: {
        roleId: role.id,
      },
    }, {
      400: {
        1: (errResponse): Error => new ItemNotFoundError('Group is invalid', errResponse, Group),
        2: (errResponse): Error => new ItemNotFoundError('Role is invalid', errResponse, Role),
        3: (errResponse): Error => new ItemNotFoundError('GroupMember is invalid', errResponse, GroupMember),
      },
      403: {
        4: (errResponse): Error => new MissingPermissionsError('MANAGE_ROLES', errResponse, this.group),
      },
    });
    this.role = role;
    return this;
  }

  /**
   * Kicks the member out of the group
   * @returns {User} The user corresponding to this member
   */
  public async exile(): Promise<User> {
    await this.client.http(`https://groups.roblox.com/v1/groups/${this.group.id}/users/${this.user.id}`, {
      method: 'DELETE',
    }, {
      400: {
        1: (errResponse): Error => new ItemNotFoundError('Group is invalid', errResponse, Group),
        3: (errResponse): Error => new ItemNotFoundError('GroupMember is invalid', errResponse, GroupMember),
      },
      403: {
        4: (errResponse): Error => new MissingPermissionsError('EXILE_MEMBER', errResponse, this.group),
      },
      503: { // todo: make new RobloxAPIError class
        18: new Error('Roblox API unavailable'),
      },
    });
    return this.user;
  }
}
