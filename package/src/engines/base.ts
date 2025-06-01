import type {
	AuditType,
	CategoryCountType,
	ScoreListType,
} from "../types/index.js";

export interface TestingEngineOptions {
	url: string;
	width: number;
	height: number;
	breakPoint: number;
	weight: number;
}

export interface TestingEngineResult {
	elements: {
		[selector: string]: Array<AuditType>;
	};
	metaErrors: Array<AuditType>;
	consoleErrors: Array<{
		message: string;
		level: string;
		content?: string;
	}>;
	scoreList: ScoreListType;
	categoryCount: CategoryCountType;
}

export interface TestingEngineRunResult {
	result: TestingEngineResult;
	formFactor: "mobile" | "desktop";
	rawResult?: unknown; // Optional raw result for caching
}

export abstract class TestingEngine {
	abstract readonly name: string;
	abstract readonly categories: string[];

	/**
	 * Run the testing engine with given options
	 */
	abstract run(options: TestingEngineOptions): Promise<TestingEngineRunResult>;

	/**
	 * Organize raw engine results into common format
	 */
	abstract organizeResult(
		rawResult: unknown,
		weight: number,
	): Omit<TestingEngineResult, "url" | "formFactor">;

	/**
	 * Generate file name for caching results
	 */
	abstract generateFileName(url: string): string;

	/**
	 * Serialize result for caching
	 */
	serializeResult(rawResult: unknown): string {
		return JSON.stringify(rawResult);
	}

	/**
	 * Deserialize cached result
	 */
	deserializeResult(serialized: string): unknown {
		return JSON.parse(serialized);
	}
}
