import type { Buttons } from "../types/index.ts";
import { showToast } from "../ui/toast.js";

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

function activeButtons(buttons: Buttons) {
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
	message: string,
) {
	activeButtons(buttons);

	showToast(canvas, message, "error");
	eventTarget.dispatchEvent(
		new CustomEvent("toggle-notification", {
			detail: {
				state: true,
				level: "error",
			},
		}),
	);
}

export function showSuccess(
	canvas: ShadowRoot,
	eventTarget: EventTarget,
	buttons: Buttons,
) {
	activeButtons(buttons);

	showToast(canvas, "Analysis of lighthouse results is complete.", "success");
	eventTarget.dispatchEvent(
		new CustomEvent("toggle-notification", {
			detail: {
				state: true,
				level: "info",
			},
		}),
	);
}
