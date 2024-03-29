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
	pwa: boolean;
};

export type LoadOptionsType = {
	breakPoint: number;
	categories: string[];
	firstFetch: "load" | "open" | "none";
	lhReports: CacheLHResultByFormFactor;
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
	pwaErrors?: Array<ConsoleError>;
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

export type ScoreListByFormFactor = {
	mobile: ScoreListType;
	desktop: ScoreListType;
};

export type CategoryCountByFormFactor = {
	mobile: CategoryCountType;
	desktop: CategoryCountType;
};

export type LHResultForTooltip = {
	elements: LHResult["elements"];
	metaErrors: LHResult["metaErrors"];
	consoleErrors: LHResult["consoleErrors"];
	pwaErrors: LHResult["pwaErrors"];
};

export type HideElement = {
	selector: string;
	detailSelector?: string;
};

export type LHResultByFormFactor = {
	mobile: LHResultForTooltip;
	desktop: LHResultForTooltip;
};

export type HideHighlightsByFormFactor = {
	mobile: HideElement[];
	desktop: HideElement[];
};

export type CacheLHResultByFormFactor = {
	mobile: Omit<LHResult, "url" | "formFactor">;
	desktop: Omit<LHResult, "url" | "formFactor">;
	cache: boolean;
};

export type FilterTypes = {
	categories: FilterCategoryType;
	hideList: HideElement[];
};

export type HideArguments = {
	selector: string;
	hideHighlights: HideElement[];
	detailSelector?: string;
};

export type UpdateMappingType = {
	canvas: ShadowRoot;
	result: LHResultForTooltip;
	filter: FilterTypes;
	formFactor: LHResult["formFactor"];
	scoreList: ScoreListType;
	categoryCount: CategoryCountType;
};
