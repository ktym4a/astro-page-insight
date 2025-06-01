// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { desktopIcon } from "../src/components/icons.ts";
import {
	createIndicatorButton,
	getFormFactor,
	getIcon,
} from "../src/components/indicator.ts";

describe("indicator", () => {
	describe("getFormFactor", () => {
		it("should get desktop", () => {
			const formFactor = getFormFactor(-1);
			expect(formFactor).toBe("desktop");
		});

		it("should get mobile", () => {
			const formFactor = getFormFactor(100);
			expect(formFactor).toBe("mobile");
		});
	});

	describe("getIcon", () => {
		it("should get Desktop Icon", () => {
			const icon = getIcon("desktop");
			expect(icon).toBe(desktopIcon);
		});

		it("should get Mobile Icon", () => {
			const icon = getIcon("mobile");
			expect(icon).not.toBe(desktopIcon);
		});
	});

	describe("createIndicatorButton", () => {
		it("should create a createIndicatorButton with Desktop", () => {
			const type = "indicator";
			const tooltip = "Here is current checked device.";

			const toolbarWrap = document.createElement("div");

			const button = createIndicatorButton(toolbarWrap, "desktop");

			expect(button).not.toBeNull();
			expect(button).toBeInstanceOf(HTMLButtonElement);
			expect(button.type).toBe("button");
			expect(button.disabled).toBe(true);
			expect(button.dataset.buttonType).toBe(type);
			expect(button.dataset.tooltip).toBe(tooltip);
			expect(button.dataset.formFactor).toBe("desktop");
			expect(
				button.parentElement?.classList.contains(
					`astro-page-insight-toolbar-button-wrap-${type}`,
				),
			).toBe(true);
		});

		it("should create a createIndicatorButton with Desktop", () => {
			const type = "indicator";
			const tooltip = "Here is current checked device.";

			const toolbarWrap = document.createElement("div");

			const button = createIndicatorButton(toolbarWrap, "mobile");

			expect(button).not.toBeNull();
			expect(button).toBeInstanceOf(HTMLButtonElement);
			expect(button.type).toBe("button");
			expect(button.disabled).toBe(true);
			expect(button.dataset.buttonType).toBe(type);
			expect(button.dataset.tooltip).toBe(tooltip);
			expect(button.dataset.formFactor).toBe("mobile");
			expect(
				button.parentElement?.classList.contains(
					`astro-page-insight-toolbar-button-wrap-${type}`,
				),
			).toBe(true);
		});
	});
});
