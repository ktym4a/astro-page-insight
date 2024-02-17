import { CATEGORIES, COLORS } from "../constants";
import type { PositionType } from "../types";

export const createHighlight = (
	selector: string,
	rect: PositionType,
	categories?: string[],
) => {
	const highlight = createHighlightElement();
	updateHHighlightPosition(highlight, selector, rect);
	highlight.dataset.selector = selector;

	if (categories) {
		addTitle(highlight, categories);
	}

	for (const event of ["mouseover", "focus"]) {
		highlight.addEventListener(event, () => {
			highlight.style.zIndex = "1001";
			const tooltip = highlight.querySelector<HTMLDivElement>(
				".page-insight-tooltip",
			);
			if (tooltip) {
				tooltip.style.display = "block";
			}
		});
	}

	for (const event of ["mouseout", "blur"]) {
		highlight.addEventListener(event, () => {
			highlight.style.zIndex = "1000";
			const tooltip = highlight.querySelector<HTMLDivElement>(
				".page-insight-tooltip",
			);
			if (tooltip) {
				tooltip.style.display = "none";
			}
		});
	}

	return highlight;
};

const createHighlightElement = () => {
	const highlight = document.createElement("div");
	highlight.style.position = "absolute";
	highlight.style.background =
		"linear-gradient(180deg, rgba(224, 204, 250, 0.33) 0%, rgba(224, 204, 250, 0.0825) 100%)";
	highlight.style.borderRadius = "5px";
	highlight.style.zIndex = "1000";
	highlight.style.display = "block";
	highlight.classList.add("page-insight-highlight");
	highlight.style.border = `2px solid ${COLORS.red}`;
	highlight.tabIndex = 0;

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
		highlight.style.top = `${Math.max(rect.top + window.scrollY - 10, 0)}px`;
		highlight.style.left = `${Math.max(rect.left + window.scrollX - 10, 0)}px`;
		highlight.style.width = `${rect.width + 15}px`;
		highlight.style.height = `${rect.height + 15}px`;
		highlight.dataset.target = "rect";
	} else {
		highlight.style.display = "none";
	}
};

export const refreshHighlightPositions = (canvas: ShadowRoot) => {
	for (const highlight of canvas.querySelectorAll<HTMLDivElement>(
		".page-insight-highlight",
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
	title.style.top = "0";
	title.style.right = "0";
	title.style.textAlign = "center";
	title.style.fontSize = "15px";
	title.style.color = "#cdd6f4";
	title.style.background = "#181825";
	title.style.borderRadius = "5px";
	title.style.padding = "4px 10px";
	title.textContent = categories.join(", ");
	for (const category of categories) {
		if (CATEGORIES.includes(category.toLocaleLowerCase())) {
			highlight.classList.add(category.toLocaleLowerCase());
		}
	}
	highlight.appendChild(title);
};

export const resetHighlights = (canvas: ShadowRoot) => {
	for (const highlight of canvas.querySelectorAll<HTMLDivElement>(
		".page-insight-highlight",
	)) {
		highlight.remove();
	}
};
