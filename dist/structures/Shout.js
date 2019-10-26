(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./User"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const User_1 = require("./User");
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
            Object.defineProperty(this, 'poster', { value: client.users.get(data.poster.userId) || new User_1.User(client, data.poster) });
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
});
