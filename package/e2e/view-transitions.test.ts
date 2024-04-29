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

		await page.goto("http://localhost:4323/about/");

		await expect(pageInsightToolbar).not.toBeVisible();

		await appButton.click();
		await expect(pageInsightToolbar).toBeVisible();
	});

	test.afterAll(async ({ dev }) => {
		await dev.stop();
	});
});
