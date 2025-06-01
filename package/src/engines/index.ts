import type { TestingEngine } from "./base.js";
import { LighthouseEngine } from "./lighthouse/index.js";

export class EngineRegistry {
	protected engines = new Map<string, TestingEngine>();

	constructor() {
		// Register default engines
		this.register(new LighthouseEngine());
	}

	register(engine: TestingEngine): void {
		this.engines.set(engine.name, engine);
	}

	get(name: string): TestingEngine | undefined {
		return this.engines.get(name);
	}

	getAll(): TestingEngine[] {
		return Array.from(this.engines.values());
	}

	getNames(): string[] {
		return Array.from(this.engines.keys());
	}
}

// Default registry instance
export const engineRegistry = new EngineRegistry();

// Export types and base classes
export { TestingEngine } from "./base.js";
export type {
	TestingEngineOptions,
	TestingEngineResult,
	TestingEngineRunResult,
} from "./base.js";

// Export specific engines
export { LighthouseEngine } from "./lighthouse/index.js";
