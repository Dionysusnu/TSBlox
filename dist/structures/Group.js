"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Collection_1 = require("./Collection");
const User_1 = require("./User");
const Role_1 = require("./Role");
const GroupMember_1 = require("./GroupMember");
const Shout_1 = require("./Shout");
/**
 * Represents a group
 */
class Group extends Base_1.Base {
    constructor(client, data) {
        super(client, data.id);
        /**
         * @property {integer} id The id of this group
         */
        Object.defineProperty(this, 'id', { value: data.id });
        /**
         * @property {string} name The name of this group
         */
        Object.defineProperty(this, 'name', { value: data.name });
        /**
         * @property {string} description The description of this group
         */
        this.description = data.description;
        /**
         * @property {User} owner The owner of this group
         */
        const owner = client.users.get(data.owner.userId);
        owner && owner.update(data.owner);
        this.owner = owner || new User_1.User(client, data.owner);
        /**
         * @property {Shout} status The current group shout
         */
        this.status = data.shout && new Shout_1.Shout(client, data.shout, this);
        /**
         * @property {integer} memberCount The current amount of members in this group
         */
        this.memberCount = data.memberCount;
        /**
         * @property {boolean} isBuildersClubOnly If true, only users with builders club or roblox premium can join this group
         */
        this.isBuildersClubOnly = data.isBuildersClubOnly;
        /**
         * @property {boolean} hasClan Determines whether this group has a clan
         */
        this.hasClan = data.hasClan;
        /**
         * @property {boolean} public If true, anyone can join this group. If false, users have to send a join request first
         */
        this.public = data.publicEntryAllowed;
        /**
         * @property {boolean} locked If true, the group can't be joined
         */
        this.locked = data.isLocked;
        this.members = new Collection_1.Collection(this.client);
        /**
         * @property {Collection} roles All known roles in this group
         */
        this.roles = new Collection_1.Collection(this.client);
        client.groups.set(this.id, this);
    }
    update(data) {
        this.description = data.description || this.description; // For short responses
        this.owner = this.client.users.get(data.owner.userId) || new User_1.User(this.client, data.owner) || this.owner;
        this.status = data.shout && new Shout_1.Shout(this.client, data.shout, this) || this.shout;
        this.memberCount = data.memberCount || this.memberCount;
        this.isBuildersClubOnly = data.isBuildersClubOnly || this.isBuildersClubOnly;
        this.hasClan = data.hasClan;
        this.public = data.publicEntryAllowed;
        this.locked = data.isLocked;
    }
    async member(user) {
        const response = await this.client.http(`https://groups.roblox.com/v2/users/${user.id}/groups/roles`);
        const userGroups = response.data.data;
        for (const groupResponse of userGroups) {
            console.log(groupResponse);
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
    /**
     * Function to retrieve all current members of the group
     * @returns {Collection}
     */
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
    /**
     * Function to retrieve all rolesets
     * @returns {Collection}
     */
    async getRoles() {
        const url = `https://groups.roblox.com/v1/groups/${this.id}/roles`;
        const response = await this.client.http(url);
        for (const data of response.data.roles) {
            const role = this.client.roles.get(data.id);
            role && role.update(data) || new Role_1.Role(this.client, data, this);
        }
        return this.roles;
    }
    /**
     * Shouts on the group
     * @param {string} message The content of the shout
     * @returns {Shout} The posted shout
     */
    async shout(message) {
        const url = `https://groups.roblox.com/v1/groups/${this.id}/status`;
        const response = await this.client.http(url, {
            method: 'patch',
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
    /**
     * Updates the group's description
     * @param {string} description The new description for the group
     * @returns {Group} This group, with the updated description
     */
    async setDescription(description) {
        const url = `https://groups.roblox.com/v1/groups/${this.id}/description`;
        await this.client.http(url, {
            method: 'patch',
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
