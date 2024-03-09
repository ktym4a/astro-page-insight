---
"astro-page-insight": minor
---

Add firstFetch option.

This option allows you to specify when to do the first fetch.

```diff
type PageInsightOptions = {
	lh?: {
		weight?: number;
		breakPoint?: number;
	};
+	firstFetch?: "load" | "open" | "none";
};
```
