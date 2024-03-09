---
"astro-page-insight": minor
---

Add experimentalCache option.

This option allows you to enable the experimental cache.

if `experimentalCache` is `true`, will enable to cache the lighthouse report.

```diff
type PageInsightOptions = {
	lh?: {
		weight?: number;
		breakPoint?: number;
	};
+	experimentalCache?: boolean;
};
```
