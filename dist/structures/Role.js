"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Group_1 = require("./Group");
class Role extends Base_1.Base {
    constructor(client, data, group) {
        if (!(group instanceof Group_1.Group))
            throw new TypeError('argument 3 must be a group instance');
        super(client, data.id);
        this.group = group;
        Object.defineProperty(this, 'name', { value: data.name });
        this.rank = data.rank;
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
