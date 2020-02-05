import { Client } from './Client';
import { Group } from './Group';
import { User } from './User';
import { GroupMember } from './GroupMember';
import { ShoutData, UserData } from '../util/Schemes';

/**
 * Represents a group shout.
 * To create a new shout, use Group.shout()
 */
export class Shout {
  public readonly client: Client;

  public readonly message: string;

  public readonly author: Promise<GroupMember>;

  public readonly time: Date;

  public readonly group: Group;

  public constructor(client: Client, data: ShoutData, group: Group) {
    this.client = client;
    /**
		 * @property {string} message The content of this shout
		 */
    this.message = data.body;
    /**
		 * @property {string} time The time this was shouted at
		 */
    this.time = new Date(data.updated);
    /**
		 * @property {Group} group The group this shout belongs to
		 */
    this.group = group;
    /**
		 * @property {User} author The user that shouted this message
		 */
    this.author = this.getAuthor(data.poster);
  }

  private async getAuthor(author: UserData): Promise<GroupMember> {
    const member = await this.group.member(this.client.users.get(author.userId) || new User(this.client, author));
    if (!member) {
      throw new Error('Shout author not in group');
    }
    return member;
  }
}
