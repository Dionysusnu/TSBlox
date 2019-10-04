"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for every library class that has an id
 */
class Base {
    constructor(client, id) {
        this.client = client;
        this.id = id;
    }
    valueOf() {
        return this.id;
    }
}
exports.Base = Base;
