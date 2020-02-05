"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Group_1 = require("./Group");
const Util_1 = require("../util/Util");
class Role extends Base_1.Base {
    constructor(client, data, group) {
        Util_1.typeCheck(group, Group_1.Group);
        super(client, data.id);
        this.group = group;
        this.name = data.name;
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
