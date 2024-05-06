import starlight from "@astrojs/starlight";
import latte from "@catppuccin/vscode/themes/latte.json";
import mocha from "@catppuccin/vscode/themes/mocha.json";
import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://astro-page-insight.pages.dev/",
	integrations: [
		starlight({
			title: "Astro Page Insight",
			logo: {
				src: "/src/assets/logo.png",
				alt: "Astro Page Insight",
			},
			description:
				"Shows everything to improve from Lighthouse results directly on the page.",
			social: {
				github: "https://github.com/ktym4a/astro-page-insight",
			},
			sidebar: [
				{
					label: "Getting Started",
					link: "/getting-started/",
				},
				{
					label: "Guides",
					items: [
						{
							label: "Buttons",
							link: "/guides/buttons/",
						},
						{
							label: "Notifications",
							link: "/guides/notifications/",
						},
						{
							label: "Configuration Options",
							link: "/guides/configuration-options/",
						},
					],
				},
				{
					label: "Others",
					items: [
						{
							label: "Demo",
							link: "/others/demo/",
						},
					],
				},
			],
			expressiveCode: {
				themes: [mocha, latte],
			},
			favicon: "/favicon.png",
		}),
		astroPageInsight({
			lh: {
				breakPoint: 799,
			},
			cache: true,
			build: {
				bundle: true,
				showOnLoad: true,
			},
		}),
	],
});
