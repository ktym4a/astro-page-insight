import { desktopIcon, mobileIcon } from "./icons.js";
import { createToolbarButton } from "./toolbar.js";

export const getFormFactor: (breakPoint: number) => "mobile" | "desktop" = (
	breakPoint,
) => {
	return document.documentElement.clientWidth <= breakPoint
		? "mobile"
		: "desktop";
};

export const getIcon = (formFactor: "mobile" | "desktop") => {
	return formFactor === "mobile" ? mobileIcon : desktopIcon;
};

export const createIndicatorButton = (
	toolbarWrap: HTMLDivElement,
	formFactor: "mobile" | "desktop",
) => {
	const icon = getIcon(formFactor);
	const button = createToolbarButton(
		icon,
		toolbarWrap,
		true,
		"indicator",
		() => {},
		"Here is current checked device.",
	);
	button.dataset.formFactor = formFactor;

	return button;
};
