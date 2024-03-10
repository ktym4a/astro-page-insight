# astro-page-insight

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
