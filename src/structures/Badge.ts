import { Base, Client, Collection, User } from '../Structures';
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
	name: string;
	description: string;
	displayName: string;
	displayDescription: string;
	achievable: boolean;
	iconImage: null;
	awarder: null;
	statistics: BadgeStatistics;
	created: Date;
	lastUpdated: Date;
	owners: Collection<User>;
	constructor(client: Client, data: BadgeData) {
		super(client, data.id);
		this.name = data.name;
		this.description = data.description;
		this.displayName = data.displayName;
		this.displayDescription = data.displayDescription;
		this.achievable = data.enabled;
		this.iconImage = null; // TO-DO: make asset and assign to ImageAsset object
		this.awarder = null; // TO-DO: make place and assign to Place object
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

	update(data: BadgeData): void {
		this.name = data.name;
		this.description = data.description;
		this.displayName = data.displayName;
		this.displayDescription = data.displayDescription;
		this.achievable = data.enabled;
		this.iconImage = null; // TO-DO: make asset and assign to ImageAsset object
		this.statistics = {
			pastDayAwarded: data.statistics.pastDayAwardedCount,
			totalAwarded: data.statistics.awardedCount,
			winrate: data.statistics.winRatePercentage,
		};
		this.lastUpdated = new Date(data.updated);
	}
}