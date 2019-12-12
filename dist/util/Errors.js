"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemNotFound extends Error {
    constructor(reason, response, itemType) {
        super(reason);
        this.response = response;
        this.itemType = itemType;
    }
}
exports.ItemNotFound = ItemNotFound;
class MissingPermissions extends Error {
    constructor(permission, response, group) {
        super(`Lacking ${permission} permission`);
        this.response = response;
        this.group = group;
    }
}
exports.MissingPermissions = MissingPermissions;
