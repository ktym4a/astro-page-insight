import { expect } from "@playwright/test";
import { testFactory } from "./utils";

const test = testFactory("ssr");

test.describe("ssr - preview", () => {
	test("Initial load", async ({ preview, page }) => {
		await page.goto("http://localhost:4324/");
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator("page-insight-root")).toHaveCount(1);

		const toolbar = page.locator("page-insight-root");
		const powerButton = await toolbar.locator(
			'button[data-button-type="power"]',
		);

		const consoleAlertButton = toolbar.locator(
			'button[data-button-type="console-alert"]',
		);

		expect(powerButton).not.toBeDisabled();
		expect(consoleAlertButton).not.toBeDisabled();

		const pageInsightHighlight = toolbar.locator(
			".astro-page-insight-highlight",
		);
		await expect(pageInsightHighlight).toBeVisible();

		await powerButton.click();

		await expect(consoleAlertButton).toBeDisabled();
		await expect(pageInsightHighlight).not.toBeVisible();

		await page.goto("http://localhost:4324/about/");
		await expect(page.locator(".astro-page-insight-toolbar")).toHaveCount(1);
		await expect(powerButton).not.toBeDisabled();
		await expect(consoleAlertButton).not.toBeDisabled();
		await expect(pageInsightHighlight).toBeVisible();

		await page.goto("http://localhost:4324/test");
		await expect(page.locator(".astro-page-insight-toolbar")).toHaveCount(0);
	});

	test.afterAll(async ({ preview }) => {
		await preview.stop();
	});
});
