# Fate Module Generation Script

This script automates the creation of a new **Fate** module folder structure

## Table of Contents

- [Overview](#overview)
- [Generated Folder Structure](#generated-folder-structure)
- [Usage](#usage)

---

## Overview

This script helps you quickly bootstrap a **Fate** module by generating common files, folders, and boilerplate code. It handles the following automatically:

1. **Module folder** under `src/modules/<moduleId>`.
2. **Manifest** (`manifest.json`) prefilled with base information.
3. **Translations** folder and a default `en.json` translation file.
4. **Type extensions** (`types.ts`) to add custom properties to your existing Fate types.
5. **Actions** (`actions.ts`) with `onInstall`, `onUninstall`, and `onReconfigure` stubs.
6. **Config** (`config.ts`) file to manage module options, with an example usage of `signRecord` for localization.
7. **Vue components** folder with an example component (`Example.vue`) and an `index.ts` that exports it as a module component.
8. **Constants** (`constants.ts`) to store your module-specific constants.
9. **Templates** (`templates.ts`) to store your module's entity templates or override existing.
   10**Index file** (`index.ts`) that exposes all parts of the module for Fate to load.

## Generated Folder Structure

After running the script, you will find a structure like this under `src/modules/<moduleId>`:

```
📦 src/modules/
 ┣ 📂 author@module-name
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┃ ┣ Example.vue
 ┃ ┃ ┃ ┗ index.ts
 ┃ ┃ ┣ actions.ts
 ┃ ┃ ┣ config.ts
 ┃ ┃ ┣ templates.ts
 ┃ ┃ ┣ constants.ts
 ┃ ┃ ┗ types.ts
 ┃ ┣ 📂 translations
 ┃ ┃ ┗ en.json
 ┃ ┣ index.ts
 ┃ ┗ manifest.json
```

## Usage

```bash
   pnpm module:generate test@module
```

```bash
   npm run module:generate test@module
```
