import { CATEGORIES, COLORS } from "../constants/index.js";
import { getColorKey } from "../utils/color.js";
import { alertTriangleIcon, filterIcon, infoCircleIcon } from "./icons.js";
import { createToolbarTitle, createToolbarWrapper } from "./toolbar.js";

const LINK_REGEX = /\[(.*?)\]\((.*?)\)/g;

export const createFilter = () => {
	const toolbarWrapper = createToolbarWrapper();

	const titleElement = createToolbarTitle("Filter", filterIcon);
	toolbarWrapper.appendChild(titleElement);

	const details = createDetails(true);

	const summary = createSummary("Category");
	details.appendChild(summary);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";
	contentWrapper.style.marginLeft = "10px";
	for (const category of CATEGORIES) {
		const contentElement = document.createElement("div");

		const content = createContent(category, false);
		contentElement.appendChild(content);

		contentWrapper.appendChild(contentElement);
	}
	details.appendChild(contentWrapper);

	toolbarWrapper.appendChild(details);

	return toolbarWrapper;
};

const createDetails = (isLast: boolean) => {
	const details = document.createElement("details");
	details.open = true;
	if (!isLast) {
		details.style.paddingBottom = "15px";
	}

	return details;
};

const createSummary = (category: string) => {
	const summary = document.createElement("summary");
	summary.textContent = `${category}`;
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

	if (subTitle?.includes("LCP")) {
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
