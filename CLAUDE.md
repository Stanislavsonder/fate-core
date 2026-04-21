# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FATE: Core is a Vue 3 + Ionic hybrid mobile/web app serving as a digital character sheet for the FATE Core RPG system. It targets iOS, Android, and web via Capacitor.

- **Package manager:** pnpm (required — do not use npm/yarn)
- **Node:** >=24.14.0

## Common Commands

```bash
pnpm dev              # Start dev server (also compiles translations)
pnpm build            # TypeScript check + Vite production build
pnpm build:android    # Build + Capacitor sync + open Android project
pnpm build:ios        # Build + Capacitor sync + open iOS project

pnpm test             # Run all tests (unit + e2e)
pnpm test:unit        # Vitest unit tests only
pnpm test:e2e         # Cypress e2e tests (starts dev server)
pnpm cypress:open     # Open Cypress interactive UI

pnpm lint             # ESLint with auto-fix
pnpm format           # Prettier formatting

pnpm translate        # Run localization script
pnpm module:generate  # Scaffold a new module
```

Unit test files live in `src/tests/unit/**/*.test.ts`. To run a single test file:
```bash
pnpm vitest run src/tests/unit/path/to/file.test.ts
```

E2E specs are in `src/tests/e2e/specs/**/*.cy.ts`.

## Code Style

- **Indentation:** tabs (width 2)
- **Line width:** 160 characters
- **Quotes:** single
- **Commits:** conventional commit format is enforced by commitlint (e.g. `feat:`, `fix:`, `build:`)
- Pre-commit hook runs ESLint + Prettier on staged files via lint-staged

## Path Alias

`@/` maps to `src/` — always use this alias for imports within the project.

## Architecture

### Module System

The app's character sheet functionality is built on a **pluggable module system**. Each module lives in `src/modules/<author>@<module-name>/` and must export a `FateModuleManifest` from its `index.ts`.

A module's structure:
```
src/modules/sonder@core-aspects/
├── manifest.json          # Metadata: id, version, author, loadPriority, dependencies
├── index.ts               # Assembles and exports the FateModuleManifest
└── src/
    ├── actions.ts         # onInstall / onUninstall / onReconfigure lifecycle hooks
    ├── components/        # Vue components registered by this module
    ├── config.ts          # User-configurable options (FateModuleConfig)
    ├── constants.ts       # Values injected into FateConstants
    ├── templates.ts       # Default character data templates
    └── types.ts           # Module-specific types
```

Key types are in `src/modules/utils/types.ts` (`FateModuleManifest`, `FateModuleConfig`, `ModuleResolutionResult`) and `src/types.ts` (`Character`, `FateContext`, `FatePatch`).

Module lifecycle:
- **`onInstall`** — called when a user adds the module to a character; writes initial data to the character object
- **`onUninstall`** — cleans up character data
- **`onReconfigure`** — called when the user changes module config
- **`patches`** — versioned migration functions (`FatePatch`) that update character data across module versions

Modules declare `loadPriority` (higher = loads first), `dependencies` (semver), and `incompatibleWith` lists. Resolution logic is in `src/modules/utils/resolveModules.ts`.

### State & Persistence

- **Pinia** stores manage runtime state
- **Dexie** (IndexedDB wrapper) handles persistent storage — DB tables are defined in `src/db/tables/`

### Internationalization

- **Vue I18n** with translation files per module under `src/modules/<module>/translations/`
- Translation keys in `manifest.json` use the prefix `t.` (resolved via `signRecord` from `src/modules/utils/localizationSigners.ts`)
- Run `pnpm compile-translation` / `pnpm translate` after adding new translation keys

### 3D Dice

The dice subsystem (`src/dice/`) uses **Three.js** for rendering and **Cannon-ES** for physics simulation.
