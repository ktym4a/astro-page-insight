// Client-side engine registry - no Node.js dependencies
import type { RunnerResult } from "lighthouse";
import type { LHResult } from "../types/index.js";
import { organizeLighthouseResult } from "./lighthouse/utils.js";

export interface ClientEngine {
	readonly name: string;
	generateFileName(url: string): string;
	deserializeResult(serializedData: string): unknown;
	organizeResult(rawResult: unknown, weight: number): Omit<LHResult, "url" | "formFactor">;
}

class LighthouseClientEngine implements ClientEngine {
	readonly name = "lighthouse";

	generateFileName(url: string): string {
		const urlObj = new URL(url);

		let fileName: string;
		if (urlObj.pathname === "/") {
			fileName = "index";
		} else {
			fileName = urlObj.pathname.replace(/\//g, "-").replace(/^-|-$/g, "");
		}

		if (urlObj.search) {
			fileName += urlObj.search.replace(/\//g, "").replace(/\?/g, "-");
		}

		return `${decodeURI(fileName)}.json`;
	}

	deserializeResult(serializedData: string): unknown {
		return JSON.parse(serializedData);
	}

	organizeResult(rawResult: unknown, weight: number): Omit<LHResult, "url" | "formFactor"> {
		return organizeLighthouseResult(rawResult as RunnerResult, weight);
	}
}

export class ClientEngineRegistry {
	protected engines = new Map<string, ClientEngine>();

	constructor() {
		// Register default engines
		this.register(new LighthouseClientEngine());
	}

	register(engine: ClientEngine): void {
		this.engines.set(engine.name, engine);
	}

	get(name: string): ClientEngine | undefined {
		return this.engines.get(name);
	}
}

// Default registry instance for client-side use
export const clientEngineRegistry = new ClientEngineRegistry();
