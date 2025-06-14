# `astro-page-insight`

![](https://raw.githubusercontent.com/ktym4a/astro-page-insight/main/.github/about.png)

[docs](https://astro-page-insight.pages.dev/) | [demo](https://astro-page-insight.pages.dev/others/demo/)

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that shows everything to improve from Lighthouse results directly on the page.

> [!IMPORTANT]
> This result is by dev mode, so it may not be accurate.  
> Especially, the Score is not accurate.

## Usage

### Prerequisites

Astro 4.0 or later is required.


### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-page-insight
```

```bash
npx astro add astro-page-insight
```

```bash
yarn astro add astro-page-insight
```

Or install it **manually**:  
1. Install the required dependencies

```bash
pnpm add astro-page-insight
```

```bash
npm install astro-page-insight
```

```bash
yarn add astro-page-insight
```

2. Add the integration to your astro config

```diff
+import pageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
+    pageInsight(),
  ],
});
```

### Configuration

Here is the options:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `lh.weight` | `number` | `0` | `weight` is the threshold value in the audit. |
| `lh.breakPoint` | `number` | `767` | `breakPoint` is used to determine whether on mobile or desktop. |
| `firstFetch` | `load`, `open`, `none` | `none` | `firstFetch` is used for when to do the first fetch.<br />if `firstFetch` is `load`, will fetch on page load.<br />if `firstFetch` is `open`, will fetch on first app open.<br />if `firstFetch` is `none`, only fetch on user interaction. |
| `cache` | `boolean` | `false` | `cache` is used to enable the cache.<br />if `cache` is `true`, will enable to cache the lighthouse report. |
| `build.bundle` | `boolean` | `false` | `bundle` is used to determine whether to bundle the page insight.<br />if `bundle` is `true`, will bundle the page insight. so you can see the insight after build.<br />It will bundle results from local cache. |
| `build.showOnLoad` | `boolean` | `false` | `showOnLoad` is used to determine whether to show the page insight on page load.<br />if `showOnLoad` is `true`, will show the page insight on page load. |

### Example

```ts
import pageInsight from "astro-page-insight";

export default defineConfig({
  integrations: [
    pageInsight({
      lh: {
        weight: 0.5,
        breakPoint: 1024,
      },
      firstFetch: "open",
      cache: true,
      build: {
        bundle: true, // You should get value from the environment variable. (e.g. process.env.STAGING === "true")
        showOnLoad: true, // This option is only available when `bundle` is `true`.
      },
    }),
  ],
});
```

### gitignore

If you want to ignore the cache, add the following to your `.gitignore`:

```diff
+ .pageinsight
```

### Notification

You can sometimes see that the notification is displayed in the app.  
There are three types of notifications:

| Color | Description |
| --- | --- |
| `Blue` | `blue` means that results are fresh. |
| `Yellow` | `yellow` has two meanings.<br />One is that the results are from the cache.<br />The other is that fetching is in progress. |
| `Red` | `red` means that fetching failed. |

### `build.bundle`

If you set `build.bundle` to `true`, **It will bundle results from local cache, So you need to have `lighthouse results(cache)` on build time.**

## Contributing

This project is structured as a multi-package monorepo:

- `packages/ui` - UI components and rendering logic (`@page-insight/ui`)
- `package` - Main Astro integration package (`astro-page-insight`)
- `playground` - Example applications for testing

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Watch for changes in both packages:

```bash
pnpm package:dev
```

**Note**: The UI package must be built before the main package due to dependencies. The build order is automatically handled by the development and build scripts.

Start the playground with blog:

```bash
pnpm playground:blog
```

Start the playground with ssr:

```bash
pnpm playground:ssr
```

Start the playground with starlog:

```bash
pnpm playground:starlog
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/ktym4a/astro-page-insight/blob/main/LICENSE). Made with ❤️ by [ktym4a](https://github.com/ktym4a).

<!-- ## Acknowledgements

TODO: -->
