import { z } from "astro/zod";
import type { Result } from "lighthouse/types/lhr/audit-result";
import type { PositionType } from "./client";

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

const OptionsSchema = z.object({
	weight: z.number().optional().default(0),
	breakPoint: z.number().optional().default(768),
});

export type Options = {
	weight: z.infer<typeof OptionsSchema>["weight"];
	breakPoint: z.infer<typeof OptionsSchema>["breakPoint"];
};
