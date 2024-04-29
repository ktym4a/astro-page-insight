import { expect } from "@playwright/test";
import { testFactory } from "./utils";

const test = testFactory("ssg-with-custom");

test.describe("ssg with custom - dev", () => {
	test("Initial load has Cache in mobile", async ({ dev, page }) => {
		await page.goto("http://localhost:4322/");
		await page.setViewportSize({ width: 376, height: 667 });

		const toolbar = page.locator("astro-dev-toolbar");

		await page.waitForTimeout(1000);

		const appButton = await toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);
		expect(appButton).toBeVisible();

		const notification = await appButton.locator(".notification");
		const notificationLevel = await notification.getAttribute("data-level");
		await expect(notificationLevel).toBe("warning");

		await appButton.click();

		const pageInsightCanvas = await toolbar.locator(
			'astro-dev-toolbar-app-canvas[data-app-id="astro-page-insight-app"]',
		);

		const pageInsightToolbar = pageInsightCanvas.locator(
			".astro-page-insight-toolbar",
		);

		expect(pageInsightToolbar).toBeVisible();
		expect(pageInsightToolbar).toHaveCount(1);

		const pageInsightHighlight = pageInsightCanvas.locator(
			".astro-page-insight-highlight",
		);
		expect(pageInsightHighlight).toHaveCount(0);

		let formFactor = await pageInsightToolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("desktop");

		await page.setViewportSize({ width: 375, height: 667 });
		await expect(pageInsightHighlight).toHaveCount(1);
		formFactor = await pageInsightToolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("mobile");

		const consoleAlertButton = pageInsightToolbar.locator(
			'button[data-button-type="console-alert"]',
		);
		await consoleAlertButton.click();
		const consoleAlertModal = pageInsightToolbar.locator(
			'div[data-type="console-alert"]',
		);
		await expect(consoleAlertModal).toBeVisible();
		await expect(consoleAlertModal.locator('[data-type="pwa"]')).toBeVisible();

		const scoreButton = pageInsightToolbar.locator(
			'button[data-button-type="score"]',
		);
		await scoreButton.click();
		const scoreModal = pageInsightToolbar.locator('div[data-type="score"]');
		await expect(scoreModal).toBeVisible();
		await expect(scoreModal.locator('[data-type="pwa"]')).toBeVisible();
	});

	test.afterAll(async ({ dev }) => {
		await dev.stop();
	});
});
