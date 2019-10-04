"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../Structures");
/**
 * Represents a group shout.
 * To create a new shout, use Group.shout()
 */
class Shout {
    constructor(client, data, group) {
        Object.defineProperty(this, 'client', { value: client });
        /**
         * @property {string} message The content of this shout
         */
        Object.defineProperty(this, 'message', { value: data.body });
        /**
         * @property {User} poster The user that shouted this message
         */
        Object.defineProperty(this, 'poster', { value: client.users.get(data.poster.userId) || new Structures_1.User(client, data.poster) });
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
exports.Shout = Shout;
