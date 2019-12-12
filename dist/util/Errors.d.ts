import { AxiosResponse } from 'axios';
import { Constructor } from './Util';
import { Group } from '../structures/Group';
export declare class ItemNotFound<itemType> extends Error {
    response: AxiosResponse;
    itemType: Constructor<itemType>;
    constructor(reason: string, response: AxiosResponse, itemType: Constructor<itemType>);
}
export declare class MissingPermissions extends Error {
    response: AxiosResponse;
    group: Group;
    constructor(permission: string, response: AxiosResponse, group: Group);
}
