import { COLORS } from "../constants";
import type { ErrorTooltips, PositionType, Tooltips } from "../types";
import { getColorKey } from "../utils/color";
import { alertTriangleIcon, infoCircleIcon } from "./icons";

const LINK_REGEX = /\[(.*?)\]\((.*?)\)/g;

export const createTooltip = (
	tooltips: Tooltips | ErrorTooltips,
	titleOption: {
		text?: string | undefined;
		icon?: boolean;
	},
	rect?: PositionType,
) => {
	const tooltipWrapper = createTooltipWrapper(rect?.top);

	if (titleOption.text) {
		const titleElement = createTitle(titleOption.text, titleOption.icon);
		tooltipWrapper.appendChild(titleElement);
	}

	const tooltipEntries = Object.entries(tooltips);
	const tooltipsLength = tooltipEntries.length;

	for (const [index, tooltips] of tooltipEntries.entries()) {
		const tooltip = tooltipEntries[index];
		if (!tooltip) continue;

		const details = createDetails(index === tooltipsLength - 1);
		details.dataset.category = tooltip[0].toLowerCase();

		const summary = createSummary(tooltip[0], tooltips[1].length);
		details.appendChild(summary);

		const contentWrapper = document.createElement("div");
		contentWrapper.style.marginTop = "10px";
		contentWrapper.style.marginLeft = "10px";
		for (const [index, tooltip] of tooltips[1].entries()) {
			const contentElement = document.createElement("div");

			const contentTitle = createContentTitle(
				tooltip.title,
				tooltip.score,
				tooltip.scoreDisplayMode,
				tooltip.subTitle,
			);
			contentElement.appendChild(contentTitle);

			if (tooltip.content) {
				const content = createContent(
					tooltip.content,
					index === tooltips[1].length - 1,
				);
				contentElement.appendChild(content);
				contentElement.appendChild(content);
			}

			contentWrapper.appendChild(contentElement);
		}
		details.appendChild(contentWrapper);

		tooltipWrapper.appendChild(details);
	}

	return tooltipWrapper;
};

const createTooltipWrapper = (top?: number) => {
	const tooltipWrapper = document.createElement("div");
	const height = document.body.scrollHeight;

	tooltipWrapper.classList.add("page-insight-tooltip");
	tooltipWrapper.style.position = "absolute";
	tooltipWrapper.style.background = "#181825";
	tooltipWrapper.style.color = "#cdd6f4";
	tooltipWrapper.style.borderRadius = "5px";
	tooltipWrapper.style.padding = "15px 10px";
	tooltipWrapper.style.border = "1px solid #cdd6f4";
	tooltipWrapper.style.display = "none";
	tooltipWrapper.style.width = "350px";
	tooltipWrapper.style.maxHeight = "40vh";
	tooltipWrapper.style.minHeight = "360px";
	tooltipWrapper.style.overflowY = "auto";
	tooltipWrapper.style.left = "0";
	if (top) {
		if (height / 2 < top) {
			tooltipWrapper.style.top = "0";
			tooltipWrapper.style.transform = "translateY(-100%)";
		} else {
			tooltipWrapper.style.bottom = "0";
			tooltipWrapper.style.transform = "translateY(100%)";
		}
	}
	tooltipWrapper.style.zIndex = "200005";

	return tooltipWrapper;
};

const createDetails = (isLast: boolean) => {
	const details = document.createElement("details");
	details.open = true;
	if (!isLast) {
		details.style.paddingBottom = "15px";
	}

	return details;
};

const createTitle = (title: string, icon?: boolean) => {
	const titleWrap = document.createElement("h2");
	if (icon) {
		titleWrap.innerHTML = `<div style="color: ${COLORS.red}; min-width: 24px; max-width: 24px;">${alertTriangleIcon}</div>`;
	}

	const titleElement = document.createElement("p");
	titleElement.textContent = title;
	titleElement.style.flex = "1";
	titleElement.style.margin = "0";

	titleWrap.appendChild(titleElement);

	titleWrap.style.display = "flex";
	titleWrap.style.justifyContent = "center";
	titleWrap.style.marginTop = "0";
	titleWrap.style.marginBottom = "15px";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.gap = "10px";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.borderBottom = "1px solid #cdd6f4";
	titleWrap.style.paddingBottom = "15px";

	return titleWrap;
};

const createSummary = (category: string, length: number) => {
	const summary = document.createElement("summary");
	summary.textContent = `${category} (${length})`;
	summary.style.cursor = "pointer";
	summary.style.background = "#45475a";
	summary.style.fontWeight = "normal";
	summary.style.padding = "5px 10px";
	summary.style.borderRadius = "5px";

	return summary;
};

const createContentTitle = (
	title: string,
	score: number | null,
	scoreDisplayMode?: string,
	subTitle?: string[],
) => {
	const titleWrap = document.createElement("h3");
	titleWrap.style.margin = "0";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.display = "flex";
	titleWrap.style.gap = "5px";
	titleWrap.style.marginBottom = "10px";

	const titleDiv = document.createElement("div");
	titleDiv.style.display = "flex";
	titleDiv.style.flex = "auto";
	titleDiv.style.gap = "5px";
	titleWrap.appendChild(titleDiv);

	if (subTitle?.includes("LCP") && scoreDisplayMode === "informative") {
		titleDiv.innerHTML = `<div style="color: ${COLORS.blue}; min-width: 18px; max-width: 18px;">${infoCircleIcon}</div>`;
	} else {
		const colorKey = getColorKey(score);

		titleDiv.innerHTML = `<div style="color: ${COLORS[colorKey]}; min-width: 18px; max-width: 18px;">${alertTriangleIcon}</div>`;
	}

	const titleElement = document.createElement("p");
	titleElement.innerHTML = title
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
	titleElement.style.margin = "0";
	titleElement.style.fontSize = "14px";
	titleElement.style.fontWeight = "bold";
	titleElement.style.flex = "1";
	titleDiv.appendChild(titleElement);

	if (subTitle) {
		const subTitleWrap = document.createElement("div");
		subTitleWrap.style.display = "flex";
		subTitleWrap.style.flex = "1";
		subTitleWrap.style.alignItems = "flex-start";
		subTitleWrap.style.justifyContent = "flex-end";
		subTitleWrap.style.gap = "2.5px";
		subTitleWrap.style.flexWrap = "wrap";
		titleWrap.appendChild(subTitleWrap);

		for (const category of subTitle) {
			const subTitleElement = document.createElement("p");
			subTitleElement.textContent = category;
			subTitleElement.style.margin = "0";
			subTitleElement.style.fontSize = "11px";
			subTitleElement.style.background = "#45475a";
			subTitleElement.style.padding = "2px 5px";
			subTitleElement.style.borderRadius = "5px";
			subTitleWrap.appendChild(subTitleElement);
		}
	}

	return titleWrap;
};

const createContent = (content: string, isLast: boolean) => {
	const contentElement = document.createElement("p");
	contentElement.innerHTML = content.replace(
		LINK_REGEX,
		'<a href="$2" target="_blank">$1</a>',
	);
	contentElement.style.margin = "0";
	contentElement.style.fontSize = "14px";
	contentElement.style.wordBreak = "break-word";

	if (!isLast) {
		contentElement.style.marginBottom = "12px";
		contentElement.style.borderBottom = "1px solid #cdd6f4";
		contentElement.style.paddingBottom = "12px";
	}

	return contentElement;
};
