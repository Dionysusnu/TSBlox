import { AxiosError } from 'axios';
import { Base } from './Base';
import { Collection } from './Collection';
import { Client } from './Client';
import { User, UserData } from './User';
import { Role, RoleData } from './Role';
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

interface GroupMemberResponse {
	role: RoleData;
	user: UserData;
}
/**
 * Represents a group
 */
export class Group extends Base {
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
		 * @property {string} name The name of this group
		 */
		this.name = data.name;
		/**
		 * @property {string} description The description of this group
		 */
		this.description = data.description;
		/**
		 * @property {User} owner The owner of this group
		 */
		this.owner = this.getOwner(data.owner);
		/**
		 * @property {Shout} status The current group shout
		 */
		this.status = data.shout && new Shout(client, data.shout, this);
		/**
		 * @property {integer} memberCount The current amount of members in this group
		 */
		this.memberCount = data.memberCount;
		/**
		 * @property {boolean} isBuildersClubOnly If true, only users with builders club or roblox premium can join this group
		 */
		this.isBuildersClubOnly = data.isBuildersClubOnly;
		/**
		 * @property {boolean} hasClan Determines whether this group has a clan
		 */
		this.hasClan = data.hasClan;
		/**
		 * @property {boolean} public If true, anyone can join this group. If false, users have to send a join request first
		 */
		this.isPublic = data.publicEntryAllowed;
		/**
		 * @property {boolean} locked If true, the group can't be joined
		 */
		this.isLocked = data.isLocked;
		this.members = new Collection(this.client);
		/**
		 * @property {Collection} roles All known roles in this group
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

	private async getOwner(owner: UserData): Promise<GroupMember> {
		const member = await this.member(this.client.users.get(owner.userId) || new User(this.client, owner)).catch(err => {
			throw err;
		});
		if (!member) {
			throw new Error('Group owner not in group');
		}
		return member;
	}

	public async member(user: User): Promise<GroupMember | null> {
		if (!(user instanceof User)) throw new TypeError('Argument 1 must be a user instance');
		const response = await this.client.http(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`, {
			method: 'GET',
		});
		const userGroups = response.data.data;
		for (const groupResponse of userGroups) {
			this.client.debug && console.log(groupResponse);
			if (groupResponse.group.id === this.id) {
				const cached = this.members.get(user.id);
				const groupRole = this.roles.get(groupResponse.role.id);
				if (cached) {
					if (cached.role === groupRole) {
						cached.role.update(groupResponse.role);
					} else {
						cached.role = groupRole || new Role(this.client, groupResponse.role, this);
					}
					return cached;
				} else {
					return new GroupMember(this.client, {
						role: groupRole || new Role(this.client, groupResponse.role, this),
						user: user,
					}, this);
				}
			}
		}
		return null;
	}
	/**
	 * Function to retrieve all current members of the group
	 * @returns {Collection}
	 */
	public async getMembers(): Promise<Collection<Base['id'], GroupMember>> {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
		this.members = await this.client.util.getPages(url, GroupMember, this, (data: GroupMemberResponse) => {
			return {
				user: this.client.users.get(data.user.userId) || new User(this.client, data.user),
				role: this.roles.get(data.role.id) || new Role(this.client, data.role, this),
			};
		});
		return this.members;
	}

	/**
	 * Function to retrieve all rolesets
	 * @returns {Collection}
	 */
	public async getRoles(): Promise<Collection<Base['id'], Role>> {
		const response = await this.client.http(`https://groups.roblox.com/v1/groups/${this.id}/roles`, {
			method: 'GET',
		});
		for (const data of response.data.roles) {
			const role = this.client.roles.get(data.id);
			role && role.update(data) || new Role(this.client, data, this);
		}
		return this.roles;
	}

	/**
	 * Shouts on the group
	 * @param {string} message The content of the shout
	 * @returns {Shout} The posted shout
	 */
	public async shout(message: string): Promise<Shout> {
		if (typeof message !== 'string') throw new TypeError('Argument 1 must be a string');
		const url = `https://groups.roblox.com/v1/groups/${this.id}/status`;
		const response = await this.client.http(url, {
			method: 'PATCH',
			data: {
				message: message,
			},
		}).catch((err: AxiosError) => {
			const errResponse = err.response;
			if (errResponse) {
				switch (errResponse.status) {
					case 400: {
						switch (errResponse.data.errors[1].code) {
							case 1: {
								throw new Error('Group is invalid');
							}
							case 6: {
								throw new Error('Lacking permissions');
							}
							case 7: {
								throw new Error('Empty shout not possible');
							}
						}
						break;
					}
				}
			}
			throw err;
		});
		return new Shout(this.client, response as unknown as ShoutData, this);
	}

	/**
	 * Updates the group's description
	 * @param {string} description The new description for the group
	 * @returns {Group} This group, with the updated description
	 */
	public async setDescription(description: string): Promise<Group> {
		if (typeof description !== 'string') throw new TypeError('argument 1 must be a string');
		const url = `https://groups.roblox.com/v1/groups/${this.id}/description`;
		await this.client.http(url, {
			method: 'PATCH',
			data: {
				description: description,
			},
		}).catch((err: AxiosError) => {
			const errResponse = err.response;
			if (errResponse) {
				switch (errResponse.status) {
					case 400: {
						switch (errResponse.data.errors[1].code) {
							case 1: {
								throw new Error('Group is invalid');
							}
							case 29: {
								throw new Error('Empty description not possible');
							}
						}
						break;
					}
					case 403: {
						switch (errResponse.data.errors[1].code) {
							case 18: {
								throw new Error('Description too long');
							}
							case 23: {
								throw new Error('Lacking permissions');
							}
						}
						break;
					}
				}
			}
			throw err;
		});
		this.description = description;
		return this;
	}
}