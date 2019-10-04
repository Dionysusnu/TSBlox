"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to store objects with ID
 */
class Collection extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
    }
    first() {
        return this.values().next().value;
    }
    /**
     * Returns true if the object is in this collection
     * @param {Object} search The object to search for
     * @returns {boolean} Whether the object was found
     */
    includes(search) {
        for (const [, item] of this) {
            if (item === search) {
                return true;
            }
        }
        return false;
    }
}
exports.Collection = Collection;
