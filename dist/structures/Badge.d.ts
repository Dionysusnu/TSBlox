import { Base } from './Base';
import { Collection } from './Collection';
import { Client } from './Client';
import { User } from './User';
interface BadgeStatistics {
    pastDayAwarded: number;
    totalAwarded: number;
    winrate: number;
}
interface BadgeStatisticsData {
    pastDayAwardedCount: number;
    awardedCount: number;
    winRatePercentage: number;
}
interface BadgeData {
    id: number;
    name: string;
    description: string;
    displayName: string;
    displayDescription: string;
    enabled: boolean;
    statistics: BadgeStatisticsData;
    created: string;
    updated: string;
}
export declare class Badge extends Base {
    name: string;
    description: string;
    displayName: string;
    displayDescription: string;
    achievable: boolean;
    statistics: BadgeStatistics;
    created: Date;
    lastUpdated: Date;
    owners: Collection<Base['id'], User>;
    constructor(client: Client, data: BadgeData);
    update(data: BadgeData): void;
}
export {};
