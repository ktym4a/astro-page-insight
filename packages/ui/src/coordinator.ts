import { createHighlight } from "./components/highlight.js";
import { createTooltip } from "./components/tooltip.js";
import type {
	AuditType,
	FilterCategoryType,
	FilterTypes,
	HideArguments,
	LHResult,
	LHResultForTooltip,
	PositionType,
	Tooltips,
} from "./types/index.js";

export const mappingData = (
	formFactor: LHResult["formFactor"],
	canvas: ShadowRoot,
	result: LHResultForTooltip,
	filter: FilterTypes,
) => {
	for (const highlight of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-highlight",
	)) {
		highlight.remove();
	}
	for (const tooltip of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-tooltip",
	)) {
		tooltip.remove();
	}

	for (const [selector, value] of Object.entries(result.elements)) {
		if (!value[0]) continue;
		if (
			filter.hideList.some((hideElement) => hideElement.selector === selector)
		)
			continue;

		const position = value[0].rect;
		const detailSelector = value[0].detailSelector;
		if (!checkAudit(selector, position)) continue;

		const { tooltips, selectorCategory } = createAuditData(
			value,
			selector,
			filter.categories,
		);

		if (Object.keys(tooltips).length === 0) continue;

		const hideArguments = {
			selector,
			detailSelector: detailSelector ?? "",
		};

		const render = {
			canvas,
			lhResult: result,
		};

		const mapElem = createMapElement(
			formFactor,
			hideArguments,
			position,
			tooltips,
			selectorCategory,
			filter,
			render,
		);

		if (mapElem) canvas.appendChild(mapElem);
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
	filterCategory: FilterCategoryType,
) => {
	let score: number | null = 1;
	let selectorCategory = [] as string[];
	const tooltips: Tooltips = {};

	for (const audit of value) {
		if (selector === "") {
			continue;
		}
		if (
			!audit.categories.some((category) => filterCategory[category] === false)
		)
			continue;

		score =
			audit.score === null || score === null
				? null
				: Math.min(score ?? 1, audit.score);
		selectorCategory = [
			...Array.from(new Set([...selectorCategory, ...audit.categories])),
		];
		for (const category of audit.categories) {
			if (
				filterCategory[category] === true ||
				filterCategory[category] === undefined
			)
				continue;

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
	formFactor: LHResult["formFactor"],
	hideArguments: HideArguments,
	position: PositionType,
	tooltips: Tooltips,
	selectorCategory: string[],
	filter: FilterTypes,
	render: {
		canvas: ShadowRoot;
		lhResult: LHResultForTooltip;
	},
) => {
	try {
		const highlight = createHighlight(
			formFactor,
			hideArguments,
			position,
			filter,
			render,
			selectorCategory,
		);

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

		const elem = document.createElement("div");
		elem.appendChild(highlight);
		elem.appendChild(toolTip);

		return elem;
	} catch {
		return;
	}
};
