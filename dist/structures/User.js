"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Badge_1 = require("./Badge");
const Collection_1 = require("./Collection");
const Util_1 = require("../util/Util");
const Errors_1 = require("../util/Errors");
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
        this.badges = await Util_1.getPages(`https://badges.roblox.com/v1/users/${this.id}/badges`, Badge_1.Badge, this, {
            404: {
                4: (errResponse) => {
                    return new Errors_1.ItemNotFoundError('User is invalid', errResponse, User);
                },
            },
        }).catch((err) => {
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
