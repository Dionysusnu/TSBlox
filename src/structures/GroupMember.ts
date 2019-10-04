import { AxiosError } from 'axios';
import { Base } from './Base';
import { Client } from './Client';
import { User } from './User';
import { Group } from './Group';
import { Role } from './Role';
import { RoleData, UserData } from '../Interfaces';
interface GroupMemberData {
	role: RoleData;
	user: UserData;
}

/**
 * Represents a user in a group
 */
export class GroupMember extends Base {
	readonly user: User;
	readonly group: Group;
	role: Role;
	constructor(client: Client, data: GroupMemberData, group: Group) {
		const user = new User(client, data.user);
		super(client, user.id);
		/**
		 * @property {User} user The user
		 */
		this.user = user;
		/**
		 * @property {Group} group The group this member is part of
		 */
		this.group = group;
		/**
		 * @property {Role} role The current role of this member
		 */
		this.role = group.roles.get(data.role.id) || new Role(client, data.role, group);
	}

	/**
	 * Sets the member's role
	 * @param {Role} role The new role for this user
	 * @returns {GroupMember} This member, with the updated role
	 */
	async setRole(role: Role): Promise<GroupMember> {
		const config = {
			method: 'PATCH',
			data: {
				roleId: role.id,
			},
		};
		await this.client.http(`https://groups.roblox.com/v1/groups/${this.group.id}/users/${this.user.id}`, config).catch((err: AxiosError) => {
			const errResponse = err.response;
			if (errResponse) {
				switch(errResponse.status) {
				case 400: {
					switch(errResponse.data.errors[1].code) {
					case 1: {
						throw new Error('Group is invalid');
					}
					case 2: {
						throw new Error('Role is invalid');
					}
					case 3: {
						throw new Error('User is invalid');
					}
					}
					break;
				}
				case 403: {
					switch(errResponse.data.errors[1].code) {
					case 4: {
						throw new Error('Lacking permissions');
					}
					}
					break;
				}
				}
			}
			throw err;
		});
		this.role = role;
		return this;
	}
}