import type {
	CategoryCountType,
	FilterCategoryType,
	LHResult,
	LHResultForTooltip,
} from "../types/index.js";
import { mappingData } from "../utils/lh.js";
import { eyeIcon, eyeXIcon, filterIcon } from "./icons.js";
import {
	createDetails,
	createSummary,
	createToolbarButton,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "./toolbar.js";

export const createFilterButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
) => {
	const filterButton = createToolbarButton(
		filterIcon,
		toolbarWrap,
		false,
		"filter",
		() => {
			toggleToolbarWrapper(canvas, "filter");
		},
		"Filter the result.",
	);

	return filterButton;
};

export const createFilter = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
	categoryCount: CategoryCountType,
	filterCategories: FilterCategoryType,
	lhResult: LHResultForTooltip,
) => {
	const existingFilter = canvas.querySelector(
		".astro-page-insight-modal-filter",
	);
	if (existingFilter) {
		existingFilter.remove();
	}

	const filterWrapper = createToolbarWrapper("filter");
	filterWrapper.innerHTML = `
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

	const titleElement = createToolbarTitle(
		`Filter - (${formFactor})`,
		filterIcon,
	);
	filterWrapper.appendChild(titleElement);

	const details = createDetails(true);

	const summary = createSummary("Categories");
	details.appendChild(summary);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const categoryArray = Object.entries(filterCategories).sort();

	for (const [index, category] of categoryArray.entries()) {
		const count = categoryCount[category[0]] ?? 0;
		const text = `${category[0]} (${count})`;

		const content = createContent(
			text,
			index === categoryArray.length - 1,
			category[0],
			filterCategories,
			{
				canvas,
				lhResult,
			},
		);
		contentWrapper.appendChild(content);
	}
	details.appendChild(contentWrapper);

	filterWrapper.appendChild(details);

	const toolbarWrap = canvas.querySelector(
		".astro-page-insight-toolbar-button-wrap-filter",
	) as HTMLDivElement;

	toolbarWrap.appendChild(filterWrapper);
};

const createContent = (
	content: string,
	isLast: boolean,
	category: string,
	filterCategories: FilterCategoryType,
	{
		canvas,
		lhResult,
	}: {
		canvas: ShadowRoot;
		lhResult: LHResultForTooltip;
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

	const button = filterCategories[category]
		? createToolbarButton(eyeXIcon, contentWrapper)
		: createToolbarButton(eyeIcon, contentWrapper);
	if (filterCategories[category]) {
		contentWrapper.style.background = "#6c7086";
	}
	button.classList.add("astro-page-insight-filter-button");
	button.addEventListener("click", () => {
		if (filterCategories[category]) {
			filterCategories[category] = false;
			button.innerHTML = eyeIcon;
			contentWrapper.style.background = "transparent";
		} else {
			filterCategories[category] = true;
			button.innerHTML = eyeXIcon;
			contentWrapper.style.background = "#6c7086";
		}
		mappingData(canvas, lhResult, filterCategories);
	});

	if (!isLast) {
		contentElement.style.marginBottom = "12px";
		contentElement.style.borderBottom = "1px solid #cdd6f4";
		contentElement.style.paddingBottom = "12px";
	}

	return contentElement;
};
