import type { Buttons } from "../types/index.js";
import { powerIcon } from "./icons.js";
import { createToolbarButton } from "./toolbar.js";

export const createPowerButton = (
	canvas: ShadowRoot,
	showOnLoad: boolean,
	toolbarWrap: HTMLDivElement,
	buttons: Omit<Buttons, "fetchButton">,
) => {
	const powerButton = createToolbarButton(
		powerIcon,
		toolbarWrap,
		false,
		"power",
		() => {
			const buttonList = Object.values(buttons);
			const elements = canvas.querySelectorAll(".astro-page-insight-highlight");
			for (const element of elements) {
				if (element instanceof HTMLElement) {
					element.style.display =
						element.style.display === "none" ? "block" : "none";
				}
			}

			if (
				powerButton.classList.contains(
					"astro-page-insight-toolbar-button-alert",
				)
			) {
				powerButton.classList.remove("astro-page-insight-toolbar-button-alert");
				for (const button of buttonList) {
					if (button) {
						button.disabled = false;
					}
				}
			} else {
				powerButton.classList.add("astro-page-insight-toolbar-button-alert");
				for (const button of buttonList) {
					if (button) {
						button.disabled = true;
					}
				}
			}
		},
		"Toggle the highlighted elements.",
	);

	if (!showOnLoad)
		powerButton.classList.add("astro-page-insight-toolbar-button-alert");

	return powerButton;
};
