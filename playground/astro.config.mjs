import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";
import astroPageInsight from "astro-page-insight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		astroPageInsight({
			lh: {
				pwa: true,
			},
			// firstFetch: "open",
			experimentalCache: true,
		}),
		AstroPWA({
			mode: "development",
			base: "/",
			scope: "/",
			includeAssets: ["favicon.svg"],
			registerType: "autoUpdate",
			manifest: {
				name: "Astro PWA",
				short_name: "Astro PWA",
				theme_color: "#ffffff",
			},
			pwaAssets: {
				config: true,
			},
			workbox: {
				navigateFallback: "/",
				globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
			},
			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: [/^\//],
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
		}),
	],
});
