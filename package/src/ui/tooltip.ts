import { COLORS } from "../constants";
import type { Tooltips } from "../types";
import { getColorKey } from "../util/color";

const LINK_REGEX = /\[(.*?)\]\((.*?)\)/g;

export const createTooltip = (
	highlight: HTMLDivElement,
	tooltips: Tooltips,
	title?: string,
) => {
	const tooltipWrapper = createTooltipWrapper();

	if (title) {
		const titleElement = createTitle(title);
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
				tooltip.subTitle,
			);
			contentElement.appendChild(contentTitle);

			const content = createContent(
				tooltip.content,
				index === tooltips[1].length - 1,
			);
			contentElement.appendChild(content);

			contentWrapper.appendChild(contentElement);
		}
		details.appendChild(contentWrapper);

		tooltipWrapper.appendChild(details);
	}

	highlight.appendChild(tooltipWrapper);
};

const createTooltipWrapper = () => {
	const tooltipWrapper = document.createElement("div");
	tooltipWrapper.classList.add("page-insight-tooltip");
	tooltipWrapper.style.position = "absolute";
	tooltipWrapper.style.background = "#181825";
	tooltipWrapper.style.color = "#cdd6f4";
	tooltipWrapper.style.borderRadius = "5px";
	tooltipWrapper.style.padding = "15px 10px";
	tooltipWrapper.style.border = "1px solid #cdd6f4";
	tooltipWrapper.style.display = "none";
	tooltipWrapper.style.width = "350px";

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

const createTitle = (title: string) => {
	const titleWrap = document.createElement("h2");
	titleWrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="color: ${COLORS.red}; min-width: 24px; max-width: 24px;" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>`;

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
	subTitle: string[],
) => {
	const titleWrap = document.createElement("h3");
	titleWrap.style.margin = "0";
	titleWrap.style.fontSize = "16px";
	titleWrap.style.fontWeight = "normal";
	titleWrap.style.display = "flex";
	titleWrap.style.gap = "5px";

	const titleDiv = document.createElement("div");
	titleDiv.style.display = "flex";
	titleDiv.style.flex = "auto";
	titleDiv.style.gap = "5px";
	titleWrap.appendChild(titleDiv);

	if (subTitle.includes("LCP")) {
		titleDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="color: ${COLORS.blue}; min-width: 18px; max-width: 18px;" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>`;
	} else {
		const colorKey = getColorKey(score);

		titleDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="color: ${COLORS[colorKey]}; min-width: 18px; max-width: 18px;" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>`;
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
	contentElement.style.marginTop = "10px";
	contentElement.style.fontSize = "14px";

	if (!isLast) {
		contentElement.style.marginBottom = "12px";
		contentElement.style.borderBottom = "1px solid #cdd6f4";
		contentElement.style.paddingBottom = "12px";
	}

	return contentElement;
};
