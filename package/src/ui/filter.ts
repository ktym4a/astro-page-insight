import type {
	CategoryCountType,
	FilterCategoryType,
	LHResult,
	LHResultForTooltip,
} from "../types/index.js";
import { mappingData } from "../utils/lh.js";
import { eyeIcon, eyeXIcon, filterIcon } from "./icons.js";
import {
	createToolbarButton,
	createToolbarContentWrapper,
	createToolbarElement,
	createToolbarSubTitle,
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
		.astro-page-insight-filter-button > svg {
            width: 18px !important;
            height: 18px !important;
        }
	</style>`;

	const titleElement = createToolbarTitle(
		`Filter - (${formFactor})`,
		filterIcon,
	);
	filterWrapper.appendChild(titleElement);

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
	filterWrapper.appendChild(contentWrapper);

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
	const contentElement = createToolbarElement(isLast);
	const contentWrapper = createToolbarContentWrapper();
	contentElement.appendChild(contentWrapper);

	const textElement = createToolbarSubTitle(content);
	contentWrapper.appendChild(textElement);

	const clickHandler = () => {
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
	};

	const button = filterCategories[category]
		? createToolbarButton(eyeXIcon, contentWrapper, false, "eye", clickHandler)
		: createToolbarButton(eyeIcon, contentWrapper, false, "eye", clickHandler);
	button.style.padding = "2px";
	button.style.borderRadius = "5px";
	if (filterCategories[category]) {
		contentWrapper.style.background = "#6c7086";
	}
	button.classList.add("astro-page-insight-filter-button");

	return contentElement;
};
