// import { Base, Collection } from '../Structures';
import { Base } from '../structures/Base';
import { Collection } from '../structures/Collection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

/**
 *
 * @export
 * @param {string} url The url
 * @param {Constructor<ClassToConstruct>} objectType The class to construct
 * @param {Base} constructorParent A base instance to use as the third argument to the constructing class
 * @param {Function} [transformer] A function to transform the data, for endpoints with inconsistent data
 * @returns {Promise<Collection<ClassToConstruct>>}
 */
export default async function getPages<ClassToConstruct extends Base>(url: string, objectType: Constructor<ClassToConstruct>, constructorParent: Base, transformer?: Function): Promise<Collection<Base['id'], ClassToConstruct>> {
	// Supported types: [GroupMember, Asset]
	const initialResponse = await constructorParent.client.http(url, {
		method: 'GET',
		params: {
			limit: 100,
		},
	});
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
		});
		nextCursor = response.data.nextPageCursor;
		for (const data of response.data.data) {
			const transformedData = transformer && transformer(data) || data;
			const newObject = new objectType(constructorParent.client, transformedData, constructorParent);
			array.push([newObject.id, newObject]);
		}
	}
	return new Collection(constructorParent.client, array);
}