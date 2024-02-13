import { z } from "astro/zod";
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

export type ElementType = Pick<
	Result,
	"score" | "scoreDisplayMode" | "title" | "description"
> & {
	categories: string[];
	rect: PositionType;
};

export type LHResult = {
	elements: {
		[selector: string]: Array<ElementType>;
	};
	console: string[];
	scoreList: { [key: string]: number | null };
	url: string;
};

export type Categories = {
	[auditId: string]: string[];
};

export const optionsSchema = z.object({
	weight: z.number().default(0).optional(),
	breakPoint: z.number().default(768).optional(),
});

export type Options = {
	weight?: z.infer<typeof optionsSchema>["weight"];
	breakPoint?: z.infer<typeof optionsSchema>["breakPoint"];
};
