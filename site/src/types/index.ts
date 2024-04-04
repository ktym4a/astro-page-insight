import type { MarkdownHeading } from "astro";

export enum COLOR {
	BLUE = "BLUE",
	GREEN = "GREEN",
	PEACH = "PEACH",
	PINK = "PINK",
	MAUVE = "MAUVE",
}

export type ColorType = {
	text?: string;
	hoverText?: string;
	focusText?: string;
	background?: string;
	backgroundGradient?: string;
	hoverBackground?: string;
	childHoverBackground?: string;
	childFocusBackground?: string;
	focusBackground?: string;
	outline?: string;
	hoverOutline?: string;
	focusOutline?: string;
	childHoverOutline?: string;
	childFocusOutline?: string;
	toCActiveColor?: string;
	blogPostColor?: string;
	borderColor?: string;
};

export type ToCType = Array<
	MarkdownHeading & {
		children: ToCType;
	}
>;
