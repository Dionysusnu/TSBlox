"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
/**
 * Represents a user in a group
 */
class GroupMember extends Base_1.Base {
    constructor(client, data, group) {
        super(client, data.user.id);
        /**
         * @property {User} user The user
         */
        this.user = data.user;
        /**
         * @property {Group} group The group this member is part of
         */
        this.group = group;
        /**
         * @property {Role} role The current role of this member
         */
        this.role = data.role;
    }
    /**
     * Sets the member's role
     * @param {Role} role The new role for this user
     * @returns {GroupMember} This member, with the updated role
     */
    async setRole(role) {
        await this.client.http(`https://groups.roblox.com/v1/groups/${this.group.id}/users/${this.user.id}`, {
            method: 'PATCH',
            data: {
                roleId: role.id,
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
                            case 2: {
                                throw new Error('Role is invalid');
                            }
                            case 3: {
                                throw new Error('User is invalid');
                            }
                        }
                        break;
                    }
                    case 403: {
                        switch (errResponse.data.errors[1].code) {
                            case 4: {
                                throw new Error('Lacking permissions');
                            }
                        }
                        break;
                    }
                }
            }
            throw err;
        });
        this.role = role;
        return this;
    }
}
exports.GroupMember = GroupMember;
