// import { Base, Client, Collection, User } from '../Structures';
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
/**
 * Represents a badge on roblox
 */
export class Badge extends Base {
	public name: string;
	public description: string;
	public displayName: string;
	public displayDescription: string;
	public achievable: boolean;
	// private iconImage: null;
	// private awarder: null;
	public statistics: BadgeStatistics;
	public created: Date;
	public lastUpdated: Date;
	public owners: Collection<Base['id'], User>;
	public constructor(client: Client, data: BadgeData) {
		super(client, data.id);
		this.name = data.name;
		this.description = data.description;
		this.displayName = data.displayName;
		this.displayDescription = data.displayDescription;
		this.achievable = data.enabled;
		// this.iconImage = null; // TO-DO: make asset and assign to ImageAsset object
		// this.awarder = null; // TO-DO: make place and assign to Place object
		this.statistics = {
			pastDayAwarded: data.statistics.pastDayAwardedCount,
			totalAwarded: data.statistics.awardedCount,
			winrate: data.statistics.winRatePercentage,
		};
		this.created = new Date(data.created);
		this.lastUpdated = new Date(data.updated);
		this.owners = new Collection(this.client);
		client.badges.set(this.id, this);
	}

	public update(data: BadgeData): void {
		this.name = data.name;
		this.description = data.description;
		this.displayName = data.displayName;
		this.displayDescription = data.displayDescription;
		this.achievable = data.enabled;
		// this.iconImage = null; // TO-DO: make asset and assign to ImageAsset object
		this.statistics = {
			pastDayAwarded: data.statistics.pastDayAwardedCount,
			totalAwarded: data.statistics.awardedCount,
			winrate: data.statistics.winRatePercentage,
		};
		this.lastUpdated = new Date(data.updated);
	}
}