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
		await expect(appButton).toBeVisible();

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

test.describe("ssg with custom - preview", () => {
	test("Initial load", async ({ preview, page }) => {
		await page.goto("http://localhost:4322/");
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

		await page.goto("http://localhost:4322/about/");
		await expect(page.locator(".astro-page-insight-toolbar")).toHaveCount(1);
		await expect(powerButton).not.toBeDisabled();
		await expect(consoleAlertButton).not.toBeDisabled();
		await expect(pageInsightHighlight).toBeVisible();

		await page.goto("http://localhost:4322/test");
		await expect(page.locator(".astro-page-insight-toolbar")).toHaveCount(0);
	});

	test("Click to show", async ({ preview, page }) => {
		await page.goto("http://localhost:4322/");
		await page.setViewportSize({ width: 376, height: 667 });

		const toolbar = page.locator("page-insight-root");

		await page.waitForTimeout(1000);

		const pageInsightHighlight = toolbar.locator(
			".astro-page-insight-highlight",
		);
		expect(pageInsightHighlight).not.toBeVisible();

		let formFactor = await toolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("desktop");

		const powerButton = await toolbar.locator(
			'button[data-button-type="power"]',
		);

		await expect(pageInsightHighlight).not.toBeVisible();

		await page.setViewportSize({ width: 375, height: 667 });
		await expect(pageInsightHighlight).toBeVisible();
		formFactor = await toolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("mobile");

		await powerButton.click();
		await expect(pageInsightHighlight).not.toBeVisible();
		await powerButton.click();

		const consoleAlertButton = toolbar.locator(
			'button[data-button-type="console-alert"]',
		);
		await consoleAlertButton.click();
		const consoleAlertModal = toolbar.locator('div[data-type="console-alert"]');
		await expect(consoleAlertModal).toBeVisible();
		await expect(consoleAlertModal.locator('[data-type="pwa"]')).toBeVisible();

		const scoreButton = toolbar.locator('button[data-button-type="score"]');
		await scoreButton.click();
		const scoreModal = toolbar.locator('div[data-type="score"]');
		await expect(scoreModal).toBeVisible();
		await expect(scoreModal.locator('[data-type="pwa"]')).toBeVisible();
	});

	test.afterAll(async ({ preview }) => {
		await preview.stop();
	});
});
