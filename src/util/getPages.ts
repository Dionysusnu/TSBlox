// import { Base, Collection } from '../Structures';
import { Base } from '../structures/Base';
import { Collection } from '../structures/Collection';

export default async function getPages(url: string, objectType: any, constructorParent: Base, transformer?: Function): Promise<Collection<any>> {
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
	return new Collection(constructorParent.client, array);
}