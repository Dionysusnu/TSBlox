(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Base_1 = require("./Base");
    /**
     * Represents a roleset in a group
     */
    class Role extends Base_1.Base {
        constructor(client, data, group) {
            super(client, data.id);
            /**
             * @property {Group} group The group this roleset belongs to
             */
            this.group = group;
            /**
             * @property {string} name The name of this roleset
             */
            Object.defineProperty(this, 'name', { value: data.name });
            /**
             * @property {integer} rank An integer between 1-255 representing the order of the roleset in the group
             */
            this.rank = data.rank;
            /**
             * @property {integer} memberCount An integer representing the amount of members with this role
             */
            this.memberCount = data.memberCount;
            group.roles.set(this.id, this);
            client.roles.set(this.id, this);
        }
        update(data) {
            this.rank = data.rank;
            this.memberCount = data.memberCount;
        }
    }
    exports.Role = Role;
});
