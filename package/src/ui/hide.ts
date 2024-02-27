import type { HideElement, LHResult } from "../types/index.js";
import { eyeIcon, eyeXIcon, filterIcon } from "./icons.js";
import {
	createToolbarButton,
	createToolbarTitle,
	createToolbarWrapper,
	toggleToolbarWrapper,
} from "./toolbar.js";

export const createHideButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
) => {
	const hideButton = createToolbarButton(
		eyeXIcon,
		toolbarWrap,
		false,
		"hide",
		() => {
			toggleToolbarWrapper(canvas, "hide");
		},
		"Show the hidden elements.",
	);

	return hideButton;
};

export const createHideList = (
	canvas: ShadowRoot,
	formFactor: LHResult["formFactor"],
	hideElements: HideElement[],
) => {
	const existingHide = canvas.querySelector(".astro-page-insight-modal-hide");
	if (existingHide) {
		existingHide.remove();
	}

	const hideWrapper = createToolbarWrapper("hide");
	hideWrapper.innerHTML = `
    <style>
		.astro-page-insight-hide-button > svg {
            width: 18px !important;
            height: 18px !important;
        }
	</style>`;

	const titleElement = createToolbarTitle(
		`Hide elements - (${formFactor})`,
		filterIcon,
	);
	hideWrapper.appendChild(titleElement);

	const contentWrapper = document.createElement("div");
	contentWrapper.style.marginTop = "10px";

	for (const [index, element] of hideElements.entries()) {
		const content = createContent(
			canvas,
			formFactor,
			element,
			index === hideElements.length - 1,
			hideElements,
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
	hideElements: HideElement[],
) => {
	const contentElement = document.createElement("div");
	const contentWrapper = document.createElement("div");
	contentWrapper.style.display = "flex";
	contentWrapper.style.justifyContent = "space-between";
	contentWrapper.style.alignItems = "center";
	contentWrapper.style.margin = "0";
	contentWrapper.style.fontSize = "14px";
	contentWrapper.style.wordBreak = "break-word";
	contentWrapper.style.padding = "5px";
	contentWrapper.style.borderRadius = "5px";
	contentElement.appendChild(contentWrapper);

	const textElement = document.createElement("p");
	textElement.textContent = element.detailSelector ?? element.selector;
	textElement.style.margin = "0";
	contentWrapper.appendChild(textElement);

	const clickHandler = () => {
		const targetElem = canvas.querySelector(
			`[data-selector="${element.selector}"]`,
		) as HTMLDivElement | null;
		if (targetElem === null) return;
		targetElem.style.display = "block";
		hideElements.splice(hideElements.indexOf(element), 1);
		createHideList(canvas, formFactor, hideElements);
	};

	const button = createToolbarButton(
		eyeIcon,
		contentWrapper,
		false,
		"show",
		clickHandler,
	);
	button.style.padding = "2px";
	button.style.borderRadius = "5px";
	button.classList.add("astro-page-insight-show-button");

	if (!isLast) {
		contentElement.style.marginBottom = "12px";
		contentElement.style.borderBottom = "1px solid #cdd6f4";
		contentElement.style.paddingBottom = "12px";
	}

	return contentElement;
};
