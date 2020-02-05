"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const Base_1 = require("./Base");
const Collection_1 = require("./Collection");
const User_1 = require("./User");
const Role_1 = require("./Role");
const GroupMember_1 = require("./GroupMember");
const Shout_1 = require("./Shout");
const Util_1 = require("../util/Util");
const Errors_1 = require("../util/Errors");
const GroupData = joi_1.default.object({});
class Group extends Base_1.Base {
    constructor(client, data) {
        super(client, data.id);
        this.name = data.name;
        this.description = data.description;
        this.owner = this.getOwner(data.owner);
        this.status = data.shout && new Shout_1.Shout(client, data.shout, this);
        this.memberCount = data.memberCount;
        this.isBuildersClubOnly = data.isBuildersClubOnly;
        this.hasClan = data.hasClan;
        this.isPublic = data.publicEntryAllowed;
        this.isLocked = data.isLocked;
        this.members = new Collection_1.Collection(this.client);
        this.roles = new Collection_1.Collection(this.client);
        client.groups.set(this.id, this);
    }
    update(data) {
        this.description = data.description || this.description;
        this.owner = this.getOwner(data.owner);
        this.status = data.shout && new Shout_1.Shout(this.client, data.shout, this) || this.status;
        this.memberCount = data.memberCount || this.memberCount;
        this.isBuildersClubOnly = data.isBuildersClubOnly || this.isBuildersClubOnly;
        this.hasClan = data.hasClan;
        this.isPublic = data.publicEntryAllowed;
        this.isLocked = data.isLocked;
    }
    async refresh() {
        return await this.client.getGroup(this.id, this);
    }
    async getOwner(owner) {
        const member = await this.member(this.client.users.get(owner.userId) || new User_1.User(this.client, owner)).catch(err => {
            throw err;
        });
        if (!member) {
            throw new Error('Group owner not in group');
        }
        return member;
    }
    async member(user) {
        Util_1.typeCheck(user, User_1.User);
        const response = await this.client.http(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`, {
            method: 'GET',
        }, {
            400: {
                3: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('User is invalid', errResponse, User_1.User);
                },
            },
        });
        const userGroups = response.data.data;
        for (const groupResponse of userGroups) {
            this.client.debug && console.log(groupResponse);
            if (groupResponse.group.id === this.id) {
                const cached = this.members.get(user.id);
                const groupRole = this.roles.get(groupResponse.role.id);
                if (cached) {
                    if (cached.role === groupRole) {
                        cached.role.update(groupResponse.role);
                    }
                    else {
                        cached.role = groupRole || new Role_1.Role(this.client, groupResponse.role, this);
                    }
                    return cached;
                }
                else {
                    return new GroupMember_1.GroupMember(this.client, {
                        role: groupRole || new Role_1.Role(this.client, groupResponse.role, this),
                        user: user,
                    }, this);
                }
            }
        }
        throw new Errors_1.ItemNotFoundError('User not in group', response, GroupMember_1.GroupMember);
    }
    async getMembers() {
        const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
        this.members = await Util_1.getPages(url, GroupMember_1.GroupMember, this, {
            400: {
                1: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('Group is invalid', errResponse, Group);
                },
            },
        }, (data) => {
            return {
                user: this.client.users.get(data.user.userId) || new User_1.User(this.client, data.user),
                role: this.roles.get(data.role.id) || new Role_1.Role(this.client, data.role, this),
            };
        });
        return this.members;
    }
    async getRoles() {
        const response = await this.client.http(`https://groups.roblox.com/v1/groups/${this.id}/roles`, {
            method: 'GET',
        }, {
            400: {
                3: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('Group is invalid', errResponse, Group);
                },
            },
        });
        let memberCount = 0;
        for (const data of response.data.roles) {
            const role = this.client.roles.get(data.id);
            role && role.update(data) || new Role_1.Role(this.client, data, this);
            memberCount += data.memberCount;
        }
        this.memberCount = memberCount;
        return this.roles;
    }
    async shout(message) {
        if (typeof message !== 'string')
            throw new TypeError('Argument 1 must be a string');
        const url = `https://groups.roblox.com/v1/groups/${this.id}/status`;
        const response = await this.client.http(url, {
            method: 'PATCH',
            data: {
                message: message,
            },
        }, {
            400: {
                1: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('Group is invalid', errResponse, Group);
                },
                6: (errResponse) => {
                    return new Errors_1.MissingPermissionsError('MANAGE_STATUS', errResponse, this);
                },
                7: new Error('Empty shout not possible'),
            },
            500: {
                0: new Error('Shout too long'),
            },
        });
        return new Shout_1.Shout(this.client, response.data, this);
    }
    async setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError('argument 1 must be a string');
        const url = `https://groups.roblox.com/v1/groups/${this.id}/description`;
        await this.client.http(url, {
            method: 'PATCH',
            data: {
                description: description,
            },
        }, {
            400: {
                1: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('Group is invalid', errResponse, Group);
                },
                29: new Error('Empty description not possible'),
            },
            403: {
                18: new Error('Description too long'),
                23: (errResponse) => {
                    return new Errors_1.MissingPermissionsError('MANAGE_GROUP', errResponse, this);
                },
            },
        });
        this.description = description;
        return this;
    }
}
exports.Group = Group;
