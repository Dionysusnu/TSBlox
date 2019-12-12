import { AxiosResponse } from 'axios';
import { Constructor } from './Util';
import { Group } from '../structures/Group';

export class ItemNotFound<itemType> extends Error {
	public constructor(reason: string, public response: AxiosResponse, public itemType: Constructor<itemType>) {
		super(reason);
	}
}

export class MissingPermissions extends Error {
	public constructor(permission: string, public response: AxiosResponse, public group: Group) {
		super(`Lacking ${permission} permission`);
	}
}