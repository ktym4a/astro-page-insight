import type { Result } from "lighthouse/types/lhr/audit-result";

export type PositionType = {
	top: number;
	left: number;
	width: number;
	height: number;
};

export type PluginOptions = {
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

export type ConsoleError = {
	message: string;
	level: string;
	content?: string;
};

export type LHResult = {
	elements: {
		[selector: string]: Array<AuditType>;
	};
	metaErrors: Array<AuditType>;
	consoleErrors: Array<ConsoleError>;
	scoreList: { [key: string]: number | null };
	url: string;
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

export type CategoriesCount = {
	[category: string]: number;
};
