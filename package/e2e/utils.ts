import { fileURLToPath } from "node:url";
import { test as base } from "@playwright/test";
import * as Astro from "astro";

export function testFactory(name: string) {
	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let devServer;

	const test = base.extend({
		// biome-ignore lint/correctness/noEmptyPattern: <explanation>
		async dev({}, use) {
			const root = fileURLToPath(
				new URL(`./fixtures/${name}/`, import.meta.url),
			);

			devServer ??= await Astro.dev({
				root,
				logLevel: "silent",
				vite: {
					logLevel: "silent",
				},
			});
			await use(devServer);
		},
	});
	return test;
}

export const buttonListForDev: [string, string][] = [
	["indicator", "Here is current checked device."],
	["console-alert", "Show non-element errors."],
	["hide", "Show the hidden highlights."],
	["score", "Show the score of each category."],
	["filter", "Filter the result."],
	["fetch", "Fetch Lighthouse report."],
];
