/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["tests/**/*", "coverage/**/*", "dist/**/*"],
			reportsDirectory: "coverage",
		},
		include: ["tests/**/*.test.ts"],
		environment: "happy-dom",
	},
});
