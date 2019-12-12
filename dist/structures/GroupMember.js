"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Group_1 = require("./Group");
const Role_1 = require("./Role");
const Errors_1 = require("../util/Errors");
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
                1: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('Group is invalid', errResponse, Group_1.Group);
                },
                2: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('Role is invalid', errResponse, Role_1.Role);
                },
                3: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('GroupMember is invalid', errResponse, GroupMember);
                },
            },
            403: {
                4: (errResponse) => {
                    return new Errors_1.MissingPermissionsError('MANAGE_ROLES', errResponse, this.group);
                },
            },
        });
        this.role = role;
        return this;
    }
}
exports.GroupMember = GroupMember;
