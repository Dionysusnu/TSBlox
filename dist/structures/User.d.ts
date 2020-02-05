import { Base } from './Base';
import { Badge } from './Badge';
import { Collection } from './Collection';
import { Client } from './Client';

export declare type BCMembershipType = 'None' | 'BC' | 'TBC' | 'OBC' | 'RobloxPremium';
export interface UserData {
  username: string;
  buildersClubMembershipType: BCMembershipType;
  userId: number;
}
export declare class User extends Base {
  username: string;

  membership: BCMembershipType;

  badges: Collection<Base['id'], Badge>;

  constructor(client: Client, data: UserData);

  update(data: UserData): void;

  getBadges(): Promise<Collection<Base['id'], Badge>>;
}
