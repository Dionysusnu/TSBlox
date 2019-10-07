import { AxiosError } from 'axios';
import { Base } from './Base';
import { Collection } from './Collection';
import { Client } from './Client';
import { User } from './User';
import { Role } from './Role';
import { GroupMember } from './GroupMember';
import { Shout } from './Shout';
import { ShoutData, UserData } from '../Interfaces';

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
/**
 * Represents a group
 */
export class Group extends Base {
	description: string;
	owner: any;
	status: Shout;
	memberCount: any;
	isBuildersClubOnly: any;
	hasClan: any;
	public: any;
	locked: any;
	roles: Collection<Role>;
	client: any;
	members: any;
	id: any;
	constructor(client: Client, data: GroupData) {
		super(client, data.id);
		/**
		 * @property {integer} id The id of this group
		 */
		Object.defineProperty(this, 'id', { value: data.id });
		/**
		 * @property {string} name The name of this group
		 */
		Object.defineProperty(this, 'name', { value: data.name });
		/**
		 * @property {string} description The description of this group
		 */
		this.description = data.description;
		/**
		 * @property {User} owner The owner of this group
		 */
		const owner = client.users.get(data.owner.userId);
		owner && owner.update(data.owner);
		this.owner = owner || new User(client, data.owner);
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
		this.public = data.publicEntryAllowed;
		/**
		 * @property {boolean} locked If true, the group can't be joined
		 */
		this.locked = data.isLocked;
		/**
		 * @property {Collection} roles All known roles in this group
		 */
		this.roles = new Collection(this.client);
		client.groups.set(this.id, this);
	}

	update(data: GroupData): void {
		this.description = data.description;
		this.owner = this.client.users.get(data.owner.userId) || new User(this.client, data.owner);
		this.status = data.shout && new Shout(this.client, data.shout, this);
		this.memberCount = data.memberCount;
		this.isBuildersClubOnly = data.isBuildersClubOnly;
		this.hasClan = data.hasClan;
		this.public = data.publicEntryAllowed;
		this.locked = data.isLocked;
	}

	/**
	 * Function to retrieve all current members of the group
	 * @returns {Collection}
	 */
	async getMembers(): Promise<Collection<GroupMember>> {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
		this.members = await this.client.util.getPages(url, GroupMember, this);
		return this.members;
	}

	/**
	 * Function to retrieve all rolesets
	 * @returns {Collection}
	 */
	async getRoles(): Promise<Collection<Role>> {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/roles`;
		const response = await this.client.http(url);
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
	async shout(message: string): Promise<Shout> {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/status`;
		const response = await this.client.http(url, {
			method: 'patch',
			data: {
				message: message,
			},
		}).catch((err: AxiosError) => {
			const errResponse = err.response;
			if (errResponse) {
				switch(errResponse.status) {
				case 400: {
					switch(errResponse.data.errors[1].code) {
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
		return new Shout(this.client, response, this);
	}

	/**
	 * Updates the group's description
	 * @param {string} description The new description for the group
	 * @returns {Group} This group, with the updated description
	 */
	async setDescription(description: string): Promise<Group> {
		const url = `https://groups.roblox.com/v1/groups/${this.id}/description`;
		await this.client.http(url, {
			method: 'patch',
			data: {
				description: description,
			},
		}).catch((err: AxiosError) => {
			const errResponse = err.response;
			if (errResponse) {
				switch(errResponse.status) {
				case 400: {
					switch(errResponse.data.errors[1].code) {
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
					switch(errResponse.data.errors[1].code) {
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