import { powerIcon } from "./icons.js";
import { createToolbarButton, toggleToolbarWrapper } from "./toolbar.js";

export const createPowerButton = (
	canvas: ShadowRoot,
	toolbarWrap: HTMLDivElement,
	isFetching: boolean,
) => {
	const powerButton = createToolbarButton(
		powerIcon,
		toolbarWrap,
		isFetching,
		"power",
		() => {
			toggleToolbarWrapper(canvas, "power");
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
			} else {
				powerButton.classList.add("astro-page-insight-toolbar-button-alert");
			}
		},
		"Toggle the highlighted elements.",
	);

	powerButton.classList.add("astro-page-insight-toolbar-button-alert");

	return powerButton;
};
