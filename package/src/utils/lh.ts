import type {
	AuditType,
	ErrorTooltips,
	LHResult,
	PositionType,
	Tooltips,
} from "../types/index.js";
import { createHighlight } from "../ui/highlight.js";
import { createTooltip } from "../ui/tooltip.js";

export const fetchLighthouse = (width: number, height: number, url: string) => {
	import.meta.hot?.send(
		"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
		{
			width,
			height,
			url,
		},
	);
};

export const mappingData = (
	canvas: ShadowRoot,
	lhResult: LHResult,
	filterCategory: string[],
) => {
	for (const [selector, value] of Object.entries(lhResult.elements)) {
		if (!value[0]) continue;

		const position = value[0].rect;
		const detailSelector = value[0].detailSelector;
		if (!checkAudit(selector, position)) continue;

		const { tooltips, selectorCategory } = createAuditData(
			value,
			selector,
			filterCategory,
		);

		if (Object.keys(tooltips).length === 0) continue;

		const mapElem = createMapElement(
			selector,
			position,
			tooltips,
			selectorCategory,
			lhResult.formFactor,
			detailSelector,
		);

		if (mapElem) canvas.appendChild(mapElem);
	}

	if (checkErrors(lhResult)) {
		const tooltips = createErrorTooltipsData(lhResult);
		const errorTooltips = createErrorTooltip(tooltips, lhResult.formFactor);
		canvas.appendChild(errorTooltips);
	}
};

const checkAudit = (selector: string, position: PositionType) => {
	if (selector === "") return false;
	if (
		position.width === 0 &&
		position.height === 0 &&
		position.top === 0 &&
		position.left === 0
	)
		return false;

	return true;
};

const createAuditData = (
	value: AuditType[],
	selector: string,
	filterCategory: string[],
) => {
	let score: number | null = 1;
	let selectorCategory = [] as string[];
	const tooltips: Tooltips = {};

	for (const audit of value) {
		if (selector === "") {
			continue;
		}
		if (!audit.categories.some((category) => filterCategory.includes(category)))
			continue;

		score =
			audit.score === null || score === null
				? null
				: Math.min(score ?? 1, audit.score);
		selectorCategory = [
			...Array.from(new Set([...selectorCategory, ...audit.categories])),
		];
		for (const category of audit.categories) {
			if (!filterCategory.includes(category)) continue;

			tooltips[category] = [
				...(tooltips[category] ?? []),
				{
					title: audit.title,
					content: audit.description,
					score: audit.score,
					subTitle: audit.categories,
					scoreDisplayMode: audit.scoreDisplayMode,
					id: selector,
				},
			];
		}
	}

	return {
		tooltips,
		selectorCategory,
	};
};

const createMapElement = (
	selector: string,
	position: PositionType,
	tooltips: Tooltips,
	selectorCategory: string[],
	formFactor: LHResult["formFactor"],
	detailSelector?: string,
) => {
	try {
		const highlight = createHighlight(selector, position, selectorCategory);
		highlight.dataset.detailSelector = detailSelector;
		highlight.dataset.formFactor = formFactor;

		let title: string | undefined;
		if (highlight.dataset.target === "rect") {
			title =
				"No element found or Find multiple elements, so the position is maybe not correct.";
		}

		const toolTip = createTooltip(
			tooltips,
			{
				text: title,
				icon: true,
			},
			position,
		);
		highlight.appendChild(toolTip);

		return highlight;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

const checkErrors = (result: LHResult) => {
	if (result.consoleErrors.length !== 0 || result.metaErrors.length !== 0) {
		return true;
	}
	return false;
};

const createErrorTooltipsData = (result: LHResult) => {
	const tooltips: ErrorTooltips = {};
	for (const consoleMessage of result.consoleErrors) {
		const category = "Console";
		const content = consoleMessage.content ?? "";
		tooltips[category] = [
			...(tooltips[category] ?? []),
			{
				title: consoleMessage.message,
				score: consoleMessage.level === "error" ? 0 : 0.5,
				scoreDisplayMode: "",
				content,
			},
		];
	}

	for (const metaError of result.metaErrors) {
		const category = "Document";
		tooltips[category] = [
			...(tooltips[category] ?? []),
			{
				title: metaError.title,
				score: metaError.score,
				scoreDisplayMode: "",
				content: metaError.description,
			},
		];
	}

	return tooltips;
};

const createErrorTooltip = (
	tooltips: ErrorTooltips,
	formFactor: LHResult["formFactor"],
) => {
	const errorTooltips = createTooltip(tooltips, {
		text: "There are some errors in the console or document.",
	});
	errorTooltips.style.display = "block";
	errorTooltips.style.top = "20px";
	errorTooltips.style.right = "10px";
	errorTooltips.style.left = "auto";
	errorTooltips.style.position = "fixed";
	errorTooltips.classList.add("non-element");
	errorTooltips.dataset.formFactor = formFactor;

	return errorTooltips;
};

export const resetLH = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
) => {
	for (const highlight of canvas.querySelectorAll<HTMLDivElement>(
		`.astro-page-insight-highlight[data-form-factor="${formFactor}"]`,
	)) {
		highlight.remove();
	}
	for (const tooltip of canvas.querySelectorAll<HTMLDivElement>(
		`.astro-page-insight-tooltip[data-form-factor="${formFactor}"]`,
	)) {
		tooltip.remove();
	}
	for (const filter of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-filter",
	)) {
		filter.remove();
	}
	for (const score of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-score",
	)) {
		score.remove();
	}
};
