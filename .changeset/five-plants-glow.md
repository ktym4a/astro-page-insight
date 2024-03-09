---
"astro-page-insight": minor
---

Add `lh.pwa` option.

This option allows you to specify whether to enable the PWA audit.

```diff
type PageInsightOptions = {
	lh?: {
		weight?: number;
		breakPoint?: number;
+		pwa?: boolean;
	};
};
```
