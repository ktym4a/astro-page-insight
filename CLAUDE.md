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
2. **Dev Mode**: Registers toolbar app → WebSocket events trigger Lighthouse → UI package renders results
3. **Build Mode**: Vite plugin bundles cache → Client fetches from `_astro/pageinsight/`

### Package Architecture

**Main Package** (`package/` - `astro-page-insight`):
- **Integration** (`src/integration.ts`): Astro lifecycle hooks
- **Server** (`src/server/index.ts`): Puppeteer + Lighthouse execution, caching
- **Dev Tool** (`src/clients/devTool.ts`): Astro dev toolbar integration
- **Main Client** (`src/clients/index.ts`): Coordinates with UI package
- **Dev Plugin** (`src/plugin.ts`): Implements Astro's dev toolbar API
- **Vite Plugin** (`src/plugins/vite-plugin-page-insight.ts`): Build-time bundling

**UI Package** (`packages/ui/` - `@page-insight/ui`):
- **Components** (`src/components/`): All UI rendering logic (toolbar, indicators, tooltips, etc.)
- **Coordinator** (`src/coordinator.ts`): Manages component lifecycle and data mapping
- **Constants & Types** (`src/constants/`, `src/types/`): Shared definitions
- **Utils** (`src/utils/`): UI-specific utilities

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

- **UI Package Tests** (`packages/ui/tests/`): Test UI components in isolation using Vitest + Happy DOM
- **Main Package Tests** (`package/tests/`): Test core functionality, server logic, and utilities
- **E2E tests** (`package/e2e/`): Test full integration with different Astro configurations (SSG, SSR, hybrid, view transitions)

### Build Configuration

**UI Package** (`@page-insight/ui`):
- Uses tsup with ESM format, TypeScript definitions
- Target: ES2020 for modern browser compatibility
- Entry: All components, coordinator, types, and utils

**Main Package** (`astro-page-insight`):
- Uses tsup with ESM format, TypeScript definitions  
- Target: Node18 for Astro compatibility
- Externals: astro, astro-integration-kit, vite
- **Dependency**: Requires UI package to be built first

**Build Order**: UI package → Main package (handled automatically by scripts)

### Development Notes

- Lighthouse results in dev mode are not fully accurate due to dev server overhead
- The integration uses Puppeteer which requires Chrome/Chromium
- All UI components must handle both light and dark themes
- Cache files use hashed filenames based on URL + form factor