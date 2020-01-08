"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
class Shout {
    constructor(client, data, group) {
        this.client = client;
        this.message = data.body;
        this.time = new Date(data.updated);
        this.group = group;
        this.author = this.getAuthor(data.poster);
    }
    async getAuthor(author) {
        const member = await this.group.member(this.client.users.get(author.userId) || new User_1.User(this.client, author));
        if (!member) {
            throw new Error('Shout author not in group');
        }
        return member;
    }
}
exports.Shout = Shout;
