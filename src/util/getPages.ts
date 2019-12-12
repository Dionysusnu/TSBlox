// import { Base, Collection } from '../Structures';
import { Base } from '../structures/Base';
import { Collection } from '../structures/Collection';
import { Constructor } from './Util';
import { CatchConfig } from '../structures/Client';

/**
 * Gets data from a pages API and fills a Collection with it.
 * @param {string} url The url to fetch pages from.
 * @param {Constructor<ClassToConstruct>} objectType The class to construct instances of.
 * @param {Base} constructorParent A base instance to use as the third argument to the constructing class.
 * @param {CatchConfig} catchConfig The CatchConfig to transmit to client.http().
 * @param {Function} [transformer] A function to transform the data, for endpoints with inconsistent data replies.
 * @returns {Promise<Collection<ClassToConstruct>>}
 */
export async function getPages<ClassToConstruct extends Base>(url: string, objectType: Constructor<ClassToConstruct>, constructorParent: Base, catchConfig: CatchConfig, transformer?: Function): Promise<Collection<Base['id'], ClassToConstruct>> {
	// Supported types: [GroupMember, Asset]
	const initialResponse = await constructorParent.client.http(url, {
		method: 'GET',
		params: {
			limit: 100,
		},
	}, catchConfig);
	let nextCursor = initialResponse.data.nextPageCursor;
	const array: [Base['id'], ClassToConstruct][] = [];
	for (const data of initialResponse.data.data) {
		const transformedData = transformer && transformer(data) || data;
		const newObject = new objectType(constructorParent.client, transformedData, constructorParent);
		array.push([newObject.id, newObject]);
	}
	while (nextCursor) {
		// eslint-disable-next-line no-await-in-loop
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
	return new Collection(constructorParent.client, array);
}