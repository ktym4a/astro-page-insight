import { mappingData } from "../coordinator.js";
import type {
	FilterTypes,
	HideElement,
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

export const createHideButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
	isFetching: boolean,
) => {
	const hideButton = createToolbarButton(
		eyeXIcon,
		toolbarWrap,
		isFetching,
		"hide",
		() => {
			toggleToolbarWrapper(canvas, "hide");
		},
		"Show the hidden highlights.",
	);

	return hideButton;
};

export const createHideList = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
	lhResult: LHResultForTooltip,
	filter: FilterTypes,
) => {
	const existingHide = canvas.querySelector(".astro-page-insight-modal-hide");
	if (existingHide) {
		existingHide.remove();
	}

	const hideWrapper = createToolbarWrapper("hide");
	hideWrapper.innerHTML = `
    <style>
		.astro-page-insight-restore-button > svg {
            width: 18px !important;
            height: 18px !important;
        }
	</style>`;

	const titleElement = createToolbarTitle(
		`Hide highlights - (${formFactor.charAt(0).toUpperCase()}${formFactor.slice(
			1,
		)})`,
		filterIcon,
	);
	hideWrapper.appendChild(titleElement);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	const button = canvas.querySelector("[data-button-type='hide']");
	if (filter.hideList.length === 0) {
		const textElement = createToolbarSubTitle("No hidden highlights found.");
		contentWrapper.appendChild(textElement);
		if (button)
			button.classList.remove("astro-page-insight-toolbar-button-alert");
	} else {
		if (button) button.classList.add("astro-page-insight-toolbar-button-alert");
	}

	for (const [index, element] of filter.hideList.entries()) {
		const content = createContent(
			canvas,
			formFactor,
			element,
			index === filter.hideList.length - 1,
			lhResult,
			filter,
		);
		contentWrapper.appendChild(content);
	}
	hideWrapper.appendChild(contentWrapper);

	const toolbarWrap = canvas.querySelector(
		".astro-page-insight-toolbar-button-wrap-hide",
	) as HTMLDivElement;

	toolbarWrap.appendChild(hideWrapper);
};

const createContent = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
	element: HideElement,
	isLast: boolean,
	lhResult: LHResultForTooltip,
	filter: FilterTypes,
) => {
	const contentElement = createToolbarElement(
		isLast,
		element.detailSelector || "",
	);
	const contentWrapper = createToolbarContentWrapper();
	contentElement.appendChild(contentWrapper);

	const textElement = createToolbarSubTitle(
		element.detailSelector ?? element.selector,
	);
	contentWrapper.appendChild(textElement);

	const clickHandler = () => {
		filter.hideList.splice(filter.hideList.indexOf(element), 1);
		createHideList(canvas, formFactor, lhResult, filter);
		mappingData(formFactor, canvas, lhResult, filter);
	};

	const button = createToolbarButton(
		eyeIcon,
		contentWrapper,
		false,
		"restore",
		clickHandler,
	);
	button.style.padding = "2px";
	button.style.borderRadius = "5px";
	button.classList.add("astro-page-insight-restore-button");

	return contentElement;
};
