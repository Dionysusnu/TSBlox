import { AxiosError } from 'axios';
import { Base } from './Base';
import { Badge } from './Badge';
import { Collection } from './Collection';
import { Client } from './Client';
import { getPages } from '../util/Util';
import { ItemNotFoundError } from '../util/Errors';

export type BCMembershipType = 'None' | 'BC' | 'TBC' | 'OBC' | 'RobloxPremium';
export interface UserData {
	username: string;
	buildersClubMembershipType: BCMembershipType;
	userId: number;
}

/**
 * Represents a user on roblox
 */
export class User extends Base {
	public username: string;
	public membership: BCMembershipType;
	public badges: Collection<Base['id'], Badge>;
	public constructor(client: Client, data: UserData) {
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

	public update(data: UserData): void {
		this.username = data.username;
		this.membership = data.buildersClubMembershipType;
	}

	public async getBadges(): Promise<Collection<Base['id'], Badge>> {
		this.badges = await getPages(`https://badges.roblox.com/v1/users/${this.id}/badges`, Badge, this, {
			404: {
				4: (errResponse): Error => {
					return new ItemNotFoundError('User is invalid', errResponse, User);
				},
			},
		}).catch((err: AxiosError | Error) => {
			if ('response' in err) {
				switch (err.response && err.response.status) {
					case 404: {
						if (err.response) {
							switch (err.response.data.errors[1].code) {
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