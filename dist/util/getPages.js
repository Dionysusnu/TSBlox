(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../structures/Collection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Collection_1 = require("../structures/Collection");
    async function getPages(url, objectType, constructorParent, transformer) {
        // Supported types: [GroupMember, Asset]
        const initialResponse = await constructorParent.client.http(url, {
            params: {
                limit: 100,
            },
        });
        let nextCursor = initialResponse.data.nextPageCursor;
        const array = [];
        for (const data of initialResponse.data.data) {
            const transformedData = transformer && transformer(data) || data;
            array.push(new objectType(constructorParent.client, transformedData, constructorParent));
        }
        while (nextCursor) {
            const response = await constructorParent.client.http(url, { params: {
                    cursor: nextCursor,
                    limit: 100,
                },
            });
            nextCursor = response.data.nextPageCursor;
            for (const data of response.data.data) {
                const transformedData = transformer && transformer(data) || data;
                array.push(new objectType(constructorParent.client, transformedData, constructorParent));
            }
        }
        return new Collection_1.Collection(constructorParent.client, array);
    }
    exports.default = getPages;
});
