import { describe, expect, it } from "vitest";
import { getColorKey } from "../src/utils/color.ts";

describe("color", () => {
	it("should return the correct color key", () => {
		expect(getColorKey(0.9)).toBe("green");
		expect(getColorKey(0.5)).toBe("yellow");
		expect(getColorKey(0.4)).toBe("red");
		expect(getColorKey(undefined)).toBe("red");
		expect(getColorKey(null)).toBe("red");
	});
});
