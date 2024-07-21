# astro-page-insight

## 0.8.5

### Patch Changes

- 7222f83: [internal] update packages

## 0.8.4

### Patch Changes

- 06bc17a: [internal] update dependencies
- 3fbdaf7: [internal] dedupe
- 9944c8e: Fixed a bug that could be undefined

## 0.8.3

### Patch Changes

- b291b72: [internal] update dependencies.

## 0.8.2

### Patch Changes

- a1fb09f: [Internal] update packages

## 0.8.1

### Patch Changes

- d5503c5: Fix a bug in resizing after build

## 0.8.0

### Minor Changes

- 0f78c5b: Update dev toolbar api.

  Astro 4.7.1 or later is required.

## 0.7.0

### Minor Changes

- 4bcf3d0: Remove `pwa` option since `pwa` audits [have been removed from lighthouse](https://github.com/GoogleChrome/lighthouse/pull/15455).

## 0.6.4

### Patch Changes

- f19e79d: [Internal] Add buildstep
- e6ed7fc: [Internal] update packages
- 6535e36: [internal] add Unit tests
- 8643c8d: [Internal] add e2e tests

## 0.6.3

### Patch Changes

- fe636ee: fix type bug

## 0.6.2

### Patch Changes

- 96fa081: internal: update deps
- 3e2d0eb: internal: fix type

## 0.6.1

### Patch Changes

- e28ec19: Reduce cache size by skip unused `screenshot-thumbnails` and `final-screenshot` audits.
- 31d88c6: internal: update packages

## 0.6.0

### Minor Changes

- 2e7dd4f: Add `build.bundle` and `build.showOnLoad` options.

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

### Patch Changes

- cf6acfd: [internal] refactor code
- b8f8090: Remove `chrome-launcher` and change to use `puppeteer`.

  Now it works even if chrome is not installed.

- 643f042: Update the page insight options. The `experimentalCache` option is now deprecated.

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

## 0.5.4

### Patch Changes

- 187c785: [internal] update versions
- cb832b3: Fix the bug that when you use `ViewTransition`, and `Responsive Mode` is enabled, Throw an error when you switch between pages.

## 0.5.3

### Patch Changes

- c7f85c1: update packages
- 16d433c: [internal] update type

## 0.5.2

### Patch Changes

- 6d1fbbf: Fixed a bug that caused an error when no options were available

## 0.5.1

### Patch Changes

- 4b3d86a: Update Dependencies

## 0.5.0

### Minor Changes

- 8840bea: ## Change Cache File name rules to be more consistent with the URL path.

  **This is a breaking change that your previous cache files will be invalid after this change. You need to clear the cache files and re-generate them after this change.**

  `""`and `"/"` to `index.json`, `"/about/"`and `"/about"` to `about.json`, `"/what/about"` and `"/what/about/"` to `what-about.json`,
  `"/?query=string"` to `index-query=string.json`, `"/?query=string/"` to `index-query=string.json`,
  `"/about?query=string"` to `about-query=string.json`, `"/about/?query=string"` to `about-query=string.json`

### Patch Changes

- 74e3e25: Fix a bug that even when pwa was `false`, pwa score was displayed if there was a pwa score in the cache.
- 8aa0d54: Remove unused style

## 0.4.1

### Patch Changes

- cc8986e: Add dev mode disclaimer to score toolbar title.

## 0.4.0

### Minor Changes

- d511cda: Add app notification to improve understanding of current status. (Astro 4.5 or later)

  So You can see that the notification is displayed in the app.

  There are three types of notifications:

  | Color    | Description                                                                                                                 |
  | -------- | --------------------------------------------------------------------------------------------------------------------------- |
  | `Blue`   | `blue` means that results are fresh.                                                                                        |
  | `Yellow` | `yellow` has two meanings.<br />One is that the results are from the cache.<br />The other is that fetching is in progress. |
  | `Red`    | `red` means that fetching failed.                                                                                           |

## 0.3.2

### Patch Changes

- 527b250: Change `server.hot.send` to `client.send`.
- 641871d: Fix Tree Shaking

## 0.3.1

### Patch Changes

- 934f6ca: Fix bug that sometimes node obj doesn't have path.

## 0.3.0

### Minor Changes

- 0954c53: Add `lh.pwa` option.

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

## 0.2.1

### Patch Changes

- 5ec3cc2: update README

## 0.2.0

### Minor Changes

- 32a2b3e: Add firstFetch option.

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

- 32a2b3e: Add experimentalCache option.

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

- 32a2b3e: Move to options for lh

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

## 0.1.1

### Patch Changes

- 129cbcc: Fix a bug that prevented Toast from displaying correctly.

## 0.1.0

### Minor Changes

- 557a496: Improve show of desktop or mobile results
- c91061a: Add the ability to toggle the display of highlights.
- 0066aad: Add filter functionality for results
- de190aa: Move Non-elements tooltip position to toolbar
- c0e2bf8: Add the ability to see the result score of the light house

### Patch Changes

- f5d93ee: Improve Toast component
- e1092e9: Improve UI

## 0.0.18

### Patch Changes

- 3522e1a: Add tooltip and improvee UI.
- 3522e1a: change zIndex for correct position.

## 0.0.17

### Patch Changes

- db0af1e: Improve UI

## 0.0.16

### Patch Changes

- 168b971: update README

## 0.0.15

### Patch Changes

- 23e32ec: update packages
- c590f79: Makes options handling runtime safe

## 0.0.14

### Patch Changes

- 1bc000b: add Prerequisites section

## 0.0.13

### Patch Changes

- 5cff24d: change README

## 0.0.12

### Patch Changes

- 1b66478: update README

## 0.0.11

### Patch Changes

- 53ac3d0: change description.

## 0.0.10

### Patch Changes

- cb478d7: Fixes types (hopefully) and improves package structure

## 0.0.9

### Patch Changes

- 102c37b: Refactor Astro PageInsightToolbar to use regular expressions for link and line break replacements
- 7e3f912: add repository and change homepage url

## 0.0.8

### Patch Changes

- 8b974df: add keywords to package.json

## 0.0.7

### Patch Changes

- 3933a40: Fix types for options.

## 0.0.6

### Patch Changes

- f9a8e91: add types for options.

## 0.0.5

### Patch Changes

- a2be3e3: Change Icon.

## 0.0.4

### Patch Changes

- 9b02ee5: Change vite call `hot` to `ws`.

## 0.0.3

### Patch Changes

- 100c583: Change dependencies.

## 0.0.2

### Patch Changes

- ab12a1d: Release `astro-page-insight`.
