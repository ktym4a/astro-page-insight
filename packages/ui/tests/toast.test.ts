// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { createToastArea, showToast } from "../src/components/toast.ts";
import { COLORS } from "../src/constants/index.ts";
import { createShadowRoot } from "./utils.ts";

describe("toast", () => {
	describe("createToastArea", () => {
		it("should create createToastArea", () => {
			const shadowRoot = createShadowRoot();
			createToastArea(shadowRoot);

			expect(
				shadowRoot.querySelector("#astro-page-insight-toast-area"),
			).not.toBeNull();
		});
	});

	describe("showToast", () => {
		it("should create a toast with success", () => {
			const shadowRoot = createShadowRoot();
			const message = "This is a toast message.";

			createToastArea(shadowRoot);
			showToast(shadowRoot, message, "success");

			const toast = shadowRoot.querySelector(
				".astro-page-insight-toast",
			) as HTMLDivElement;

			const iconArea = toast.children[0] as HTMLDivElement;
			const messageArea = toast.children[1] as HTMLParagraphElement;

			expect(toast).not.toBeNull();
			expect(toast).toBeInstanceOf(HTMLDivElement);
			expect(toast.classList.contains("astro-page-insight-toast")).toBe(true);
			expect(toast.children.length).toBe(2);

			expect(iconArea).not.toBeNull();
			expect(iconArea.style.color).toBe(COLORS.green);
			expect(messageArea.textContent).toBe(message);
		});

		it("should create a toast with error", () => {
			const shadowRoot = createShadowRoot();
			const message = "This is a toast error message.";

			createToastArea(shadowRoot);
			showToast(shadowRoot, message, "error");

			const toast = shadowRoot.querySelector(
				".astro-page-insight-toast",
			) as HTMLDivElement;

			const iconArea = toast.children[0] as HTMLDivElement;
			const messageArea = toast.children[1] as HTMLParagraphElement;

			expect(toast).not.toBeNull();
			expect(toast).toBeInstanceOf(HTMLDivElement);
			expect(toast.children.length).toBe(2);

			expect(iconArea).not.toBeNull();
			expect(iconArea.style.color).toBe(COLORS.red);
			expect(messageArea.textContent).toBe(message);
		});
	});
});
