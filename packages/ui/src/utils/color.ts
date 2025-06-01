import type { COLORS } from "../constants/index.js";
import type { AuditType } from "../types/index.js";

export const getColorKey = (
	score: AuditType["score"] | undefined,
): keyof typeof COLORS => {
	if (score === null || score === undefined) {
		return "red";
	}
	if (score >= 0.9) {
		return "green";
	}
	if (score >= 0.5) {
		return "yellow";
	}
	return "red";
};
