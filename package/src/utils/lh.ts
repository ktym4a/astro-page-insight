import type {
	AuditType,
	ErrorTooltips,
	FilterCategoryType,
	FilterTypes,
	HideArguments,
	LHResult,
	LHResultForTooltip,
	PositionType,
	Tooltips,
	UpdateMappingType,
} from "../types/index.js";
import { createFilter } from "../ui/filter.js";
import { createHideList } from "../ui/hide.js";
import { createHighlight } from "../ui/highlight.js";
import { reloadCircleIcon } from "../ui/icons.js";
import { createScore } from "../ui/score.js";
import { createToolbarButton } from "../ui/toolbar.js";
import { createTooltip } from "../ui/tooltip.js";

export const updateCanvas = ({
	canvas,
	result,
	filter,
	formFactor,
	scoreList,
	categoryCount,
}: UpdateMappingType) => {
	mappingData(formFactor, canvas, result, filter);
	createHideList(canvas, formFactor, filter.hideList, result, filter);
	createScore(canvas, formFactor, scoreList);
	createFilter(canvas, formFactor, categoryCount, result, filter);
};

export const createFetchButton = (
	toolbarWrap: HTMLDivElement,
	isFetching: boolean,
	fetchStart: () => void,
) => {
	const fetchButton = createToolbarButton(
		reloadCircleIcon,
		toolbarWrap,
		false,
		"fetch",
		() => {
			if (isFetching) return;
			fetchStart();
			fetchLighthouse(
				document.documentElement.clientWidth,
				document.documentElement.clientWidth,
				window.location.href,
			);
		},
		"Fetch Lighthouse report.",
	);

	return fetchButton;
};

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
			hideHighlights: filter.hideList,
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

	if (checkErrors(result.consoleErrors, result.metaErrors)) {
		const tooltips = createErrorTooltipsData(
			result.consoleErrors,
			result.metaErrors,
		);
		const errorTooltips = createErrorTooltip(tooltips);
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
		highlight.appendChild(toolTip);

		return highlight;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

const checkErrors = (
	consoleErrors: LHResult["consoleErrors"],
	metaErrors: LHResult["metaErrors"],
) => {
	if (consoleErrors.length !== 0 || metaErrors.length !== 0) {
		return true;
	}
	return false;
};

const createErrorTooltipsData = (
	consoleErrors: LHResult["consoleErrors"],
	metaErrors: LHResult["metaErrors"],
) => {
	const tooltips: ErrorTooltips = {};
	for (const consoleMessage of consoleErrors) {
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

	for (const metaError of metaErrors) {
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

const createErrorTooltip = (tooltips: ErrorTooltips) => {
	const errorTooltips = createTooltip(tooltips, {
		text: "There are some errors in the console or document.",
	});
	errorTooltips.style.display = "block";
	errorTooltips.style.top = "20px";
	errorTooltips.style.right = "10px";
	errorTooltips.style.left = "auto";
	errorTooltips.style.position = "fixed";
	errorTooltips.classList.add("non-element");

	return errorTooltips;
};
