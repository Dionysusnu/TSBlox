"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
class GroupMember extends Base_1.Base {
    constructor(client, data, group) {
        super(client, data.user.id);
        this.user = data.user;
        this.group = group;
        this.role = data.role;
    }
    async setRole(role) {
        await this.client.http(`https://groups.roblox.com/v1/groups/${this.group.id}/users/${this.user.id}`, {
            method: 'PATCH',
            data: {
                roleId: role.id,
            },
        }, {
            400: {
                1: 'Group is invalid',
                2: 'Role is invalid',
                3: 'User is invalid',
            },
            403: {
                4: 'Lacking permissions',
            },
        });
        this.role = role;
        return this;
    }
}
exports.GroupMember = GroupMember;
