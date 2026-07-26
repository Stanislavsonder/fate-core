# Phase 4 — Public SDK Release & Capability Extensions (Dice, Themes, Localization)

> **Prerequisites:** Phase 3 complete (registry live, store shipped, first mod
> published).
>
> **Outcome:** the authoring toolchain is published to npm with real docs, a
> one-command scaffolder exists (`pnpm create fate-mod`), and the capability
> system gains its first non-sheet capability: **custom dice**. Theme (skins)
> and pure-localization capabilities are designed and stubbed so their later
> implementation is additive.
>
> After this phase the project is "open for business": a stranger can go from
> zero to a published mod using only public packages and docs.

## Step 1 — Publish the npm packages

Three packages, all under the `@fate-core` npm scope (register the scope/org
first; if taken, fall back to e.g. `@fate-core-app` and update every reference
from earlier phases):

| Package | Source location | Contents |
|---|---|---|
| `@fate-core/mod-types` | `packages/mod-types` (this repo) | All mod-facing types, `defineFateMod`, `getModData`, `validateBundleShape`, vendored `registry.schema.json` |
| `@fate-core/mod-build` | `packages/mod-build` (this repo) | `defineModConfig()` Vite preset, FateSDK shims, CSS injector, manifest checks, `fate-mod-build dev` server, `/testing` stub-FateSDK entry |
| `create-fate-mod` | new `packages/create-fate-mod` | Scaffolder, so `pnpm create fate-mod` works |

Publishing mechanics:

1. `packages/mod-types` gets a real build step (`tsc --emitDeclarationOnly` +
   ESM output, or `tsup`): published packages ship compiled `.d.ts` + JS, not
   raw TS. Inside the workspace the app keeps consuming source via the
   `exports` map's `development` condition or `workspace:*` resolution —
   verify `vue-tsc` still passes after adding the build.
2. **Version discipline**: `@fate-core/mod-types` and `@fate-core/mod-build`
   versions track `SDK_VERSION` (the FateSDK ABI, Phase 2 Step 1) — same
   major.minor, patch free. The manifest's `sdk` range is checked against the
   ABI at load; the packages are how authors compile against that ABI. Write
   this rule into both READMEs and `docs/MOD_API.md`.
3. Release automation: a GitHub Actions workflow in this repo publishing on
   tag (`mod-sdk-v*`) with `pnpm publish -r --filter './packages/*'`,
   provenance enabled (`--provenance`).
4. CI guard (this repo): if a PR changes anything exported by
   `packages/mod-types` or the `FateSDK` object without bumping
   `SDK_VERSION`, fail. (A simple exported-API snapshot test — e.g.
   `api-extractor` or a jest snapshot of `Object.keys` — is enough.)

## Step 2 — `create-fate-mod` (scaffolder)

Port of `scripts/module-generator/` (which scaffolds *internal* modules) to a
standalone `create-*` package producing an *external* mod project:

```
pnpm create fate-mod
# prompts: mod id (author@name — validate format), display name, author github,
#          capabilities (checkbox: sheetComponents/dice/theme/translations), languages
```

Output:

```
<author>@<name>/
  package.json          # devDeps: @fate-core/mod-build + mod-types (pinned to current SDK),
                        # scripts: { dev: "fate-mod-build dev", build: "fate-mod-build build" }
  manifest.json         # valid against registry.schema.json, sdk: "^<current>"
  bundle.ts             # defineFateMod stub per chosen capabilities
  src/ExampleSection.vue
  translations/en.json  README.md  CHANGELOG.md  LICENSE (MIT prompt)  .gitignore
  vite.config.ts        # export default defineModConfig()
  tsconfig.json
```

The generated README walks the author through: `pnpm dev` → app Developer
Mode → connect → live reload → submit to `fate-core-mods` (link
`SUBMITTING.md`). Keep `scripts/module-generator` for internal built-ins or
retire it in favor of the scaffolder + a `--builtin` flag — either way avoid
maintaining two divergent templates.

## Step 3 — Author documentation site (minimum viable)

Don't over-build; markdown in the registry repo's `docs/` is enough:

- `SUBMITTING.md` (exists from Phase 3) — polish with the scaffolder flow.
- `docs/GUIDE.md` — full walkthrough: concepts (manifest vs bundle,
  capabilities, lifecycle, context, config schema, translations/`t.` keys),
  the dev loop, testing, common pitfalls (Tailwind not available; CSS
  variables for theming; character data via `getModData`; no app-internal
  imports; single-file bundle implications).
