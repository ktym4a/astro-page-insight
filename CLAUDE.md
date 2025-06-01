# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

astro-page-insight is an Astro integration that shows Lighthouse performance insights directly on web pages during development. It operates in two modes:
- **Development**: Shows a dev toolbar with real-time Lighthouse analysis
- **Production**: Optionally bundles cached insights into the build

## Essential Commands

### Development
```bash
# Install dependencies (use frozen lockfile)
pnpm i --frozen-lockfile

# Watch mode for package development
pnpm package:dev

# Test with playground apps
pnpm playground:blog     # Blog example
pnpm playground:ssr      # SSR example  
pnpm playground:starlog  # Starlog example

# Run documentation site
pnpm docs:dev
```

### Testing
```bash
# Unit tests
pnpm test:unit          # Run once with coverage
pnpm test:unit:dev      # Watch mode with coverage

# E2E tests
pnpm test:e2e:install   # Install Playwright and browsers (first time)
pnpm test:e2e           # Run E2E tests
pnpm test:e2e:clear     # Clear browser cache

# Run specific tests
pnpm --filter astro-page-insight test:unit -- path/to/test.ts
pnpm --filter astro-page-insight test:e2e -- path/to/test.ts
```

### Code Quality & Build
```bash
# Linting
pnpm lint           # Check code
pnpm lint:fix       # Fix issues

# Build
pnpm package:build  # Build the package
pnpm docs:build     # Build documentation

# Release
pnpm changeset      # Create changeset
pnpm release        # Release new version
```

## Architecture Overview

### Core Flow
1. **Integration Entry** (`package/src/integration.ts`): Astro hooks into dev/build lifecycle
2. **Dev Mode**: Registers toolbar app → WebSocket events trigger Lighthouse → UI renders results
3. **Build Mode**: Vite plugin bundles cache → Client fetches from `_astro/pageinsight/`

### Key Components

**Server-side** (`package/src/server/index.ts`):
- Launches Puppeteer for Lighthouse execution
- Caches results in `.pageinsight/` directory
- Handles mobile/desktop form factors separately

**Client-side**:
- **Dev Tool** (`package/src/clients/devTool.ts`): Manages Astro dev toolbar integration
- **Main Client** (`package/src/clients/index.ts`): Renders UI in Shadow DOM, handles state

**Plugin System**:
- **Dev Plugin** (`package/src/plugin.ts`): Implements Astro's dev toolbar API
- **Vite Plugin** (`package/src/plugins/vite-plugin-page-insight.ts`): Bundles cache files during build

### Critical Design Patterns

1. **Shadow DOM Isolation**: All UI renders inside `<page-insight-root>` custom element to prevent style conflicts

2. **Dual Mode Architecture**: Development uses WebSocket events; production uses cached JSON files

3. **Cache Strategy**: 
   - Dev: `.pageinsight/{mobile,desktop}/[hash].json`
   - Build: `_astro/pageinsight/{mobile,desktop}/[hash].json`

4. **Event Communication**:
   - Dev: `astro-page-insight-app:init`, `astro-page-insight-app:run-lighthouse`
   - ViewTransitions: `astro:page-load` listener

5. **Responsive Handling**: Breakpoint determines mobile/desktop Lighthouse runs and UI display

### Configuration Schema

The integration accepts options via `pageInsight({ ... })`:
- `weight`: Filter threshold for audits (default: 50)
- `breakpoint`: Mobile/desktop switch point (default: 767)
- `firstFetch`: When to run first analysis - 'load' | 'open' | 'none'
- `cache`: Persist cache between restarts (default: false)
- `build.bundle`: Include in production build (default: false)
- `build.showOnLoad`: Auto-show UI in production (default: false)

### Testing Strategy

- **Unit tests**: Test individual UI components and utilities
- **DOM tests**: Test UI component rendering and interactions
- **E2E tests**: Test full integration with different Astro configurations (SSG, SSR, hybrid, view transitions)

### Build Configuration

Uses tsup with:
- Entry: All TS/JS files in src
- Format: ESM only
- Includes: TypeScript definitions and sourcemaps
- Externals: astro, astro-integration-kit, vite

### Development Notes

- Lighthouse results in dev mode are not fully accurate due to dev server overhead
- The integration uses Puppeteer which requires Chrome/Chromium
- All UI components must handle both light and dark themes
- Cache files use hashed filenames based on URL + form factor