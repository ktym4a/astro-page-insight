import { showToast } from "@page-insight/ui";
import type { ToolbarAppEventTarget } from "astro/runtime/client/dev-toolbar/helpers.js";
import type { Buttons } from "../types/index.js";

export function showInitialIcon(app: ToolbarAppEventTarget, cache: boolean) {
	if (cache) {
		app.toggleNotification({
			state: true,
			level: "warning",
		});
	} else {
		app.toggleNotification({
			state: false,
		});
	}
}

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
	app: ToolbarAppEventTarget,
	buttons: Buttons,
	message: string,
) {
	activeButtons(buttons);

	showToast(canvas, message, "error");
	app.toggleNotification({
		state: true,
		level: "error",
	});
}

export function showSuccess(
	canvas: ShadowRoot,
	app: ToolbarAppEventTarget,
	buttons: Buttons,
) {
	activeButtons(buttons);

	showToast(canvas, "Analysis of lighthouse results is complete.", "success");
	app.toggleNotification({
		state: true,
		level: "info",
	});
}
