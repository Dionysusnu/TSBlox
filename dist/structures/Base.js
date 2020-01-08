"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(client, id) {
        if (!(typeof id === 'number'))
            throw new TypeError('Argument 2 must be a number');
        this.client = client;
        this.id = id;
    }
    valueOf() {
        return this.id;
    }
}
exports.Base = Base;
