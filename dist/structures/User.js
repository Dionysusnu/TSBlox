"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Badge_1 = require("./Badge");
const Collection_1 = require("./Collection");
class User extends Base_1.Base {
    constructor(client, data) {
        super(client, data.userId);
        this.username = data.username;
        this.membership = data.buildersClubMembershipType;
        this.badges = new Collection_1.Collection(this.client);
        client.users.set(this.id, this);
    }
    update(data) {
        this.username = data.username;
        this.membership = data.buildersClubMembershipType;
    }
    async getBadges() {
        this.badges = await this.client.util.getPages(`https://badges.roblox.com/v1/users/${this.id}/badges`, Badge_1.Badge, this).catch((err) => {
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
