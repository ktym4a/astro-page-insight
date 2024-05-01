import type { CacheLHResultByFormFactor } from "../../src/types/index.ts";

export const lhResult: CacheLHResultByFormFactor = {
	desktop: {
		elements: {
			"html > body > *:nth-child(4) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 5703,
						bottom: 5733,
						left: 375,
						right: 435,
						width: 60,
						height: 30,
					},
					detailSelector: "body > footer > p",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 5707,
						bottom: 5729,
						left: 1205,
						right: 1266,
						width: 62,
						height: 22,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(3)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 5707,
						bottom: 5729,
						left: 1321,
						right: 1379,
						width: 58,
						height: 22,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1)":
				[
					{
						score: 0,
						scoreDisplayMode: "numeric",
						title:
							"Background and foreground colors do not have a sufficient contrast ratio.",
						description:
							"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
						categories: ["Accessibility"],
						rect: {
							top: 435,
							bottom: 461,
							left: 375,
							right: 431,
							width: 56,
							height: 26,
						},
						detailSelector:
							"div.version_wrapper > div.version_info > a > div.version_number",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(2) > *:nth-child(1)":
				[
					{
						score: 1850,
						scoreDisplayMode: "metricSavings",
						title: "Largest Contentful Paint element",
						description:
							"This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
						categories: ["Performance", "LCP"],
						rect: {
							top: 498,
							bottom: 805,
							left: 635,
							right: 1379,
							width: 744,
							height: 306,
						},
						detailSelector: "li.post > div.content > p > img",
					},
					{
						score: 450,
						scoreDisplayMode: "metricSavings",
						title: "Largest Contentful Paint image was lazily loaded",
						description:
							"Above-the-fold images that are lazily loaded render later in the page lifecycle, which can delay the largest contentful paint. [Learn more about optimal lazy loading](https://web.dev/articles/lcp-lazy-loading).",
						categories: ["Performance", "LCP"],
						rect: {
							top: 498,
							bottom: 805,
							left: 635,
							right: 1379,
							width: 744,
							height: 306,
						},
						detailSelector: "li.post > div.content > p > img",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(5) > *:nth-child(3)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1190,
							bottom: 1279,
							left: 671,
							right: 1379,
							width: 708,
							height: 89,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(5) > *:nth-child(1)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1015,
							bottom: 1104,
							left: 671,
							right: 1379,
							width: 708,
							height: 89,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(9)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1628,
							bottom: 1688,
							left: 635,
							right: 1379,
							width: 744,
							height: 59,
						},
						detailSelector: "ul.posts > li.post > div.content > p",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(3) > *:nth-child(2)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 834,
							bottom: 886,
							left: 635,
							right: 1359,
							width: 724,
							height: 52,
						},
						detailSelector: "li.post > div.content > p > a",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(3)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 831,
							bottom: 920,
							left: 635,
							right: 1379,
							width: 744,
							height: 89,
						},
						detailSelector: "ul.posts > li.post > div.content > p",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(10) > *:nth-child(1)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1706,
							bottom: 1765,
							left: 671,
							right: 1379,
							width: 708,
							height: 59,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(5) > *:nth-child(2)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1117,
							bottom: 1177,
							left: 671,
							right: 1379,
							width: 708,
							height: 59,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
		},
		metaErrors: [
			{
				score: 0,
				scoreDisplayMode: "numeric",
				title: "Document doesn't have a `<title>` element",
				description:
					"The title gives screen reader users an overview of the page, and search engine users rely on it heavily to determine if a page is relevant to their search. [Learn more about document titles](https://dequeuniversity.com/rules/axe/4.8/document-title).",
				categories: ["Accessibility", "SEO"],
				rect: {
					top: 0,
					bottom: 5787,
					left: 0,
					right: 1754,
					width: 1754,
					height: 5787,
				},
				detailSelector: "html",
			},
		],
		consoleErrors: [
			{
				message:
					"Failed to load resource: the server responded with a status of 404 (Not Found)",
				level: "error",
				content: "http://localhost:4321/favicon.ico",
			},
		],
		scoreList: {
			Performance: 0.76,
			Accessibility: 0.87,
			"Best Practices": 0.96,
			SEO: 0.82,
			PWA: 0.29,
		},
		categoryCount: {
			Performance: 9,
			Accessibility: 4,
			"Best Practices": 0,
			SEO: 0,
			PWA: 0,
		},
		pwaErrors: [
			{
				message:
					"Web app manifest or service worker do not meet the installability requirements",
				level: "error",
				content:
					"Service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. With proper service worker and manifest implementations, browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more about manifest installability requirements](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/).",
			},
			{
				message: "Is not configured for a custom splash screen",
				level: "error",
				content:
					"A themed splash screen ensures a high-quality experience when users launch your app from their homescreens. [Learn more about splash screens](https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/).",
			},
			{
				message: "Does not set a theme color for the address bar.",
				level: "error",
				content:
					"The browser address bar can be themed to match your site. [Learn more about theming the address bar](https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/).",
			},
			{
				message: "Manifest doesn't have a maskable icon",
				level: "error",
				content:
					"A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device. [Learn about maskable manifest icons](https://developer.chrome.com/docs/lighthouse/pwa/maskable-icon-audit/).",
			},
		],
	},
	mobile: {
		elements: {
			"html > body > *:nth-child(4) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 6339,
						bottom: 6366,
						left: 16,
						right: 69,
						width: 53,
						height: 26,
					},
					detailSelector: "body > footer > p",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 6342,
						bottom: 6362,
						left: 204,
						right: 259,
						width: 55,
						height: 20,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(3)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 6342,
						bottom: 6362,
						left: 307,
						right: 359,
						width: 52,
						height: 20,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1)":
				[
					{
						score: 0,
						scoreDisplayMode: "numeric",
						title:
							"Background and foreground colors do not have a sufficient contrast ratio.",
						description:
							"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
						categories: ["Accessibility"],
						rect: {
							top: 256,
							bottom: 280,
							left: 16,
							right: 69,
							width: 53,
							height: 24,
						},
						detailSelector:
							"div.version_wrapper > div.version_info > a > div.version_number",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(1)": [
				{
					score: null,
					scoreDisplayMode: "informative",
					title: "Largest Contentful Paint element",
					description:
						"This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
					categories: ["Performance", "LCP"],
					rect: {
						top: 122,
						bottom: 181,
						left: 16,
						right: 359,
						width: 343,
						height: 59,
					},
					detailSelector: "body > main > h1.page_title",
				},
			],
		},
		metaErrors: [
			{
				score: 0,
				scoreDisplayMode: "numeric",
				title: "Document doesn't have a `<title>` element",
				description:
					"The title gives screen reader users an overview of the page, and search engine users rely on it heavily to determine if a page is relevant to their search. [Learn more about document titles](https://dequeuniversity.com/rules/axe/4.8/document-title).",
				categories: ["Accessibility", "SEO"],
				rect: {
					top: 0,
					bottom: 6398,
					left: 0,
					right: 375,
					width: 375,
					height: 6398,
				},
				detailSelector: "html",
			},
		],
		consoleErrors: [
			{
				message:
					"Failed to load resource: the server responded with a status of 404 (Not Found)",
				level: "error",
				content: "http://localhost:4321/favicon.ico",
			},
		],
		scoreList: {
			Performance: 1,
			Accessibility: 0.87,
			"Best Practices": 0.96,
			SEO: 0.85,
			PWA: 0.38,
		},
		categoryCount: {
			Performance: 1,
			Accessibility: 4,
			"Best Practices": 0,
			SEO: 0,
			PWA: 0,
		},
		pwaErrors: [
			{
				message:
					"Web app manifest or service worker do not meet the installability requirements",
				level: "error",
				content:
					"Service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. With proper service worker and manifest implementations, browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more about manifest installability requirements](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/).",
			},
			{
				message: "Is not configured for a custom splash screen",
				level: "error",
				content:
					"A themed splash screen ensures a high-quality experience when users launch your app from their homescreens. [Learn more about splash screens](https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/).",
			},
			{
				message: "Does not set a theme color for the address bar.",
				level: "error",
				content:
					"The browser address bar can be themed to match your site. [Learn more about theming the address bar](https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/).",
			},
			{
				message: "Manifest doesn't have a maskable icon",
				level: "error",
				content:
					"A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device. [Learn about maskable manifest icons](https://developer.chrome.com/docs/lighthouse/pwa/maskable-icon-audit/).",
			},
		],
	},
	cache: true,
};

