"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../Structures");
/**
 * Represents a group
 */
class Group extends Structures_1.Base {
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
        this.owner = owner || new Structures_1.User(client, data.owner);
        /**
         * @property {Shout} status The current group shout
         */
        this.status = data.shout && new Structures_1.Shout(client, data.shout, this);
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
        /**
         * @property {Collection} roles All known roles in this group
         */
        this.roles = new Structures_1.Collection(this.client);
        client.groups.set(this.id, this);
    }
    update(data) {
        this.description = data.description;
        this.owner = this.client.users.get(data.owner.userId) || new Structures_1.User(this.client, data.owner);
        this.status = data.shout && new Structures_1.Shout(this.client, data.shout, this);
        this.memberCount = data.memberCount;
        this.isBuildersClubOnly = data.isBuildersClubOnly;
        this.hasClan = data.hasClan;
        this.public = data.publicEntryAllowed;
        this.locked = data.isLocked;
    }
    /**
     * Function to retrieve all current members of the group
     * @returns {Collection}
     */
    async getUsers() {
        const url = `https://groups.roblox.com/v1/groups/${this.id}/users`;
        this.members = await this.client.util.getPages(url, Structures_1.GroupMember, this);
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
            role && role.update(data) || new Structures_1.Role(this.client, data, this);
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
        return new Structures_1.Shout(this.client, response, this);
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
