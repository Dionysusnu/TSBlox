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
});
