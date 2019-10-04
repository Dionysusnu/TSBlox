import { AxiosError } from 'axios';
import { Base, Badge, Client, Collection } from '../Structures';

export type BCMembershipType = 'None'|'BC'|'TBC'|'OBC'|'RobloxPremium';
export interface UserData {
	username: string;
	buildersClubMembershipType: BCMembershipType;
	userId: number;
}

/**
 * Represents a user on roblox
 */
export class User extends Base {
	username: string;
	membership: BCMembershipType;
	badges: Collection<Badge>;
	constructor(client: Client, data: UserData) {
		super(client, data.userId);
		/**
		 * @property {string} username The username of this user
		 */
		this.username = data.username;
		/**
		 * @property {MembershipType} membership The builders club membership type
		 */
		this.membership = data.buildersClubMembershipType;
		/**
		 * @property {Collection} badges The badges this user has earned
		 */
		this.badges = new Collection(this.client);
		client.users.set(this.id, this);
	}

	update(data: UserData): void {
		this.username = data.username;
		this.membership = data.buildersClubMembershipType;
	}

	async getBadges(): Promise<Collection<Badge>> {
		this.badges = await this.client.util.getPages(`https://badges.roblox.com/v1/users/${this.id}/badges`, Badge, this).catch((err: AxiosError | Error) => {
			if ('response' in err) {
				switch(err.response && err.response.status) {
				case 404: {
					if (err.response) {
						switch(err.response.data.errors[1].code) {
						case 4: {
							throw new Error('User is invalid');
						}
						}
					}
					break;
				}
				}
			}
			throw err;
		});
		for (const [, badge] of this.badges) {
			badge.owners.set(this.id, this);
		}
		return this.badges;
	}
}