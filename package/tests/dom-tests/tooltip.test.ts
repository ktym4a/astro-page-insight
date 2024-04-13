// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { COLORS } from "../../src/constants";
import type { ErrorTooltips } from "../../src/types";
import {
	createContent,
	createContentTitle,
	createDetails,
	createSummary,
	createTooltip,
} from "../../src/ui/tooltip";

describe("tooltip", () => {
	describe("createContent", () => {
		it("should create a tooltip content with no last", () => {
			const content = "content";
			const isLast = false;

			const tooltipContent = createContent(content, isLast);

			expect(tooltipContent).not.toBeNull();
			expect(tooltipContent).toBeInstanceOf(HTMLParagraphElement);
			expect(tooltipContent.textContent).toBe(content);
			expect(tooltipContent.style.marginBottom).toBe("12px");
			expect(tooltipContent.style.borderBottom).toBe("1px solid #cdd6f4");
			expect(tooltipContent.style.paddingBottom).toBe("12px");
		});

		it("should create a tooltip content with last", () => {
			const content = "content";
			const isLast = true;

			const tooltipContent = createContent(content, isLast);

			expect(tooltipContent).not.toBeNull();
			expect(tooltipContent).toBeInstanceOf(HTMLParagraphElement);
			expect(tooltipContent.textContent).toBe(content);
			expect(tooltipContent.style.marginBottom).toBe("0px");
			expect(tooltipContent.style.borderBottom).toBe("");
		});
	});

	describe("createContentTitle", () => {
		it("should create a tooltip content title", () => {
			const title = "title";

			const tooltipContentTitle = createContentTitle(title, null);

			const titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			const titleText = tooltipContentTitle.children[0]
				?.children[1] as HTMLParagraphElement;

			expect(tooltipContentTitle).not.toBeNull();
			expect(tooltipContentTitle).toBeInstanceOf(HTMLHeadingElement);
			expect(titleIcon.style.color).toBe(COLORS.red);
			expect(titleText.textContent).toBe(title);
		});

		it("should create a tooltip content title with score", () => {
			const title = "title";

			let tooltipContentTitle = createContentTitle(title, 1);

			let titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			const titleText = tooltipContentTitle.children[0]
				?.children[1] as HTMLParagraphElement;

			expect(tooltipContentTitle).not.toBeNull();
			expect(tooltipContentTitle).toBeInstanceOf(HTMLHeadingElement);
			expect(titleIcon.style.color).toBe(COLORS.green);
			expect(titleText.textContent).toBe(title);

			tooltipContentTitle = createContentTitle(title, 0.5);

			titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			expect(titleIcon.style.color).toBe(COLORS.yellow);

			tooltipContentTitle = createContentTitle(title, 0);

			titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			expect(tooltipContentTitle).not.toBeNull();
			expect(tooltipContentTitle).toBeInstanceOf(HTMLHeadingElement);
			expect(titleIcon.style.color).toBe(COLORS.red);

			tooltipContentTitle = createContentTitle(title, 0, "score");

			titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			expect(tooltipContentTitle).not.toBeNull();
			expect(tooltipContentTitle).toBeInstanceOf(HTMLHeadingElement);
			expect(titleIcon.style.color).toBe(COLORS.red);

			tooltipContentTitle = createContentTitle(title, 1, "metricSavings");

			titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			expect(tooltipContentTitle).not.toBeNull();
			expect(tooltipContentTitle).toBeInstanceOf(HTMLHeadingElement);
			expect(titleIcon.style.color).toBe(COLORS.green);
		});

		it("should create a tooltip content title with subTitle", () => {
			const title = "title";
			const subTitleList = ["subTitle1", "subTitle2", "LCP"];

			let tooltipContentTitle = createContentTitle(title, 1, "", subTitleList);

			const subTitleArea = tooltipContentTitle.children[1] as HTMLDivElement;
			let titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;

			expect(subTitleArea).not.toBeNull();
			expect(subTitleArea.children.length).toBe(subTitleList.length);
			expect(titleIcon.style.color).toBe(COLORS.green);
			for (const [index, subTitle] of subTitleList.entries()) {
				const subTitleElement = subTitleArea.children[
					index
				] as HTMLParagraphElement;
				expect(subTitleElement).not.toBeNull();
				expect(subTitleElement.textContent).toBe(subTitle);
			}

			tooltipContentTitle = createContentTitle(
				title,
				1,
				"metricSavings",
				subTitleList,
			);
			titleIcon = tooltipContentTitle.children[0]
				?.children[0] as HTMLDivElement;
			expect(titleIcon.style.color).toBe(COLORS.blue);
		});
	});

	describe("createSummary", () => {
		it("should create a tooltip summary", () => {
			const category = "category";
			const length = 3;

			const tooltipSummary = createSummary(category, length);

			expect(tooltipSummary).not.toBeNull();
			expect(tooltipSummary).toBeInstanceOf(HTMLDivElement);
			expect(tooltipSummary.textContent).toBe(`${category} (${length})`);
		});
	});

	describe("createDetails", () => {
		it("should create a details with no last", () => {
			const last = false;

			const details = createDetails(last);

			expect(details).not.toBeNull();
			expect(details).toBeInstanceOf(HTMLDetailsElement);
			expect(details.style.paddingBottom).toBe("15px");
		});

		it("should create a details with last", () => {
			const last = true;

			const details = createDetails(last);

			expect(details).not.toBeNull();
			expect(details).toBeInstanceOf(HTMLDetailsElement);
			expect(details.style.paddingBottom).toBe("");
		});
	});

	describe("createTooltip", () => {
		it("should create a tooltip with title", () => {
			const tooltips: ErrorTooltips = {
				category1: [
					{
						title: "title1",
						score: 1,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
					{
						title: "title1",
						score: 1,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
					{
						title: "title1",
						score: 1,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
				],
				category2: [
					{
						title: "title2",
						score: 0.5,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
					{
						title: "title2",
						score: 0.5,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
				],
				category3: [
					{
						title: "title3",
						score: 0.5,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
				],
			};
			const titleOption = {
				text: "title",
				icon: true,
			};

			const tooltip = createTooltip(tooltips, titleOption);
			const titleElement = tooltip.children[0] as HTMLDivElement;

			expect(tooltip).not.toBeNull();
			expect(tooltip.childElementCount).toBe(1 + Object.keys(tooltips).length);
			expect(tooltip.classList.contains("astro-page-insight-tooltip")).toBe(
				true,
			);
			expect(titleElement).not.toBeNull();

			const tooltipEntries = Object.entries(tooltips).sort((a, b) =>
				a[0].localeCompare(b[0]),
			);

			for (const [index] of tooltipEntries.entries()) {
				const details = tooltip.children[index + 1] as HTMLDetailsElement;
				expect(details).not.toBeNull();

				const summary = details.children[0] as HTMLDivElement;
				expect(summary).not.toBeNull();
			}
		});

		it("should create a tooltip without title", () => {
			const tooltips: ErrorTooltips = {
				category1: [
					{
						title: "title1",
						score: 1,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
					{
						title: "title1",
						score: 1,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
					{
						title: "title1",
						score: 1,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
				],
				category2: [
					{
						title: "title2",
						score: 0.5,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
					{
						title: "title2",
						score: 0.5,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
				],
				category3: [
					{
						title: "title3",
						score: 0.5,
						scoreDisplayMode: "score",
						subTitle: ["subTitle1", "subTitle2"],
						content: "content",
					},
				],
			};
			const titleOption = {
				text: "",
				icon: true,
			};

			const tooltip = createTooltip(tooltips, titleOption);

			expect(tooltip).not.toBeNull();
			expect(tooltip.childElementCount).toBe(Object.keys(tooltips).length);
			expect(tooltip.classList.contains("astro-page-insight-tooltip")).toBe(
				true,
			);
		});
	});
});
