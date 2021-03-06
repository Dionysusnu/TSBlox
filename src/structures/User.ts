import Base from './Base';
import Badge from './Badge';
import Collection from './Collection';
import Client from './Client';
import { getPages } from '../util/Util';
import { UserData, BCMembershipType } from '../util/Schemes';

/**
 * Represents a user on roblox
 */
export default class User extends Base {
  public username: string;

  public membership: BCMembershipType;

  public badges: Collection<Base['id'], Badge>;

  public constructor(client: Client, data: UserData) {
    UserData.validate(data);
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
        4: (errResponse): Error => new ItemNotFoundError('User is invalid', errResponse, User),
      },
    });
    this.badges.forEach((badge) => {
      badge.owners.set(this.id, this);
    });
    return this.badges;
  }
}