export const lhResultWithPWA: CacheLHResultByFormFactor = {
	desktop: {
		elements: {
			"html > body > *:nth-child(4) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 5703,
						bottom: 5733,
						left: 375,
						right: 435,
						width: 60,
						height: 30,
					},
					detailSelector: "body > footer > p",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 5707,
						bottom: 5729,
						left: 1205,
						right: 1266,
						width: 62,
						height: 22,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(3)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 5707,
						bottom: 5729,
						left: 1321,
						right: 1379,
						width: 58,
						height: 22,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1)":
				[
					{
						score: 0,
						scoreDisplayMode: "numeric",
						title:
							"Background and foreground colors do not have a sufficient contrast ratio.",
						description:
							"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
						categories: ["Accessibility"],
						rect: {
							top: 435,
							bottom: 461,
							left: 375,
							right: 431,
							width: 56,
							height: 26,
						},
						detailSelector:
							"div.version_wrapper > div.version_info > a > div.version_number",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(2) > *:nth-child(1)":
				[
					{
						score: 1850,
						scoreDisplayMode: "metricSavings",
						title: "Largest Contentful Paint element",
						description:
							"This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
						categories: ["Performance", "LCP"],
						rect: {
							top: 498,
							bottom: 805,
							left: 635,
							right: 1379,
							width: 744,
							height: 306,
						},
						detailSelector: "li.post > div.content > p > img",
					},
					{
						score: 450,
						scoreDisplayMode: "metricSavings",
						title: "Largest Contentful Paint image was lazily loaded",
						description:
							"Above-the-fold images that are lazily loaded render later in the page lifecycle, which can delay the largest contentful paint. [Learn more about optimal lazy loading](https://web.dev/articles/lcp-lazy-loading).",
						categories: ["Performance", "LCP"],
						rect: {
							top: 498,
							bottom: 805,
							left: 635,
							right: 1379,
							width: 744,
							height: 306,
						},
						detailSelector: "li.post > div.content > p > img",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(5) > *:nth-child(3)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1190,
							bottom: 1279,
							left: 671,
							right: 1379,
							width: 708,
							height: 89,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(5) > *:nth-child(1)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1015,
							bottom: 1104,
							left: 671,
							right: 1379,
							width: 708,
							height: 89,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(9)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1628,
							bottom: 1688,
							left: 635,
							right: 1379,
							width: 744,
							height: 59,
						},
						detailSelector: "ul.posts > li.post > div.content > p",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(3) > *:nth-child(2)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 834,
							bottom: 886,
							left: 635,
							right: 1359,
							width: 724,
							height: 52,
						},
						detailSelector: "li.post > div.content > p > a",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(3)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 831,
							bottom: 920,
							left: 635,
							right: 1379,
							width: 744,
							height: 89,
						},
						detailSelector: "ul.posts > li.post > div.content > p",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(10) > *:nth-child(1)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1706,
							bottom: 1765,
							left: 671,
							right: 1379,
							width: 708,
							height: 59,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(2) > *:nth-child(5) > *:nth-child(2)":
				[
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Avoid large layout shifts",
						description:
							"These DOM elements were most affected by layout shifts. Some layout shifts may not be included in the CLS metric value due to [windowing](https://web.dev/articles/cls#what_is_cls). [Learn how to improve CLS](https://web.dev/articles/optimize-cls)",
						categories: ["Performance", "CLS"],
						rect: {
							top: 1117,
							bottom: 1177,
							left: 671,
							right: 1379,
							width: 708,
							height: 59,
						},
						detailSelector: "li.post > div.content > ul > li",
					},
				],
		},
		metaErrors: [
			{
				score: 0,
				scoreDisplayMode: "numeric",
				title: "Document doesn't have a `<title>` element",
				description:
					"The title gives screen reader users an overview of the page, and search engine users rely on it heavily to determine if a page is relevant to their search. [Learn more about document titles](https://dequeuniversity.com/rules/axe/4.8/document-title).",
				categories: ["Accessibility", "SEO"],
				rect: {
					top: 0,
					bottom: 5787,
					left: 0,
					right: 1754,
					width: 1754,
					height: 5787,
				},
				detailSelector: "html",
			},
		],
		consoleErrors: [
			{
				message:
					"Failed to load resource: the server responded with a status of 404 (Not Found)",
				level: "error",
				content: "http://localhost:4321/favicon.ico",
			},
		],
		scoreList: {
			Performance: 0.76,
			Accessibility: 0.87,
			"Best Practices": 0.96,
			SEO: 0.82,
			PWA: 0.29,
		},
		categoryCount: {
			Performance: 9,
			Accessibility: 4,
			"Best Practices": 0,
			SEO: 0,
			PWA: 0,
		},
		pwaErrors: [
			{
				message:
					"Web app manifest or service worker do not meet the installability requirements",
				level: "error",
				content:
					"Service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. With proper service worker and manifest implementations, browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more about manifest installability requirements](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/).",
			},
			{
				message: "Is not configured for a custom splash screen",
				level: "error",
				content:
					"A themed splash screen ensures a high-quality experience when users launch your app from their homescreens. [Learn more about splash screens](https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/).",
			},
			{
				message: "Does not set a theme color for the address bar.",
				level: "error",
				content:
					"The browser address bar can be themed to match your site. [Learn more about theming the address bar](https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/).",
			},
			{
				message: "Manifest doesn't have a maskable icon",
				level: "error",
				content:
					"A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device. [Learn about maskable manifest icons](https://developer.chrome.com/docs/lighthouse/pwa/maskable-icon-audit/).",
			},
		],
	},
	mobile: {
		elements: {
			"html > body > *:nth-child(4) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 6339,
						bottom: 6366,
						left: 16,
						right: 69,
						width: 53,
						height: 26,
					},
					detailSelector: "body > footer > p",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(1)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 6342,
						bottom: 6362,
						left: 204,
						right: 259,
						width: 55,
						height: 20,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(4) > *:nth-child(2) > *:nth-child(3)": [
				{
					score: 0,
					scoreDisplayMode: "numeric",
					title:
						"Background and foreground colors do not have a sufficient contrast ratio.",
					description:
						"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
					categories: ["Accessibility"],
					rect: {
						top: 6342,
						bottom: 6362,
						left: 307,
						right: 359,
						width: 52,
						height: 20,
					},
					detailSelector: "body > footer > div.footer_links > a",
				},
			],
			"html > body > *:nth-child(3) > *:nth-child(3) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1) > *:nth-child(1)":
				[
					{
						score: 0,
						scoreDisplayMode: "numeric",
						title:
							"Background and foreground colors do not have a sufficient contrast ratio.",
						description:
							"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
						categories: ["Accessibility"],
						rect: {
							top: 256,
							bottom: 280,
							left: 16,
							right: 69,
							width: 53,
							height: 24,
						},
						detailSelector:
							"div.version_wrapper > div.version_info > a > div.version_number",
					},
				],
			"html > body > *:nth-child(3) > *:nth-child(1)": [
				{
					score: null,
					scoreDisplayMode: "informative",
					title: "Largest Contentful Paint element",
					description:
						"This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
					categories: ["Performance", "LCP"],
					rect: {
						top: 122,
						bottom: 181,
						left: 16,
						right: 359,
						width: 343,
						height: 59,
					},
					detailSelector: "body > main > h1.page_title",
				},
			],
		},
		metaErrors: [
			{
				score: 0,
				scoreDisplayMode: "numeric",
				title: "Document doesn't have a `<title>` element",
				description:
					"The title gives screen reader users an overview of the page, and search engine users rely on it heavily to determine if a page is relevant to their search. [Learn more about document titles](https://dequeuniversity.com/rules/axe/4.8/document-title).",
				categories: ["Accessibility", "SEO"],
				rect: {
					top: 0,
					bottom: 6398,
					left: 0,
					right: 375,
					width: 375,
					height: 6398,
				},
				detailSelector: "html",
			},
		],
		consoleErrors: [
			{
				message:
					"Failed to load resource: the server responded with a status of 404 (Not Found)",
				level: "error",
				content: "http://localhost:4321/favicon.ico",
			},
		],
		scoreList: {
			Performance: 1,
			Accessibility: 0.87,
			"Best Practices": 0.96,
			SEO: 0.85,
			PWA: 0.38,
		},
		categoryCount: {
			Performance: 1,
			Accessibility: 4,
			"Best Practices": 0,
			SEO: 0,
			PWA: 0,
		},
		pwaErrors: [
			{
				message:
					"Web app manifest or service worker do not meet the installability requirements",
				level: "error",
				content:
					"Service worker is the technology that enables your app to use many Progressive Web App features, such as offline, add to homescreen, and push notifications. With proper service worker and manifest implementations, browsers can proactively prompt users to add your app to their homescreen, which can lead to higher engagement. [Learn more about manifest installability requirements](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/).",
			},
			{
				message: "Is not configured for a custom splash screen",
				level: "error",
				content:
					"A themed splash screen ensures a high-quality experience when users launch your app from their homescreens. [Learn more about splash screens](https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/).",
			},
			{
				message: "Does not set a theme color for the address bar.",
				level: "error",
				content:
					"The browser address bar can be themed to match your site. [Learn more about theming the address bar](https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/).",
			},
			{
				message: "Manifest doesn't have a maskable icon",
				level: "error",
				content:
					"A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device. [Learn about maskable manifest icons](https://developer.chrome.com/docs/lighthouse/pwa/maskable-icon-audit/).",
			},
		],
	},
	cache: true,
};

