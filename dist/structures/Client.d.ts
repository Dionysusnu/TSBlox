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
declare type CatchConfig = Record<number, string | Record<number, string>>;
export declare class Client extends EventEmitter {
    badges: Collection<Base['id'], Badge>;
    groups: Collection<Base['id'], Group>;
    roles: Collection<Base['id'], Role>;
    users: Collection<Base['id'], User>;
    private httpQueue;
    util: Record<string, Function>;
    private httpTimeout;
    private httpInterval;
    private httpIntervalId?;
    private cookie?;
    private token?;
    readonly debug?: boolean;
    constructor(cookie: string);
    login(cookie: string): Promise<void>;
    private handleHttpQueue;
    http(url: string, config: HttpConfig, catchConfig?: CatchConfig): Promise<AxiosResponse>;
    getGroup(id: number): Promise<Group | undefined>;
    getUser(id: number): Promise<User | undefined>;
    getUserByName(name: string): Promise<User | undefined>;
}
export {};
