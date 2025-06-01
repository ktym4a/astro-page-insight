import { defineConfig } from "tsup";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: ["src/**/*.(ts|js)"],
		format: ["esm"],
		target: "es2020",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [],
		tsconfig: "tsconfig.json",
	};
});
