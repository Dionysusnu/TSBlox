import Joi from 'joi';

export type BCMembershipType = 'None' | 'BC' | 'TBC' | 'OBC' | 'RobloxPremium';
export interface UserData {
	username: string;
	buildersClubMembershipType: BCMembershipType;
	userId: number;
}

export const UserData = Joi.object({
	username: Joi.string(),
});

export interface GroupData {
	owner: UserData;
	shout: ShoutData;
	memberCount: number;
	isBuildersClubOnly: boolean;
	hasClan: boolean;
	publicEntryAllowed: boolean;
	isLocked: boolean;
	id: number;
	name: string;
	description: string;
}

export const GroupData = Joi.object({
	owner: UserData,
});

export interface ShoutData {
	body: string;
	poster: UserData;
	updated: string;
}

export const ShoutData = Joi.object({
	body: Joi.string(),
	poster: UserData,
	updated: Joi.string(),
});

export interface RoleData {
	id: number;
	name: string;
	rank: number;
	memberCount?: number;
}