export const highlightObj = {
	hideArguments: {
		selector: "html > body > *:nth-child(2) > *:nth-child(1)",
		detailSelector: "body > main > h1",
	},
	rect: {
		top: 138,
		bottom: 211,
		left: 353,
		right: 1073,
		width: 720,
		height: 73,
	},
	filter: {
		categories: {
			Accessibility: false,
			"Best Practices": false,
			Performance: false,
			SEO: false,
		},
		hideList: [],
	},
	render: {
		canvas: {},
		lhResult: {
			elements: {
				"html > body > *:nth-child(2) > *:nth-child(1)": [
					{
						score: 0,
						scoreDisplayMode: "numeric",
						title:
							"Background and foreground colors have a sufficient contrast ratio",
						description:
							"Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.8/color-contrast).",
						categories: ["Accessibility"],
						rect: {
							top: 138,
							bottom: 211,
							left: 353,
							right: 1073,
							width: 720,
							height: 73,
						},
						detailSelector: "body > main > h1",
					},
				],
				"html > body > *:nth-child(2) > *:nth-child(3)": [
					{
						score: null,
						scoreDisplayMode: "informative",
						title: "Largest Contentful Paint element",
						description:
							"This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
						categories: ["LCP", "Performance"],
						rect: {
							top: 353,
							bottom: 457,
							left: 353,
							right: 1073,
							width: 720,
							height: 104,
						},
						detailSelector: "body > main > p",
					},
				],
			},
			metaErrors: [],
			consoleErrors: [],
		},
	},
	categories: ["Accessibility"],
};
