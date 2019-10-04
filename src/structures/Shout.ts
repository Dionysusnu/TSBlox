import { Client, Group, User } from '../Structures';
import { UserData } from '../Interfaces';
export interface ShoutData {
	body: string;
	poster: UserData;
	updated: string;
}
/**
 * Represents a group shout.
 * To create a new shout, use Group.shout()
 */
export class Shout {
	constructor(client: Client, data: ShoutData, group: Group) {
		Object.defineProperty(this, 'client', { value: client });
		/**
		 * @property {string} message The content of this shout
		 */
		Object.defineProperty(this, 'message', { value: data.body });
		/**
		 * @property {User} poster The user that shouted this message
		 */
		Object.defineProperty(this, 'poster', { value: client.users.get(data.poster.userId) || new User(client, data.poster) });
		/**
		 * @property {string} timeUpdated The time this was shouted at
		 */
		Object.defineProperty(this, 'time', { value: new Date(data.updated) });
		/**
		 * @property {Group} group The group this shout belongs to
		 */
		Object.defineProperty(this, 'group', { value: group });
	}
}