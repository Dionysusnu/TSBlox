"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collection extends Map {
    constructor(client, iterable) {
        super(iterable);
        if (iterable) {
            for (const item of iterable) {
                this.set(item[0], item[1]);
            }
        }
        this.client = client;
    }
    first() {
        return this.values().next().value;
    }
    firstKey() {
        return this.keys().next().value;
    }
    last(count) {
        if (count !== undefined && typeof count !== 'number')
            throw new TypeError();
        const arr = this.array();
        if (count === undefined) {
            return arr[arr.length - 1];
        }
        else {
            return arr.slice(-count);
        }
    }
    lastKey(count) {
        if (count !== undefined && typeof count !== 'number')
            throw new TypeError();
        const arr = this.keyArray();
        if (count === undefined) {
            return arr[arr.length - 1];
        }
        else {
            return arr.slice(-count);
        }
    }
    includes(search) {
        if (typeof search !== 'number')
            throw new TypeError('argument 1 must be a number');
        for (const [, item] of this) {
            if (item === search) {
                return true;
            }
        }
        return false;
    }
    includesKey(search) {
        for (const [key] of this) {
            if (key === search) {
                return true;
            }
        }
        return false;
    }
    filter(filterFunction) {
        if (typeof filterFunction !== 'function')
            throw new TypeError('Argument 1 must be a function');
        const filtered = new Collection(this.client);
        for (const [id, object] of this) {
            if (filterFunction(object)) {
                filtered.set(id, object);
            }
        }
        return filtered;
    }
    filterKeys(filterFunction) {
        if (typeof filterFunction !== 'function')
            throw new TypeError('Argument 1 must be a function');
        const filtered = new Collection(this.client);
        for (const [id, object] of this) {
            if (filterFunction(id)) {
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
