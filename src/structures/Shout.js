const Base = require('./Base');
const User = require('./User');

/**
 * Represents a group shout.
 * To create a new shout, use the {NewShout} class.
 */
class Shout extends Base {
	constructor(client, data, group) {
		super(client);
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
		Object.defineProperty(this, 'time', { value: data.updated });
		/**
		 * @property {Group} group The group this shout belongs to
		 */
		Object.defineProperty(this, 'group', { value: group });
	}
}

module.exports = Shout;