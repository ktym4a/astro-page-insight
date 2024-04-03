---
"astro-page-insight": minor
---

Add `build.bundle` and `build.showOnLoad` options.

This option allows you to specify whether to bundle the page insight and show the page insight on page load.

If you set `build.bundle` to `true`, **It will bundle results from local cache, So you need to have `lighthouse results(cache)` on build time.**

```diff
type PageInsightOptions = {
    lh?: {
        weight?: number;
        breakPoint?: number;
        pwa?: boolean;
    };
    firstFetch?: "load" | "open" | "none";
    experimentalCache?: boolean;
+   build? : {
+       bundle?: boolean;
+       showOnLoad?: boolean;
+   };
};
```

- `bundle` is used to determine whether to bundle the page insight.
- `showOnLoad` is used to determine whether to show the page insight on page load.
