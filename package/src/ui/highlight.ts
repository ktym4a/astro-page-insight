import { COLORS } from "../constants/index.js";
import type {
	FilterTypes,
	HideArguments,
	LHResult,
	LHResultForTooltip,
	PositionType,
} from "../types/index.js";
import { mappingData } from "../utils/lh.js";
import { createHideList } from "./hide.js";
import { eyeXIcon } from "./icons.js";
import { createToolbarButton } from "./toolbar.js";

export const createHighlight = (
	formFactor: LHResult["formFactor"],
	hideArguments: HideArguments,
	rect: PositionType,
	filter: FilterTypes,
	render: {
		canvas: ShadowRoot;
		lhResult: LHResultForTooltip;
	},
	categories?: string[],
) => {
	const highlight = createHighlightElement(
		formFactor,
		hideArguments,
		filter,
		render,
	);
	updateHHighlightPosition(highlight, hideArguments.selector, rect);

	if (categories) {
		addTitle(highlight, categories);
	}

	for (const event of ["mouseover", "focus"]) {
		highlight.addEventListener(event, () => {
			highlight.style.zIndex = "200010";
			const tooltip = highlight.querySelector<HTMLDivElement>(
				".astro-page-insight-tooltip",
			);
			if (tooltip) {
				tooltip.style.display = "block";
			}
		});
	}

	for (const event of ["mouseout", "blur"]) {
		highlight.addEventListener(event, () => {
			highlight.style.zIndex = "200000";
			const tooltip = highlight.querySelector<HTMLDivElement>(
				".astro-page-insight-tooltip",
			);
			if (tooltip) {
				tooltip.style.display = "none";
			}
		});
	}

	return highlight;
};

const createHighlightElement = (
	formFactor: LHResult["formFactor"],
	hideArguments: HideArguments,
	filter: FilterTypes,
	render: {
		canvas: ShadowRoot;
		lhResult: LHResultForTooltip;
	},
) => {
	const highlight = document.createElement("div");
	highlight.style.position = "absolute";
	highlight.style.background =
		"linear-gradient(180deg, rgba(224, 204, 250, 0.33) 0%, rgba(224, 204, 250, 0.0825) 100%)";
	highlight.style.borderRadius = "5px";
	highlight.style.zIndex = "20000";
	highlight.style.display = "block";
	highlight.classList.add("astro-page-insight-highlight");
	highlight.style.border = `2px solid ${COLORS.red}`;
	highlight.tabIndex = 0;
	highlight.dataset.selector = hideArguments.selector;

	const button = createToolbarButton(eyeXIcon, highlight);
	button.onclick = () => {
		hideArguments.hideHighlights.push({
			selector: hideArguments.selector,
			detailSelector: hideArguments.detailSelector || "",
		});
		mappingData(formFactor, render.canvas, render.lhResult, filter);
		createHideList(render.canvas, formFactor, render.lhResult, filter);
	};

	return highlight;
};

const updateHHighlightPosition = (
	highlight: HTMLDivElement,
	selector: string,
	rect?: PositionType,
) => {
	const targetElements = document.querySelectorAll(selector);
	const targetElement = targetElements[0];
	if (targetElement && targetElements.length === 1) {
		const rect = targetElement.getBoundingClientRect();
		highlight.style.top = `${Math.max(rect.top + window.scrollY - 10, 0)}px`;
		highlight.style.left = `${Math.max(rect.left + window.scrollX - 10, 0)}px`;
		highlight.style.width = `${rect.width + 15}px`;
		highlight.style.height = `${rect.height + 15}px`;
	} else if (rect) {
		highlight.style.top = `${Math.max(rect.top - 10, 0)}px`;
		highlight.style.left = `${Math.max(rect.left - 10, 0)}px`;
		highlight.style.width = `${rect.width + 15}px`;
		highlight.style.height = `${rect.height + 15}px`;
		highlight.dataset.target = "rect";
	} else {
		highlight.style.display = "none";
	}
};

export const refreshHighlightPositions = (canvas: ShadowRoot) => {
	for (const highlight of canvas.querySelectorAll<HTMLDivElement>(
		".astro-page-insight-highlight",
	)) {
		const selector = highlight.dataset.selector;
		if (selector) {
			const targetElements = document.querySelectorAll(selector);
			const targetElement = targetElements[0];
			if (targetElement && targetElements.length === 1) {
				const rect = targetElement.getBoundingClientRect();
				highlight.style.top = `${Math.max(
					rect.top + window.scrollY - 10,
					0,
				)}px`;
				highlight.style.left = `${Math.max(
					rect.left + window.scrollX - 10,
					0,
				)}px`;
				highlight.style.width = `${rect.width + 15}px`;
				highlight.style.height = `${rect.height + 15}px`;
			}
		}
	}
};

const addTitle = (highlight: HTMLDivElement, categories: string[]) => {
	const title = document.createElement("div");
	title.style.position = "absolute";
	title.style.bottom = "0";
	title.style.right = "0";
	title.style.textAlign = "center";
	title.style.fontSize = "15px";
	title.style.color = "#cdd6f4";
	title.style.background = "#181825";
	title.style.borderRadius = "3px";
	title.style.padding = "4px 10px";
	title.style.border = "1px solid #cdd6f4";
	title.textContent = categories.sort().join(", ");

	highlight.appendChild(title);
};
