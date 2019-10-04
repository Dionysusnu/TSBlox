"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Structures_1 = require("../Structures");
/**
 * Represents a user on roblox
 */
class User extends Structures_1.Base {
    constructor(client, data) {
        super(client, data.userId);
        /**
         * @property {string} username The username of this user
         */
        this.username = data.username;
        /**
         * @property {MembershipType} membership The builders club membership type
         */
        this.membership = data.buildersClubMembershipType;
        /**
         * @property {Collection} badges The badges this user has earned
         */
        this.badges = new Structures_1.Collection(this.client);
        client.users.set(this.id, this);
    }
    update(data) {
        this.username = data.username;
        this.membership = data.buildersClubMembershipType;
    }
    async getBadges() {
        this.badges = await this.client.util.getPages(`https://badges.roblox.com/v1/users/${this.id}/badges`, Structures_1.Badge, this).catch((err) => {
            if ('response' in err) {
                switch (err.response && err.response.status) {
                    case 404: {
                        if (err.response) {
                            switch (err.response.data.errors[1].code) {
                                case 4: {
                                    throw new Error('User is invalid');
                                }
                            }
                        }
                        break;
                    }
                }
            }
            throw err;
        });
        for (const [, badge] of this.badges) {
            badge.owners.set(this.id, this);
        }
        return this.badges;
    }
}
exports.User = User;
