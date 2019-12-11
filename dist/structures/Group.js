"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Collection_1 = require("./Collection");
const User_1 = require("./User");
const Role_1 = require("./Role");
const GroupMember_1 = require("./GroupMember");
const Shout_1 = require("./Shout");
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
        if (!(user instanceof User_1.User))
            throw new TypeError('Argument 1 must be a user instance');
        const response = await this.client.http(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`, {
            method: 'GET',
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
        return null;
    }
    async getMembers() {
        const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
        this.members = await this.client.util.getPages(url, GroupMember_1.GroupMember, this, (data) => {
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
        });
        for (const data of response.data.roles) {
            const role = this.client.roles.get(data.id);
            role && role.update(data) || new Role_1.Role(this.client, data, this);
        }
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
        }).catch((err) => {
            const errResponse = err.response;
            if (errResponse) {
                switch (errResponse.status) {
                    case 400: {
                        switch (errResponse.data.errors[1].code) {
                            case 1: {
                                throw new Error('Group is invalid');
                            }
                            case 6: {
                                throw new Error('Lacking permissions');
                            }
                            case 7: {
                                throw new Error('Empty shout not possible');
                            }
                        }
                        break;
                    }
                }
            }
            throw err;
        });
        return new Shout_1.Shout(this.client, response, this);
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
        }).catch((err) => {
            const errResponse = err.response;
            if (errResponse) {
                switch (errResponse.status) {
                    case 400: {
                        switch (errResponse.data.errors[1].code) {
                            case 1: {
                                throw new Error('Group is invalid');
                            }
                            case 29: {
                                throw new Error('Empty description not possible');
                            }
                        }
                        break;
                    }
                    case 403: {
                        switch (errResponse.data.errors[1].code) {
                            case 18: {
                                throw new Error('Description too long');
                            }
                            case 23: {
                                throw new Error('Lacking permissions');
                            }
                        }
                        break;
                    }
                }
            }
            throw err;
        });
        this.description = description;
        return this;
    }
}
exports.Group = Group;
