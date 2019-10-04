const Base = require('./Base');
const Collection = require('./Collection');

/**
 * Represents a badge on roblox
 */
class Badge extends Base {
	constructor(client, data) {
		super(client);
		/**
		 * @property {integer} id The id of this badge
		 */
		Object.defineProperty(this, 'id', { value: data.id });
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
		this.owners = new Collection();
		client.badges.set(this.id, this);
	}

	update(data) {
		this.username = data.username;
		this.membership = data.buildersClubMembershipType;
	}
}

module.exports = Badge;