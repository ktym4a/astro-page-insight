import type { Result } from "lighthouse/types/lhr/audit-result.d.ts";

export type PositionType = {
	top: number;
	left: number;
	bottom?: number;
	right?: number;
	width: number;
	height: number;
};

type PluginOptions = {
	breakPoint: number;
	weight: number;
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

type ScoreListByFormFactor = {
	mobile: ScoreListType;
	desktop: ScoreListType;
};

type CategoryCountByFormFactor = {
	mobile: CategoryCountType;
	desktop: CategoryCountType;
};

export type LHResultForTooltip = {
	elements: LHResult["elements"];
	metaErrors: LHResult["metaErrors"];
	consoleErrors: LHResult["consoleErrors"];
};

export type HideElement = {
	selector: string;
	detailSelector?: string;
};

type LHResultByFormFactor = {
	mobile: LHResultForTooltip;
	desktop: LHResultForTooltip;
};

type HideHighlightsByFormFactor = {
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

export type Buttons = {
	fetchButton?: HTMLButtonElement | undefined;
	filterButton: HTMLButtonElement | undefined;
	scoreButton: HTMLButtonElement | undefined;
	hideButton: HTMLButtonElement | undefined;
	consoleAlertButton: HTMLButtonElement | undefined;
};

export type PageInsightData = {
	filterCategories: FilterCategoryType;
	scoreListByFormFactor: ScoreListByFormFactor;
	categoryCountByFormFactor: CategoryCountByFormFactor;
	lhResultByFormFactor: LHResultByFormFactor;
	hideHighlights: HideHighlightsByFormFactor;
};

export type PageInsightStatus = {
	firstFetch: LoadOptionsType["firstFetch"];
	isFetching: boolean;
	isFirstFetch: boolean;
};
