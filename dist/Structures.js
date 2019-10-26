(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./structures/Badge", "./structures/Base", "./structures/Client", "./structures/Collection", "./structures/Group", "./structures/GroupMember", "./structures/Role", "./structures/Shout", "./structures/User", "./util/Util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // export { Asset } from './src/structures/Asset';
    var Badge_1 = require("./structures/Badge");
    exports.Badge = Badge_1.Badge;
    var Base_1 = require("./structures/Base");
    exports.Base = Base_1.Base;
    var Client_1 = require("./structures/Client");
    exports.Client = Client_1.Client;
    var Collection_1 = require("./structures/Collection");
    exports.Collection = Collection_1.Collection;
    var Group_1 = require("./structures/Group");
    exports.Group = Group_1.Group;
    var GroupMember_1 = require("./structures/GroupMember");
    exports.GroupMember = GroupMember_1.GroupMember;
    var Role_1 = require("./structures/Role");
    exports.Role = Role_1.Role;
    var Shout_1 = require("./structures/Shout");
    exports.Shout = Shout_1.Shout;
    var User_1 = require("./structures/User");
    exports.User = User_1.User;
    var Util_1 = require("./util/Util");
    exports.Util = Util_1.default;
});
