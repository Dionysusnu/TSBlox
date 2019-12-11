import { Base } from './Base';
import { Client } from './Client';
import { User } from './User';
import { Group } from './Group';
import { Role } from './Role';
interface GroupMemberData {
    role: Role;
    user: User;
}
export declare class GroupMember extends Base {
    readonly user: User;
    readonly group: Group;
    role: Role;
    constructor(client: Client, data: GroupMemberData, group: Group);
    setRole(role: Role): Promise<GroupMember>;
}
export {};
