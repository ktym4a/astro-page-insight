import { mappingData } from "../coordinator.js";
import type {
	CategoryCountType,
	FilterTypes,
	LHResult,
	LHResultForTooltip,
} from "../types/index.js";
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
	isFetching: boolean,
) => {
	const filterButton = createToolbarButton(
		filterIcon,
		toolbarWrap,
		isFetching,
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
	lhResult: LHResultForTooltip,
	filter: FilterTypes,
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
		`Filter - (${formFactor.charAt(0).toUpperCase()}${formFactor.slice(1)})`,
		filterIcon,
	);
	filterWrapper.appendChild(titleElement);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const categoryArray = Object.entries(filter.categories).sort();

	const button = canvas.querySelector(
		"[data-button-type='filter']",
	) as HTMLButtonElement;

	for (const [index, category] of categoryArray.entries()) {
		const count = categoryCount[category[0]] ?? 0;
		const text = `${category[0]} (${count})`;

		const content = createContent(
			button,
			formFactor,
			text,
			index === categoryArray.length - 1,
			category[0],
			filter,
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
	toolbarButton: HTMLButtonElement,
	formFactor: LHResult["formFactor"],
	content: string,
	isLast: boolean,
	category: string,
	filter: FilterTypes,
	render: {
		canvas: ShadowRoot;
		lhResult: LHResultForTooltip;
	},
) => {
	const contentElement = createToolbarElement(isLast, category);
	const contentWrapper = createToolbarContentWrapper();
	contentElement.appendChild(contentWrapper);

	const textElement = createToolbarSubTitle(content);
	contentWrapper.appendChild(textElement);

	const clickHandler = () => {
		if (filter.categories[category]) {
			filter.categories[category] = false;
			button.innerHTML = eyeIcon;
			contentWrapper.style.background = "transparent";
		} else {
			filter.categories[category] = true;
			button.innerHTML = eyeXIcon;
			contentWrapper.style.background = "#6c7086";
		}
		mappingData(formFactor, render.canvas, render.lhResult, filter);

		if (Object.values(filter.categories).some((val) => val === true)) {
			toolbarButton.classList.add("astro-page-insight-toolbar-button-alert");
		} else {
			toolbarButton.classList.remove("astro-page-insight-toolbar-button-alert");
		}
	};

	const button = filter.categories[category]
		? createToolbarButton(eyeXIcon, contentWrapper, false, "eye", clickHandler)
		: createToolbarButton(eyeIcon, contentWrapper, false, "eye", clickHandler);
	button.style.padding = "2px";
	button.style.borderRadius = "5px";
	if (filter.categories[category]) {
		contentWrapper.style.background = "#6c7086";
	}
	button.classList.add("astro-page-insight-filter-button");

	return contentElement;
};
