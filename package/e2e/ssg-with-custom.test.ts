import { expect } from "@playwright/test";
import { testFactory } from "./utils";

const test = testFactory("ssg-with-custom");

test.describe("ssg with custom - dev", () => {
	test("Initial load has Cache in mobile", async ({ dev, page }) => {
		await page.goto("http://localhost:4322/");

		const toolbar = page.locator("astro-dev-toolbar");

		// wait 1s for the app to be ready
		await page.waitForTimeout(1000);

		const appButton = await toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);
		expect(appButton).toBeVisible();
		// console.log(await appButton.innerHTML());

		// const h1 = await page.locator("h1");
		// console.log("aaaaaaaa", await h1.innerText());

		const notification = await appButton.locator(".notification");
		const notificationLevel = await notification.getAttribute("data-level");
		await expect(notificationLevel).toBe("warning");

		await appButton.click();

		// const pageInsightCanvas = await toolbar.locator(
		// 	'astro-dev-toolbar-app-canvas[data-app-id="astro-page-insight-app"]',
		// );

		// const pageInsightToolbar = pageInsightCanvas.locator(
		// 	".astro-page-insight-toolbar",
		// );

		// expect(pageInsightToolbar).toBeVisible();
		// expect(pageInsightToolbar).toHaveCount(1);

		// const pageInsightHighlight = pageInsightCanvas.locator(
		// 	".astro-page-insight-highlight",
		// );
		// expect(pageInsightHighlight).toHaveCount(0);
	});

	test.afterAll(async ({ dev }) => {
		await dev.stop();
	});
});
