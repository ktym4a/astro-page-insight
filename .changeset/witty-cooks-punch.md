---
"astro-page-insight": minor
---

Move to options for lh

This is a **breaking change**.

```diff
import pageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
    pageInsight({
+     lh: {
       breakpoint: 768,
       weight: 0.5,
+     },
    }),
  ],
});
```
