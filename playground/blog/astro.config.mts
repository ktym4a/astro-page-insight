import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [
		mdx(),
		sitemap(),
		astroPageInsight({
			lh: {
				// breakPoint: 7,
			},
			// firstFetch: "open",
			cache: true,
			build: {
				bundle: false,
				// showOnLoad: true
			},
		}),
		// astroPageInsight()
	],
});
