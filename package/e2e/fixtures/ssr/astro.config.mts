import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	server: {
		port: 4324,
	},
	output: "server",
	integrations: [
		astroPageInsight({
			lh: {
				breakPoint: 375,
				pwa: true,
			},
			cache: true,
			build: {
				bundle: true,
				showOnLoad: true,
			},
		}),
	],
	adapter: node({
		mode: "standalone",
	}),
});
