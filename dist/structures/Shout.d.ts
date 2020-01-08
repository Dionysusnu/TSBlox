import { Client } from './Client';
import { Group } from './Group';
import { UserData } from './User';
import { GroupMember } from './GroupMember';
export interface ShoutData {
    body: string;
    poster: UserData;
    updated: string;
}
export declare class Shout {
    readonly client: Client;
    readonly message: string;
    readonly author: Promise<GroupMember>;
    readonly time: Date;
    readonly group: Group;
    constructor(client: Client, data: ShoutData, group: Group);
    private getAuthor;
}
