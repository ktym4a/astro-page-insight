import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [
		astroPageInsight({
			lh: {
				// pwa: true,
			},
			// firstFetch: "open",
			experimentalCache: true,
			bundle: true,
		}),
	],
});