- `docs/MOD_API.md` — copied/synced from this repo (Phase 2 Step 8) or linked.
- API reference: generate from `mod-types` (typedoc) into `docs/api/` —
  optional, nice-to-have.

## Step 4 — The `dice` capability (first non-sheet extension)

> **Update:** the built-in half of this capability landed early, in Phase 1
> Step 6 (`phase-1-builtins-migration.md`) — Fudge and D20 are already
> bundled as `sonder@dice-fudge`/`sonder@dice-d20` built-in mods with
> `capabilities: ["dice"]`, and `src/dice/registerBuiltinDice.ts` already
> populates `DICE_SHAPES` from `ModRegistry` at boot (namespacing/removal
> weren't needed yet since only built-ins exist and none are ever
> uninstalled). What's described below is the **remaining** work: exposing
> `three`/`cannon-es`/the `Dice` base class to *external* authors via
> `FateSDK.dice`, promoting `FateModDice.shapes`/`materials` from `unknown[]`
> to properly-typed `DiceConstructor[]`/`DiceMaterial[]` in `mod-types`,
> namespaced keys + clean removal (needed once dice can actually be
> uninstalled), CI validation, and proving it with a real *published* dice
> mod end-to-end.

### Context: how dice work today

`src/dice/` renders 3D dice with Three.js + cannon-es physics:

- `src/dice/shapes/index.ts` defines an abstract `Dice` base class and a
  `DiceConstructor` type — static `icon`/`name`, abstract methods
  `clone`, `getResult`, `formatResult`, `changeMaterial`, `createMesh`
  (Three.js), `createBody` (cannon-es). Still app-local (not in `mod-types`).
- Concrete dice: `sonder@dice-fudge` (4dF fate dice), `sonder@dice-d20` —
  built-in mods as of Phase 1, living under `src/modules/`.
- `DICE_SHAPES: Map<string, DiceConstructor>` (`src/dice/constants.ts`) is
  now populated at boot by `registerBuiltinDice()` from `dice`-capability
  mods in `ModRegistry`, rather than being a hardcoded literal.
  `DICE_MATERIALS: Map<string, DiceMaterial>` is still a hardcoded literal
  (white/black) — Phase 1 deliberately left materials un-modded.
- The roll screen builds its options from these Maps
  (`components/RollConfig/`), and the scene composables
  (`useDiceScene/Physics/Result/Motion`) consume instances.

The remaining extension is therefore: let *external* mod bundles contribute
to `DICE_SHAPES`/`DICE_MATERIALS` too (not just built-ins), with the
namespacing/removal/validation that only matters once dice can be installed,
disabled, and uninstalled at runtime.

### How

1. **Expose the contract**: move/mirror the `Dice` abstract class type,
   `DiceConstructor`, and `DiceMaterial` into `@fate-core/mod-types`
   (types only). Expose the *runtime* base class + three/cannon-es through
   FateSDK under a namespaced, explicitly-experimental key:

   ```ts
   // sdk.ts additions — SDK minor bump (e.g. 1.1.0)
   dice: Object.freeze({ three, cannonEs, Dice /* base class */ }),
   ```

   Mods compiled with `mod-build` get `three`/`cannon-es` added to the
   externals map (`'three': 'FateSDK.dice.three'`, `'cannon-es':
   'FateSDK.dice.cannonEs'`). Document as **experimental** in `MOD_API.md`:
   a Three.js major upgrade will be an SDK major.

2. **Bundle surface** (already typed as a stub in Phase 0):

   ```ts
   export default defineFateMod({
     dice: {
       shapes: [MyD12],            // DiceConstructor[]
       materials: [MyNeonMaterial] // DiceMaterial[]
     }
   })
   ```

3. **Registration**: dice are **app-level**, not per-character (the dice
   roller exists outside any character) — this part is already proven by
   Phase 1's `registerBuiltinDice()`. Extend it (or the Phase 2 `loader.ts`
   equivalent) to also run for `source !== 'builtin'` mods, switching to
   **namespaced keys** (`<modId>:<name>`) to prevent collisions now that
   collisions are possible; on mod remove/disable, delete those keys — Phase
   1's built-ins never needed this since nothing is ever removed. `RollConfig`
   UI shows them like built-ins (localized names via the mod's merged
   translations). Persisted roll-config referencing a since-removed die must
   fall back gracefully to fudge dice — check how the current config persists
   (localStorage) and guard it.
4. **Validation additions**: `validateBundleShape` checks `dice` entries
   (constructor is a function, static name/icon present); registry CI
   smoke-load instantiates each die headlessly (three runs fine in node with
   a stub canvas for constructor-level checks — keep it shallow, real
   rendering is reviewed by a human).
