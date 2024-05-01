import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	server: {
		port: 4322,
	},
	integrations: [
		astroPageInsight({
			lh: {
				breakPoint: 375,
				pwa: true,
			},
			cache: true,
			build: {
				bundle: true,
			},
		}),
	],
});
