"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemNotFoundError extends Error {
    constructor(reason, response, itemType) {
        super(reason);
        this.response = response;
        this.itemType = itemType;
    }
}
exports.ItemNotFoundError = ItemNotFoundError;
class MissingPermissionsError extends Error {
    constructor(permission, response, group) {
        super(`Lacking ${permission} permission`);
        this.response = response;
        this.group = group;
    }
}
exports.MissingPermissionsError = MissingPermissionsError;
