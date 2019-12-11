import { Base } from './Base';
import { Client } from './Client';
import { User } from './User';
import { Group } from './Group';
import { Role } from './Role';
interface GroupMemberData {
	role: Role;
	user: User;
}

/**
 * Represents a user in a group
 */
export class GroupMember extends Base {
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
				1: 'Group is invalid',
				2: 'Role is invalid',
				3: 'User is invalid',
			},
			403: {
				4: 'Lacking permissions',
			},
		});
		this.role = role;
		return this;
	}
}