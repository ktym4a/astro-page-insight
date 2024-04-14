import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [
		astroPageInsight({
			lh: {
				pwa: true,
			},
			// firstFetch: "open",
			cache: true,
			build: {
				bundle: true,
				showOnLoad: true,
			},
		}),
	],
	build: {
		assets: "test",
	},
});
