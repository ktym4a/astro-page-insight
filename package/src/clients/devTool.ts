import type { Buttons } from "../types";
import { showToast } from "../ui/toast";

export function getLHData() {
	if (import.meta.hot) {
		import.meta.hot?.send("astro-dev-toolbar:astro-page-insight-app:init", {
			url: window.location.href,
		});
	}
}

export function showInitialIcon(eventTarget: EventTarget, cache: boolean) {
	if (cache) {
		eventTarget.dispatchEvent(
			new CustomEvent("toggle-notification", {
				detail: {
					state: true,
					level: "warning",
				},
			}),
		);
	} else {
		eventTarget.dispatchEvent(
			new CustomEvent("toggle-notification", {
				detail: {
					state: false,
				},
			}),
		);
	}
}

export const fetchLighthouse = (width: number, height: number, url: string) => {
	if (import.meta.hot) {
		import.meta.hot?.send(
			"astro-dev-toolbar:astro-page-insight-app:run-lighthouse",
			{
				width,
				height,
				url,
			},
		);
	}
};

export function activeButtons(buttons: Buttons) {
	const buttonList = Object.values(buttons);
	for (const button of buttonList) {
		if (button) {
			button.disabled = false;
			button.classList.remove("animate");
		}
	}
}

export function showError(
	canvas: ShadowRoot,
	eventTarget: EventTarget,
	buttons: Buttons,
) {
	activeButtons(buttons);

	showToast(
		canvas,
		"The result is not for this page.\n Please try again.",
		"error",
	);
	eventTarget.dispatchEvent(
		new CustomEvent("toggle-notification", {
			detail: {
				state: true,
				level: "error",
			},
		}),
	);
}
