import { expect } from "@playwright/test";
import { testFactory } from "./utils";

const test = testFactory("view-transitions");

test.describe("view-transitions - dev", () => {
	test("Move to other page", async ({ dev, page }) => {
		await page.goto("http://localhost:4323/");
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

		const link = await page.locator("#link");
		await link.click();

		await expect(pageInsightToolbar).not.toBeVisible();

		await appButton.click();
		await expect(pageInsightToolbar).toBeVisible();
	});

	test.afterAll(async ({ dev }) => {
		await dev.stop();
	});
});

test.describe("view-transitions - preview", () => {
	test("Initial load", async ({ preview, page }) => {
		await page.goto("http://localhost:4323/");
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
		expect(consoleAlertButton).toBeDisabled();

		const pageInsightHighlight = toolbar.locator(
			".astro-page-insight-highlight",
		);
		await expect(pageInsightHighlight).not.toBeVisible();

		await powerButton.click();

		await expect(consoleAlertButton).not.toBeDisabled();
		await expect(pageInsightHighlight).toBeVisible();

		await page.goto("http://localhost:4323/about/");
		await expect(page.locator(".astro-page-insight-toolbar")).toHaveCount(1);

		await expect(powerButton).not.toBeDisabled();
		await expect(consoleAlertButton).toBeDisabled();

		await expect(pageInsightHighlight).not.toBeVisible();

		await powerButton.click();

		await expect(consoleAlertButton).not.toBeDisabled();
		await expect(pageInsightHighlight).toBeVisible();

		await page.goto("http://localhost:4323/test");
		await expect(page.locator(".astro-page-insight-toolbar")).toHaveCount(0);
	});

	test.afterAll(async ({ preview }) => {
		await preview.stop();
	});
});
