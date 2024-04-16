import { expect } from "@playwright/test";
import { testFactory } from "./utils";

const test = testFactory();

test.describe("ssg with no cache - dev", () => {
	test("Initial load", async ({ dev, page }) => {
		await page.goto("http://localhost:4321/");

		const toolbar = page.locator("astro-dev-toolbar");
		const appButton = toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);
		expect(appButton).toBeVisible();

		await appButton.click();

		const pageInsightCanvas = await toolbar.locator(
			'astro-dev-toolbar-app-canvas[data-app-id="astro-page-insight-app"]',
		);

		const pageInsightToolbar = pageInsightCanvas.locator(
			".astro-page-insight-toolbar",
		);

		expect(pageInsightToolbar).toBeVisible();
		expect(pageInsightToolbar).toHaveCount(1);

		const buttons = pageInsightToolbar.getByRole("button");
		expect(buttons).toHaveCount(6);

		const hiddenButton = pageInsightToolbar.getByRole("button", {
			disabled: true,
		});
		expect(hiddenButton).toHaveCount(1);
		expect(hiddenButton).toHaveAttribute("data-button-type", "indicator");
		expect(hiddenButton).toHaveAttribute(
			"data-tooltip",
			"Here is current checked device.",
		);

		await appButton.click();
	});

	test("Click buttons", async ({ dev, page }) => {
		await page.goto("http://localhost:4321/");

		const toolbar = page.locator("astro-dev-toolbar");
		const appButton = toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);
		expect(appButton).toBeVisible();

		await appButton.click();

		const pageInsightCanvas = await toolbar.locator(
			'astro-dev-toolbar-app-canvas[data-app-id="astro-page-insight-app"]',
		);

		const pageInsightToolbar = pageInsightCanvas.locator(
			".astro-page-insight-toolbar",
		);

		// console alert
		const consoleAlertModal = pageInsightToolbar.locator(
			'div[data-type="console-alert"]',
		);
		expect(consoleAlertModal).not.toBeVisible();
		const consoleAlertButton = pageInsightToolbar.locator(
			'button[data-button-type="console-alert"]',
		);
		expect(consoleAlertButton).not.toHaveClass("active");
		await consoleAlertButton.click();
		expect(consoleAlertModal).toBeVisible();
		expect(consoleAlertButton).toHaveClass("active");
		const consoleAlertModalTitle = consoleAlertModal.locator("h2");
		expect(consoleAlertModalTitle).toContainText(
			"Non-element errors - (Desktop)",
		);
		const consoleAlertModalText = consoleAlertModal.locator("p").last();
		expect(consoleAlertModalText).toContainText("No non-element errors found.");
		await consoleAlertButton.click();
		expect(consoleAlertModal).not.toBeVisible();

		// hide
		const hideModal = pageInsightToolbar.locator('div[data-type="hide"]');
		expect(hideModal).not.toBeVisible();
		const hideButton = pageInsightToolbar.locator(
			'button[data-button-type="hide"]',
		);
		expect(hideButton).not.toHaveClass("active");
		await hideButton.click();
		expect(hideModal).toBeVisible();
		expect(hideButton).toHaveClass("active");
		const hideModalTitle = hideModal.locator("h2");
		expect(hideModalTitle).toContainText("Hide highlights - (Desktop)");
		const hideModalText = hideModal.locator("p").last();
		expect(hideModalText).toContainText("No hidden highlights found.");
		await hideButton.click();
		expect(hideModal).not.toBeVisible();

		// score
		const scoreModal = pageInsightToolbar.locator('div[data-type="score"]');
		expect(scoreModal).not.toBeVisible();
		const scoreButton = pageInsightToolbar.locator(
			'button[data-button-type="score"]',
		);
		expect(scoreButton).not.toHaveClass("active");
		await scoreButton.click();
		expect(scoreModal).toBeVisible();
		expect(scoreButton).toHaveClass("active");
		const scoreModalTitle = scoreModal.locator("h2");
		expect(scoreModalTitle).toContainText("Score - (Desktop)");
		const scoreModalText = scoreModal.locator("p").last();
		expect(scoreModalText).toContainText("No data.");
		await scoreButton.click();
		expect(scoreModal).not.toBeVisible();

		// filter
		const filterModal = pageInsightToolbar.locator('div[data-type="filter"]');
		expect(filterModal).not.toBeVisible();
		const filterButton = pageInsightToolbar.locator(
			'button[data-button-type="filter"]',
		);
		expect(filterButton).not.toHaveClass("active");
		await filterButton.click();
		expect(filterModal).toBeVisible();
		expect(filterButton).toHaveClass("active");
		const filterModalTitle = filterModal.locator("h2");
		expect(filterModalTitle).toContainText("Filter - (Desktop)");
		await filterButton.click();
		expect(filterModal).not.toBeVisible();

		// fetch
		const fetchButton = pageInsightToolbar.locator(
			'button[data-button-type="fetch"]',
		);
		await fetchButton.click();
		expect(consoleAlertButton).toBeDisabled();
		expect(hideButton).toBeDisabled();
		expect(scoreButton).toBeDisabled();
		expect(filterButton).toBeDisabled();
		expect(fetchButton).toBeDisabled();

		await page.waitForSelector(".astro-page-insight-toast");
		const toast = await pageInsightCanvas.locator(".astro-page-insight-toast");
		expect(toast).toBeVisible();
		expect(toast).toHaveCount(1);
		expect(toast).toContainText("Analysis of lighthouse results is complete.");

		expect(consoleAlertButton).not.toBeDisabled();
		expect(hideButton).not.toBeDisabled();
		expect(scoreButton).not.toBeDisabled();
		expect(filterButton).not.toBeDisabled();
		expect(fetchButton).not.toBeDisabled();

		await page.waitForSelector(".astro-page-insight-toast", {
			state: "detached",
		});
		expect(toast).not.toBeVisible();

		await appButton.click();
	});
});
