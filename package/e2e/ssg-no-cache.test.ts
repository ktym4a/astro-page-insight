import { expect } from "@playwright/test";
import { buttonListForDev, testFactory } from "./utils.ts";

const test = testFactory("ssg-no-cache");

test.describe("ssg with no cache - dev", () => {
	test("Initial load", async ({ dev, page }) => {
		await page.goto("http://localhost:4321/");

		const toolbar = page.locator("astro-dev-toolbar");
		const appButton = toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);
		expect(appButton).toBeVisible();

		const notification = appButton.locator(".notification");
		const notificationLevel = await notification.getAttribute("data-level");
		expect(notificationLevel).toBe(null);

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

		const buttons = await pageInsightToolbar
			.getByRole("button")
			.and(pageInsightCanvas.locator("[data-tooltip]"));
		expect(buttons).toHaveCount(6);

		for (const [i, obj] of Object.entries(buttonListForDev)) {
			const button = buttons.nth(Number(i));
			const [type, tooltip] = obj;
			expect(button).toHaveAttribute("data-button-type", type);
			expect(button).toHaveAttribute("data-tooltip", tooltip);
			expect(button).not.toHaveClass("active");
			expect(button).not.toHaveClass("astro-page-insight-toolbar-button-alert");

			if (type === "indicator") {
				expect(button).toBeDisabled();
			} else {
				expect(button).not.toBeDisabled();
			}

			const modal = pageInsightToolbar.locator(`div[data-type="${type}"]`);
			expect(modal).not.toBeVisible();
			if (type === "fetch" || type === "indicator") {
				continue;
			}

			await button.click();

			expect(modal).toBeVisible();
			expect(button).toHaveClass("active");
			const title = modal.locator("h2");
			expect(title).toContainText("- (Desktop)");

			await button.click();
			expect(modal).not.toBeVisible();
			expect(button).not.toHaveClass("active");
		}

		await appButton.click();
	});

	test("Resize with no data", async ({ dev, page }) => {
		await page.goto("http://localhost:4321/");

		const toolbar = page.locator("astro-dev-toolbar");
		const appButton = toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);

		await appButton.click();

		const pageInsightToolbar = toolbar.locator(".astro-page-insight-toolbar");

		const buttons = await pageInsightToolbar
			.getByRole("button")
			.and(pageInsightToolbar.locator("[data-tooltip]"));
		expect(buttons).toHaveCount(6);
		let formFactor = await pageInsightToolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("desktop");

		await page.setViewportSize({ width: 767, height: 667 });
		for (const [i, obj] of Object.entries(buttonListForDev)) {
			const button = buttons.nth(Number(i));
			const [type] = obj;

			const modal = pageInsightToolbar.locator(`div[data-type="${type}"]`);
			if (type === "fetch" || type === "indicator") {
				continue;
			}

			await button.click();

			const title = modal.locator("h2");
			expect(title).toContainText("- (Mobile)");
		}
		formFactor = await pageInsightToolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("mobile");

		await page.setViewportSize({ width: 768, height: 667 });
		for (const [i, obj] of Object.entries(buttonListForDev)) {
			const button = buttons.nth(Number(i));
			const [type] = obj;

			const modal = pageInsightToolbar.locator(`div[data-type="${type}"]`);
			if (type === "fetch" || type === "indicator") {
				continue;
			}

			await button.click();

			const title = modal.locator("h2");
			expect(title).toContainText("- (Desktop)");
		}
		formFactor = await pageInsightToolbar
			.locator('button[data-button-type="indicator"]')
			.getAttribute("data-form-factor");
		expect(formFactor).toBe("desktop");

		await appButton.click();
	});

	test("Initial flow", async ({ dev, page }) => {
		await page.goto("http://localhost:4321/");

		await page.setViewportSize({ width: 1200, height: 667 });

		const toolbar = page.locator("astro-dev-toolbar");
		const appButton = toolbar.locator(
			'button[data-app-id="astro-page-insight-app"]',
		);

		await appButton.click();

		const notification = appButton.locator(".notification");
		let notificationLevel = await notification.getAttribute("data-level");
		expect(notificationLevel).toBe(null);

		const pageInsightCanvas = await toolbar.locator(
			'astro-dev-toolbar-app-canvas[data-app-id="astro-page-insight-app"]',
		);

		const pageInsightToolbar = pageInsightCanvas.locator(
			".astro-page-insight-toolbar",
		);

		const highlights = pageInsightCanvas.locator(
			".astro-page-insight-highlight",
		);
		let highlightsCount = await highlights.count();
		await expect(highlightsCount).toBe(0);

		const fetchButton = pageInsightToolbar.locator(
			'button[data-button-type="fetch"]',
		);
		expect(fetchButton).not.toBeDisabled();
		expect(fetchButton).not.toHaveClass("animate");

		const indicatorButton = pageInsightToolbar.locator(
			'button[data-button-type="indicator"]',
		);
		const consoleAlertButton = pageInsightToolbar.locator(
			'button[data-button-type="console-alert"]',
		);
		const hideButton = pageInsightToolbar.locator(
			'button[data-button-type="hide"]',
		);
		const scoreButton = pageInsightToolbar.locator(
			'button[data-button-type="score"]',
		);
		const filterButton = pageInsightToolbar.locator(
			'button[data-button-type="filter"]',
		);
		expect(indicatorButton).toBeDisabled();
		expect(consoleAlertButton).not.toBeDisabled();
		expect(hideButton).not.toBeDisabled();
		expect(scoreButton).not.toBeDisabled();
		expect(filterButton).not.toBeDisabled();

		// fetch start
		await fetchButton.click();
		expect(fetchButton).toBeDisabled();
		expect(fetchButton).toHaveClass("animate");
		notificationLevel = await notification.getAttribute("data-level");
		expect(notificationLevel).toBe("warning");

		expect(indicatorButton).toBeDisabled();
		expect(consoleAlertButton).toBeDisabled();
		expect(hideButton).toBeDisabled();
		expect(scoreButton).toBeDisabled();
		expect(filterButton).toBeDisabled();

		await page.setViewportSize({ width: 400, height: 667 });

		await expect(fetchButton).toBeDisabled();
		await expect(fetchButton).toHaveClass("animate");
		notificationLevel = await notification.getAttribute("data-level");
		expect(notificationLevel).toBe("warning");

		expect(indicatorButton).toBeDisabled();
		expect(consoleAlertButton).toBeDisabled();
		expect(hideButton).toBeDisabled();
		expect(scoreButton).toBeDisabled();
		expect(filterButton).toBeDisabled();

		await page.setViewportSize({ width: 1200, height: 667 });

		await page.waitForSelector(".astro-page-insight-toast");

		// fetch end
		const toast = await pageInsightCanvas.locator(".astro-page-insight-toast");
		expect(toast).toBeVisible();
		expect(toast).toHaveCount(1);
		expect(toast).toContainText("Analysis of lighthouse results is complete.");

		notificationLevel = await notification.getAttribute("data-level");
		expect(notificationLevel).toBe("info");

		expect(fetchButton).not.toBeDisabled();
		expect(fetchButton).not.toHaveClass("animate");

		// check the toast is hidden
		await page.waitForSelector(".astro-page-insight-toast", {
			state: "detached",
		});
		expect(toast).not.toBeVisible();

		// test highlight
		highlightsCount = await highlights.count();
		expect(highlightsCount).toBeGreaterThan(0);
		const dataDetailSelector = await highlights
			.first()
			.getAttribute("data-detail-selector");
		const highlight = pageInsightCanvas.locator(
			`[data-detail-selector="${dataDetailSelector}"]`,
		);
		expect(highlight).toBeVisible();
		expect(highlight).toHaveCSS("width", "1199px");
		await page.setViewportSize({ width: 1100, height: 667 });
		expect(highlight).toHaveCSS("width", "1099px");
		const tooltip = highlight.locator(".astro-page-insight-tooltip");
		expect(tooltip).not.toBeVisible();

		await highlight.hover();
		expect(tooltip).toBeVisible();
		const accessibilityTooltip = tooltip.locator("[data-type='accessibility']");
		expect(accessibilityTooltip).toBeVisible();
		const performanceTooltip = tooltip.locator("[data-type='performance']");
		expect(performanceTooltip).toBeVisible();
		await page.setViewportSize({ width: 400, height: 667 });
		await expect(highlight).not.toBeVisible();
		await expect(tooltip).not.toBeVisible();
		await page.setViewportSize({ width: 1200, height: 667 });

		// test console-alert
		expect(consoleAlertButton).not.toBeDisabled();
		expect(consoleAlertButton).toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		await consoleAlertButton.click();
		const consoleAlertModal = pageInsightToolbar.locator(
			'div[data-type="console-alert"]',
		);
		expect(consoleAlertModal).toBeVisible();
		expect(consoleAlertModal.locator('[data-type="console"]')).toBeVisible();
		expect(consoleAlertModal.locator('[data-type="document"]')).toBeVisible();
		await page.setViewportSize({ width: 400, height: 667 });
		await expect(consoleAlertButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		await expect(consoleAlertModal).toContainText(
			"No non-element errors found.",
		);
		await page.setViewportSize({ width: 1200, height: 667 });

		// test hide
		expect(hideButton).not.toBeDisabled();
		expect(hideButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		await hideButton.click();
		const hideModal = pageInsightToolbar.locator('div[data-type="hide"]');
		expect(hideModal).toBeVisible();
		expect(hideModal).toContainText("No hidden highlights found.");
		const hideHighlightButton = highlight.getByRole("button");
		await hideHighlightButton.click();
		expect(
			hideModal.locator(`[data-type="${dataDetailSelector}"]`),
		).toBeVisible();
		expect(tooltip).not.toBeVisible();
		expect(highlight).not.toBeVisible();
		expect(hideButton).toHaveClass(
			"active astro-page-insight-toolbar-button-alert",
		);
		await page.setViewportSize({ width: 400, height: 667 });
		await expect(hideButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		await expect(hideModal).toContainText("No hidden highlights found.");
		await page.setViewportSize({ width: 1200, height: 667 });
		const restoreButton = hideModal.getByRole("button");
		await expect(hideModal).toBeVisible();
		expect(restoreButton).toBeVisible();
		await restoreButton.click();
		expect(highlight).toBeVisible();
		expect(hideButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		expect(hideModal).toContainText("No hidden highlights found.");

		// test score
		expect(scoreButton).not.toBeDisabled();
		expect(scoreButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		await scoreButton.click();
		const scoreModal = pageInsightToolbar.locator('div[data-type="score"]');
		expect(scoreModal).toBeVisible();
		expect(scoreModal).not.toContainText("No data.");
		expect(scoreModal.locator('[data-type="accessibility"]')).toBeVisible();
		expect(scoreModal.locator('[data-type="best practices"]')).toBeVisible();
		expect(scoreModal.locator('[data-type="performance"]')).toBeVisible();
		expect(scoreModal.locator('[data-type="seo"]')).toBeVisible();
		await page.setViewportSize({ width: 400, height: 667 });
		await expect(scoreModal).toContainText("No data.");
		await page.setViewportSize({ width: 1200, height: 667 });

		// test filter
		expect(filterButton).not.toBeDisabled();
		expect(filterButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);
		await filterButton.click();
		const filterModal = pageInsightToolbar.locator('div[data-type="filter"]');
		expect(filterModal).toBeVisible();
		const filterAccessibility = filterModal.locator(
			'[data-type="accessibility"]',
		);
		expect(filterAccessibility).toBeVisible();
		expect(filterAccessibility).toContainText("1");
		const filterBestPractices = filterModal.locator(
			'[data-type="best practices"]',
		);
		expect(filterBestPractices).toBeVisible();
		expect(filterBestPractices).toContainText("0");
		const filterPerformance = filterModal.locator('[data-type="performance"]');
		expect(filterPerformance).toBeVisible();
		expect(filterPerformance).toContainText("1");
		const filterSeo = filterModal.locator('[data-type="seo"]');
		expect(filterSeo).toBeVisible();
		expect(filterSeo).toContainText("0");

		const filterPerformanceButton = filterPerformance.getByRole("button");
		await filterPerformanceButton.click();
		await highlight.hover();
		expect(tooltip).toBeVisible();
		expect(accessibilityTooltip).toBeVisible();
		expect(performanceTooltip).not.toBeVisible();
		expect(filterButton).toHaveClass(
			"active astro-page-insight-toolbar-button-alert",
		);
		await filterPerformanceButton.click();
		await highlight.hover();
		expect(tooltip).toBeVisible();
		expect(accessibilityTooltip).toBeVisible();
		expect(performanceTooltip).toBeVisible();
		expect(filterButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);

		const filterAccessibilityButton = filterAccessibility.getByRole("button");
		await filterAccessibilityButton.click();
		await highlight.hover();
		expect(tooltip).toBeVisible();
		expect(accessibilityTooltip).not.toBeVisible();
		expect(performanceTooltip).toBeVisible();
		expect(filterButton).toHaveClass(
			"active astro-page-insight-toolbar-button-alert",
		);
		await filterAccessibilityButton.click();
		await highlight.hover();
		expect(tooltip).toBeVisible();
		expect(accessibilityTooltip).toBeVisible();
		expect(performanceTooltip).toBeVisible();
		expect(filterButton).not.toHaveClass(
			"astro-page-insight-toolbar-button-alert",
		);

		await filterAccessibilityButton.click();
		await filterPerformanceButton.click();
		expect(highlight).not.toBeVisible();
		expect(tooltip).not.toBeVisible();
		expect(filterButton).toHaveClass(
			"active astro-page-insight-toolbar-button-alert",
		);

		await filterAccessibilityButton.click();
		await filterPerformanceButton.click();
		expect(highlight).toBeVisible();
		await highlight.hover();
		expect(tooltip).toBeVisible();
		expect(accessibilityTooltip).toBeVisible();
		expect(performanceTooltip).toBeVisible();

		await appButton.click();
	});

	test.afterAll(async ({ dev }) => {
		await dev.stop();
	});
});

test.describe("ssg with no cache - preview", () => {
	test("Initial load", async ({ preview, page }) => {
		await page.goto("http://localhost:4321/");

		await expect(page.locator("page-insight-root")).toHaveCount(0);
	});

	test.afterAll(async ({ preview }) => {
		await preview.stop();
	});
});
