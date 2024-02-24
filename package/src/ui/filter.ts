import type { LHResult } from "../types/index.js";
import { mappingData } from "../utils/lh.js";
import { resetHighlights } from "./highlight.js";
import { eyeIcon, eyeXIcon, filterIcon } from "./icons.js";
import {
	createDetails,
	createSummary,
	createToolbarButton,
	createToolbarTitle,
	createToolbarWrapper,
} from "./toolbar.js";

export const createFilter = (
	canvas: ShadowRoot,
	categories: {
		[category: string]: boolean;
	},
	lhResult: LHResult,
) => {
	const toolbarWrapper = createToolbarWrapper("filter");
	toolbarWrapper.dataset.formFactor = lhResult.formFactor;
	toolbarWrapper.innerHTML = `
    <style>
        .astro-page-insight-filter button {
            display: inline-flex;
            position: relative;
            padding: 2px;
			border-radius: 5px;
            align-items: center;
            border: 1px solid #cdd6f4;
            color: #cdd6f4;
            background-color: #181825;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

		.astro-page-insight-filter button:hover {
            background-color: #45475a;
        }

		.astro-page-insight-filter button:focus-visible {
            outline-offset: -2px;
            background-color: #45475a;
        }

		.astro-page-insight-filter button:disabled {
            cursor: not-allowed;
            background-color: #6c7086 !important;
        }

		.astro-page-insight-filter button > svg {
            width: 16px;
            height: 16px;
        }
        `;

	const titleElement = createToolbarTitle("Filter", filterIcon);
	toolbarWrapper.appendChild(titleElement);

	const details = createDetails(true);

	const summary = createSummary("Categories");
	details.appendChild(summary);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const categoryArray = Object.entries(categories);

	for (const [index, category] of categoryArray.entries()) {
		const categoryCount = canvas.querySelectorAll(
			`[data-filter-category="${category[0]}"]`,
		).length;

		const text = `${category[0]} (${categoryCount})`;

		const content = createContent(
			canvas,
			text,
			index === categoryArray.length - 1,
			category[0],
			lhResult,
			categories,
		);
		contentWrapper.appendChild(content);
	}
	details.appendChild(contentWrapper);

	toolbarWrapper.appendChild(details);

	return toolbarWrapper;
};

const createContent = (
	canvas: ShadowRoot,
	content: string,
	isLast: boolean,
	category: string,
	lhResult: LHResult,
	categories: {
		[category: string]: boolean;
	},
) => {
	const contentElement = document.createElement("div");
	const contentWrapper = document.createElement("div");
	contentWrapper.style.display = "flex";
	contentWrapper.style.justifyContent = "space-between";
	contentWrapper.style.alignItems = "center";
	contentWrapper.style.margin = "0";
	contentWrapper.style.fontSize = "14px";
	contentWrapper.style.wordBreak = "break-word";
	contentWrapper.style.padding = "2px 5px";
	contentElement.appendChild(contentWrapper);

	const textElement = document.createElement("p");
	textElement.textContent = content;
	textElement.style.margin = "0";
	contentWrapper.appendChild(textElement);

	const button = createToolbarButton(eyeIcon, contentWrapper);
	button.classList.add("astro-page-insight-filter-button");
	button.addEventListener("click", () => {
		if (categories[category]) {
			categories[category] = false;
			button.innerHTML = eyeXIcon;
			contentWrapper.style.background = "#6c7086";
		} else {
			categories[category] = true;
			button.innerHTML = eyeIcon;
			contentWrapper.style.background = "transparent";
		}
		resetHighlights(canvas, lhResult.formFactor);
		mappingData(canvas, lhResult, categories);
	});

	if (!isLast) {
		contentElement.style.marginBottom = "12px";
		contentElement.style.borderBottom = "1px solid #cdd6f4";
		contentElement.style.paddingBottom = "12px";
	}

	return contentElement;
};
