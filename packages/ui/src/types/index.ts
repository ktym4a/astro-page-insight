export type PositionType = {
	top: number;
	left: number;
	bottom?: number;
	right?: number;
	width: number;
	height: number;
};

export type AuditType = {
	score: number | null;
	scoreDisplayMode: string;
	title: string;
	description: string;
	categories: string[];
	rect: PositionType;
	detailSelector?: string;
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
	consoleErrors: Array<{
		message: string;
		level: string;
		content?: string;
	}>;
	scoreList: ScoreListType;
	categoryCount: CategoryCountType;
	url: string;
	formFactor: "mobile" | "desktop";
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

export type LHResultForTooltip = {
	elements: LHResult["elements"];
	metaErrors: LHResult["metaErrors"];
	consoleErrors: LHResult["consoleErrors"];
};

export type HideElement = {
	selector: string;
	detailSelector?: string;
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
