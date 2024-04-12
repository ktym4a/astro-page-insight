/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["tests/**/*", "coverage/**/*", "coverage-unit/**/*"],
			reportsDirectory: "coverage-unit",
		},
		include: ["tests/**/*.test.ts"],
	},
});
