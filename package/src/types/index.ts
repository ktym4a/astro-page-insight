import type { Result } from "lighthouse/types/lhr/audit-result";

export type PositionType = {
	top: number;
	left: number;
	width: number;
	height: number;
};

type PluginOptions = {
	breakPoint: number;
	weight: number;
};

export type LHOptions = {
	url: string;
	width: number;
	height: number;
} & PluginOptions;

export type AuditType = Pick<
	Result,
	"score" | "scoreDisplayMode" | "title" | "description"
> & {
	categories: string[];
	rect: PositionType;
	detailSelector?: string;
};

type ConsoleError = {
	message: string;
	level: string;
	content?: string;
};

export type ScoreListType = { [key: string]: number | null };
export type CategoryCountType = { [key: string]: number };

export type ScoreListByFormFactor = {
	mobile: ScoreListType;
	desktop: ScoreListType;
};

export type CategoryCountByFormFactor = {
	mobile: CategoryCountType;
	desktop: CategoryCountType;
};

export type FilterCategoryType = {
	[category: string]: boolean;
};

export type LHResult = {
	elements: {
		[selector: string]: Array<AuditType>;
	};
	metaErrors: Array<AuditType>;
	consoleErrors: Array<ConsoleError>;
	scoreList: ScoreListType;
	categoryCount: CategoryCountType;
	url: string;
	formFactor: "mobile" | "desktop";
};

export type Categories = {
	[auditId: string]: string[];
};

export type Tooltips = {
	[category: string]: Array<{
		title: string;
		content: string;
		subTitle: string[];
		score: number | null;
		scoreDisplayMode: string;
		id: string;
	}>;
};

export type ErrorTooltips = {
	[category: string]: Array<{
		title: string;
		score: number | null;
		content?: string;
		scoreDisplayMode: string;
		subTitle?: string[];
	}>;
};
