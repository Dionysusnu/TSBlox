/// <reference types="node" />
import EventEmitter from 'events';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Collection } from './Collection';
import { User } from './User';
import { Badge } from './Badge';
import { Role } from './Role';
import { Group } from './Group';
import { Base } from './Base';
interface HttpConfig extends AxiosRequestConfig {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}
declare type CatchFunction = (response: AxiosResponse) => Error;
declare type CatchObject = Error | CatchFunction;
export declare type CatchConfig = Record<number, CatchObject | Record<number, CatchObject>>;
export declare class Client extends EventEmitter {
    badges: Collection<Base['id'], Badge>;
    groups: Collection<Base['id'], Group>;
    roles: Collection<Base['id'], Role>;
    users: Collection<Base['id'], User>;
    private httpQueue;
    private httpTimeout;
    private httpInterval;
    private httpIntervalId?;
    private cookie?;
    private token?;
    debug?: boolean;
    constructor(cookie: string);
    login(cookie: string): Promise<void>;
    private rejectCatcher;
    private handleHttpQueue;
    http(url: string, config: HttpConfig, catchConfig: CatchConfig): Promise<AxiosResponse>;
    getGroup<G extends Group>(id: number, cachedGroup: G): Promise<G>;
    getGroup(id: number): Promise<Group>;
    getUser(id: number): Promise<User>;
    getUserByName(name: string): Promise<User>;
}
export {};
