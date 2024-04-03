---
"astro-page-insight": patch
---

Update the page insight options. The `experimentalCache` option is now deprecated.

```diff
type PageInsightOptions = {
    lh?: {
        weight?: number;
        breakPoint?: number;
        pwa?: boolean;
    };
    firstFetch?: "load" | "open" | "none";
-   experimentalCache?: boolean;
+   cache?: boolean;
    build?: {
        bundle?: boolean;
        showOnLoad?: boolean;
    };
};
```
