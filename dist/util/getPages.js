"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("../structures/Collection");
async function getPages(url, objectType, constructorParent, catchConfig, transformer) {
    const initialResponse = await constructorParent.client.http(url, {
        method: 'GET',
        params: {
            limit: 100,
        },
    }, catchConfig);
    let nextCursor = initialResponse.data.nextPageCursor;
    const array = [];
    for (const data of initialResponse.data.data) {
        const transformedData = transformer && transformer(data) || data;
        const newObject = new objectType(constructorParent.client, transformedData, constructorParent);
        array.push([newObject.id, newObject]);
    }
    while (nextCursor) {
        const response = await constructorParent.client.http(url, {
            method: 'GET',
            params: {
                cursor: nextCursor,
                limit: 100,
            },
        }, catchConfig);
        nextCursor = response.data.nextPageCursor;
        for (const data of response.data.data) {
            const transformedData = transformer && transformer(data) || data;
            const newObject = new objectType(constructorParent.client, transformedData, constructorParent);
            array.push([newObject.id, newObject]);
        }
    }
    return new Collection_1.Collection(constructorParent.client, array);
}
exports.getPages = getPages;
