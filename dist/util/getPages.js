"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("../structures/Collection");
async function getPages(url, objectType, constructorParent) {
    // Supported types: [GroupMember, Asset]
    const initialResponse = await constructorParent.client.http(url, {
        params: {
            limit: 100,
        },
    });
    let nextCursor = initialResponse.data.nextPageCursor;
    const array = [];
    for (const user of initialResponse.data.data) {
        array.push(new objectType(constructorParent.client, user, constructorParent));
    }
    while (nextCursor) {
        const response = await constructorParent.client.http(url, { params: {
                cursor: nextCursor,
                limit: 100,
            },
        });
        nextCursor = response.data.nextPageCursor;
        for (const user of response.data.data) {
            array.push(new objectType(constructorParent.client, user, constructorParent));
        }
    }
    return new Collection_1.Collection(constructorParent.client, array);
}
exports.default = getPages;
