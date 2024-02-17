import type { COLORS } from "../constants";
import type { AuditType } from "../types";

export const getColorKey = (score: AuditType["score"]): keyof typeof COLORS => {
	if (score === null) {
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
