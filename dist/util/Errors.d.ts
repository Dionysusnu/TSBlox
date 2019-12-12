import { AxiosResponse } from 'axios';
import { Constructor } from './Util';
import { Group } from '../structures/Group';
export declare class ItemNotFoundError<itemType> extends Error {
    response: AxiosResponse;
    itemType: Constructor<itemType>;
    constructor(reason: string, response: AxiosResponse, itemType: Constructor<itemType>);
}
export declare class MissingPermissionsError extends Error {
    response: AxiosResponse;
    group: Group;
    constructor(permission: string, response: AxiosResponse, group: Group);
}