5. **Prove it**: build a real dice mod (e.g. `sonder@dice-d6` — a standard
   d6 with pips) through the full pipeline: scaffold → dev-mode on device
   (dice = the best live-reload demo there is) → publish to registry →
   install from store → roll it.

## Step 5 — `theme` (built-in half done; finish external) and `translations` design-stub

### `theme` (app skins)

> **Update:** the built-in half landed in Phase 1 Step 7 — one dummy
> `sonder@theme-pink` mod (`capabilities: ["theme"]`, `theme: { css }`), a
> skin concept in `useTheme.ts`/`useSkins.ts` (persisted selection,
> `<style data-skin-id>` injection covering both `:root` and
> `:root.ion-palette-dark`), and a picker in `ThemePage.vue`. What's left here
> is exactly the external-mod half: letting *downloaded* theme mods register
> the same way, plus store/registry integration.

- Bundle surface: `theme: { css: string }` (Phase 0 type, already used by
  `sonder@theme-pink`). The CSS is a set of overrides for the **documented**
  CSS variable surface: Ionic palette vars + the app's own vars in
  `src/styles/variables.css` (audit which are stable enough to document; that
  list becomes part of `MOD_API.md` — `sonder@theme-pink`'s CSS is the first
  real example of what's safe to override).
- Runtime model: already implemented for built-ins by Phase 1 (see above) —
  extend the same `useSkins.ts` listing to include non-`builtin`-source mods
  once Phase 2's loader can install/remove them, and wire the store UI
  (browse/install/select a skin) once Phase 3 exists.
- Store integration: once the Mod Store (Phase 3) exists, theme mods should
  be installable/selectable from it like any other mod — no more
  "coming soon" stub needed, since the runtime model is proven.

### `translations` (localization packs) — design

- Purpose: community-provided translations **for the app or for other mods**,
  shipped as data-only mods (no bundle code at all — `entry` optional when
  capabilities is exactly `["translations"]`).
- Manifest addition (schema now, implementation later):
  `"translationTargets": ["app"]` or `["some@mod"]`.
- Runtime model (later): merge via `mergeLocaleMessage` into the target
  namespace (app strings = root namespace — needs a collision policy:
  community pack loses to shipped strings unless key is missing… decide when
  implementing).
- CI: translation-only PRs skip build/security-lint steps (nothing
  executable) — much lighter review; likely the highest-volume contribution
  type, which is exactly why the capability model pays off.

## Step 6 — Project close-out

- [ ] Sweep all `docs/modules-2.0/` files: correct anything that drifted;
      mark each phase's exit checklist as historically complete.
- [ ] Update the app repo's `CLAUDE.md` / `README.md`: module system section
      now describes 2.0 (registry, loader, SDK) and links here.
- [ ] Announce: registry repo README badge in the app, release notes,
      wherever the app's community lives.
- [ ] Define the maintenance cadence: dependency upgrades that touch the ABI
      (Vue/Ionic majors) get an RFC issue in the registry repo before the
      SDK major ships; blocklist response target (e.g. same-day) written into
      the registry README.

## Phase 4 verification (acceptance)

- [ ] On a machine with no repo checkout: `pnpm create fate-mod` → `pnpm dev`
      → connect from a store-installed app build → live reload works — the
      complete stranger-to-running-mod loop, using only published packages.
- [ ] The dice mod: rolls correctly on web + iOS + Android, physics sane,
      result formatting correct, uninstalls cleanly (die disappears from
      RollConfig, persisted roll config falls back).
- [ ] SDK version guard CI: a PR adding a FateSDK key without bumping
      `SDK_VERSION` fails.
- [ ] A mod compiled against SDK 1.0.0 (Phase 3's published mod) still loads
      on the app with SDK 1.1.0 (backward-compat proof).
- [ ] Schema accepts `theme`/`translations` capabilities; store handles them
      per the chosen policy without errors.
- [ ] An externally-published theme mod installs, selects, and applies the
      same way `sonder@theme-pink` does today (proves the built-in and
      external paths share one implementation).

## Phase 4 exit checklist

- [ ] Three packages published to npm with provenance
- [ ] `SDK_VERSION` guard CI in place
- [ ] Scaffolder end-to-end verified
- [ ] Author guide + API docs published in the registry repo
- [ ] `dice` capability shipped with a real published dice mod (built-in
      Fudge/D20 half already done in Phase 1)
- [ ] `theme` capability fully working for external mods (built-in half
      already done in Phase 1); `translations` contracts in schema/types/validation
- [ ] Close-out list done
