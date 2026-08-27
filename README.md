# Assistant for Fate

A free, open-source digital character sheet, 3D dice roller and pluggable module system for the
[Fate](https://www.faterpg.com/) roleplaying game. Built with Vue, Ionic and Capacitor;
it runs as a website, a PWA, and a native app on Android (and iOS soon).

This is an independent project. It is not published, sponsored or endorsed by Evil Hat Productions, LLC.

- **Web / PWA:** https://fate.stanislavsonder.com
- **Google Play:** https://play.google.com/store/apps/details?id=com.sonder.fate_core

## Features

- Character sheets assembled from modules (aspects, skills, stunts, stress, consequences, Fate points, inventory, notebook, identity)
- 3D Fate dice with physics
- Import / export characters as `.fchar` files
- Works fully offline; all character data stays on the device
- Light / dark theme and many UI languages

## Install the app

### Web

Open [fate.stanislavsonder.com](https://fate.stanislavsonder.com) in a modern browser. The site is a PWA: on supported browsers you can install it to the home screen from the browser’s install / Add to Home Screen prompt.

### Android

Install from [Google Play](https://play.google.com/store/apps/details?id=com.sonder.fate_core).

### iOS

An App Store build is in review. Until it is live, use the web / PWA version on iPhone or iPad.

## Develop in this repository

### Prerequisites

- [Node.js](https://nodejs.org/) See version in `engines` in `package.json`
- [pnpm](https://pnpm.io/)
- For native builds: Android Studio (Android) and/or Xcode on macOS (iOS)

### Setup

```bash
git clone https://github.com/Stanislavsonder/fate.git
cd fate
pnpm install
pnpm dev
```

`pnpm dev` compiles translations and starts the Vite dev server (LAN-accessible).

### Common commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server + translation compile |
| `pnpm build` | Typecheck + production web build |
| `pnpm preview` | Serve the production build locally |
| `pnpm test:unit` | Vitest unit tests |
| `pnpm test:e2e` | Cypress e2e tests |
| `pnpm test` | Unit then e2e |
| `pnpm cypress:open` | Cypress interactive UI |
| `pnpm lint` | ESLint with auto-fix |
| `pnpm format` | Prettier |
| `pnpm translate` | Localization script |
| `pnpm module:generate` | Scaffold a new module (`pnpm module:generate author@name`) |
| `pnpm build:android` | Web build, Capacitor sync, open Android Studio |
| `pnpm build:ios` | Web build, Capacitor sync, open Xcode |

Unit tests live in `src/tests/unit/**/*.test.ts`. E2E specs live in `src/tests/e2e/specs/**/*.cy.ts`.

```bash
pnpm vitest run src/tests/unit/path/to/file.test.ts
```

### Native apps

Android package id: `com.sonder.fate_core`. iOS bundle id: `com.sonder.fatecore`.

```bash
pnpm build:android   # needs Android Studio
pnpm build:ios       # needs Xcode on macOS
```

## Privacy

The app is designed to work **offline**. It does not collect personal data and does not call third-party APIs. Character sheets and settings stay in local storage / IndexedDB on the device.

Full policy (many languages): [privacy-policy/index.md](./privacy-policy/index.md). English: [privacy-policy/languages/en.md](./privacy-policy/languages/en.md).

Questions: [stanislavsonder@gmail.com](mailto:stanislavsonder@gmail.com).

## License and attribution

Two licenses apply. Keep them distinct.

**App source code** is [MIT](./LICENSE). That covers only the code in this repository.

**Fate rules text** (Fate Core System, Fate Accelerated Edition and Fate Condensed) is used under the
[Creative Commons Attribution 3.0 Unported license](https://creativecommons.org/licenses/by/3.0/)
and is *not* covered by the MIT License. The license requires:

> This work is based on Fate Core System and Fate Accelerated Edition (found at
> https://www.faterpg.com/), products of Evil Hat Productions, LLC, developed, authored, and
> edited by Leonard Balsera, Brian Engard, Jeremy Keller, Ryan Macklin, Mike Olson, Clark
> Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue, and licensed for our use under
> the Creative Commons Attribution 3.0 Unported license.

> This work is based on Fate Condensed (found at https://www.faterpg.com/), a product of Evil
> Hat Productions, LLC, developed, authored, and edited by PK Sullivan, Lara Turner, Fred
> Hicks, Richard Bellingham, Robert Hanz, and Sophie Lagacé, and licensed for our use under
> the Creative Commons Attribution 3.0 Unported license.

**Trademarks** belong to Evil Hat Productions, LLC and are not licensed under MIT or CC BY:

> Fate™ is a trademark of Evil Hat Productions, LLC. The Powered by Fate logo is © Evil Hat
> Productions, LLC and is used with permission.

The Fate Core logo is a trademark of Evil Hat Productions, LLC and is not used in this project.

See [ATTRIBUTION.md](./ATTRIBUTION.md) for the full notice (this is also what the in-app Legal page shows).
