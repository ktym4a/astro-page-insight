/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: ["class", ".ctp-mocha"],
	theme: {
		extend: {
			fontFamily: {
				mono: [
					`'ml', ${defaultTheme.fontFamily.mono}, Arial,Hiragino Kaku Gothic ProN,Hiragino Sans,Meiryo, sans-serif`,
					{
						fontFeatureSettings:
							'"frac" 0, "liga" 1, "calt" 1, "ss01" 1, "ss07" 1, "ss11" 1, "ss17" 1',
					},
				],
				"mono-script": [
					`'ml', ${defaultTheme.fontFamily.mono}, Arial,Hiragino Kaku Gothic ProN,Hiragino Sans,Meiryo, sans-serif`,
					{
						fontFeatureSettings:
							'"ss02" 1, "frac" 0, "liga" 1, "calt" 1, "ss01" 1, "ss07" 1, "ss11" 1, "ss17" 1',
					},
				],
			},
			gradientColorStopPositions: {
				33: "33.33%",
				66: "66.66%",
			},
			gridAutoColumns: {
				full: "100%",
			},
			saturate: {
				350: "3.5",
			},
			spacing: {
				18: "4.5rem",
				96: "20rem",
				104: "24rem",
			},
			transitionProperty: {
				filter: "filter",
			},
			translate: {
				3.25: "0.85rem",
			},
		},
	},
	plugins: [
		require("@catppuccin/tailwindcss")({
			prefix: "ctp",
		}),
	],
};
