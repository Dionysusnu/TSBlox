(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
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
        firstKey() {
            return this.keys().next().value;
        }
        last(count) {
            const arr = this.array();
            if (count === undefined) {
                return arr[arr.length - 1];
            }
            else {
                return arr.slice(-count);
            }
        }
        lastKey(count) {
            const arr = this.keyArray();
            if (count === undefined) {
                return arr[arr.length - 1];
            }
            else {
                return arr.slice(-count);
            }
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
        filter(filterFunction) {
            const filtered = new Collection(this.client);
            for (const [id, object] of this) {
                if (filterFunction(object)) {
                    filtered.set(id, object);
                }
            }
            return filtered;
        }
        array() {
            return [...this.values()];
        }
        keyArray() {
            return [...this.keys()];
        }
    }
    exports.Collection = Collection;
});
