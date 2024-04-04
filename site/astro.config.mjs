import tailwind from "@astrojs/tailwind";
import pageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		pageInsight({
			lh: {
				// pwa: true,
			},
			experimentalCache: true,
		}),
	],
	site: "https://ktym4a.me/",
	base: "/",
	trailingSlash: "always",
	markdown: {
		shikiConfig: {
			theme: "catppuccin-latte",
			themes: {
				light: "catppuccin-latte",
				dark: "catppuccin-mocha",
			},
		},
	},
	experimental: {
		directRenderScript: true,
	},
});
