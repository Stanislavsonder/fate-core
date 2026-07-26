# Phase 5 — Other Improvements (backlog)

> **Prerequisites:** none specific — this is a backlog of follow-ups
> identified while implementing earlier phases, not a strictly-ordered
> continuation of Phase 4. Pull items into a real phase/PR as they're ready.

## Phase 4 close-out — remaining items, all requiring the live `fate-core-mods` repo

**Context:** Phase 4's app-side implementation (SDK publish infra,
`create-fate-mod` scaffolder, the `dice` capability, theme confirmed already
generic) is done, unit-tested, and verified locally — see
`phase-4-sdk-extensions.md`'s "Update (implementation session)" note for
detail. Every item below was deliberately deferred rather than done in that
session because it requires pushing to the separate, live `fate-core-mods`
repo (or an external service, npm), which needs the user's explicit
per-action go-ahead — the same standing rule Phase 3's closeout followed.

- **`NPM_TOKEN` repo secret** — needs to be added to this repo's GitHub
  Actions secrets (an npm automation token with publish rights on the
  `@fate-core` org) before `.github/workflows/publish-sdk.yml` can actually
  publish anything. Owner: user (npm credentials aren't something Claude
  should obtain or handle). Once added, a `workflow_dispatch` dry run is the
  safe way to prove the pipeline before a real `mod-sdk-v*` tag push.
- **`create-fate-mod` isn't published to npm yet** — `mod-types`/`mod-build`
  already were (manually, pre-Phase-4); this new package needs its first
  real publish once the token exists.
- **`fate-core-mods`' `validate-pr.yml` still rejects `dice`/`theme`
  capability submissions** — `registry.schema.json`'s `capabilities` enum
  already allows both (its comment currently says "only sheetComponents has
  full external support before Phase 4; others are rejected... for now" —
  needs updating once this lands), but the actual PR-validation script in
  that repo hasn't been touched. Also needs the dice smoke-load check
  (`packages/mod-build/src/testing.ts`'s `smokeLoad()` already supports
  instantiating dice shapes headlessly — CI just needs to call it) wired
  into that repo's CI.
- **`translationTargets` schema field** — the Phase 4 doc's "schema now,
  implementation later" design stub. Genuinely coupled to the live repo:
  adding it only to this repo's vendored `packages/mod-types/registry.schema.json`
  would immediately fail `pnpm check-registry-schema` (which diffs against
  the canonical copy in `fate-core-mods`'s `main` branch) — do both together
  in one PR against that repo.
- **A real dice mod, published end-to-end** — scaffold one (e.g.
  `sonder@dice-d6`) with `create-fate-mod`, dev-mode live-reload it, then
  actually publish it to the registry and install it via the Mod Store. This
  is the acceptance test Phase 4's own checklist calls for and can't be
  faked locally — it needs the `validate-pr.yml` fix above to land first.
- **Author docs in the registry repo** — `docs/GUIDE.md` (doesn't exist yet)
  and a `SUBMITTING.md` polish pass for the scaffolder flow. `docs/MOD_API.md`
  in *this* repo was already updated with the `dice` capability this
  session; the registry repo's own docs are untouched.
- **Project close-out sweep** — per Phase 4's Step 6: update this repo's
  `CLAUDE.md`/root `README.md` module-system section to describe 2.0
  (registry, loader, SDK) and link to `planning/modules-2-0/`; a registry
  repo README badge / release-notes announcement; write the maintenance
  cadence (ABI-touching dependency upgrades get an RFC issue before an SDK
  major ships; a blocklist response-time target) into the registry README.
- **Not yet exercised on-device**: `create-fate-mod`'s generated project's
  live dev-mode connect against a running app build (the scaffold→build
  loop itself *was* verified, with real packed npm tarballs — just not the
  live-reload connection step), and the dice mod's physics/rendering on a
  real device — both fall under this project's existing, already-documented
  "no hardware available this session" pattern (see Phase 3's equivalent
  notes).
- **No Cypress e2e coverage for the dice UI changes** — `DiceTypeSelect.vue`'s
  shape/material selection now keys off the `DICE_SHAPES`/`DICE_MATERIALS`
  Map key (namespaced for external mods) rather than the bare class name;
  covered by a unit test for the underlying `registerBuiltinDice`/
  `syncExternalDice` logic (`src/tests/unit/dice/registerBuiltinDice.test.ts`)
  but not by a real browser test of the Roll Dice page itself. Same gap
  pattern as the existing "Cypress e2e coverage for Phase 2" backlog item
  below — real browser testing has repeatedly caught bugs unit tests
  couldn't (see that section), so this is worth prioritizing once there's a
  real external dice mod to test against.

## Repo topology needs a real decision — currently an awkward in-between

**Context:** as of Phase 3, the project's code is split across three git
repos with an inconsistent relationship to each other:

- `fate-core` (this repo) — the app itself, plus `packages/mod-types` and
  `packages/mod-build` as pnpm workspace packages that are *also*
  independently published to npm as `@fate-core/mod-types`/`@fate-core/mod-build`.
- `fate-core-mods` — a wholly separate repo (own history, own issues, own
  CI) for the public mod registry, depending on the above two packages via
  plain npm (not any workspace/monorepo relationship to `fate-core`).

This is neither a clean monorepo (the registry repo isn't a folder here) nor
clean independent repos (`mod-types`/`mod-build` still live inside `fate-core`
and are versioned/released alongside app changes, not on their own cadence).
Flagged by the user as worth revisiting — no decision made yet, needs its own
planning pass before acting. Two directions worth weighing when that happens:

1. **True monorepo**: fold `fate-core-mods` in as another top-level folder/
   package in this repo (single git history, single set of CI workflows to
   maintain), publishing `mod-types`/`mod-build` from here as today. Tradeoff:
   `fate-core-mods` is meant to take PRs from arbitrary community authors —
   folding it into the app's own repo means every mod submission is a PR
   against the main app repo, which may be more or less desirable depending
   on how much the maintainer wants to keep community contributions
   separated from the app's own commit history/issue tracker.
2. **Fully independent packages**: spin `mod-types` and `mod-build` out into
   their own repos (each with their own release cadence, versioning,
   independent of app releases), leaving `fate-core-mods` as-is and
   `fate-core` (the app) as a pure consumer of both via npm, same as any
   other dependency. Tradeoff: three repos to keep in sync instead of one,
   more overhead for a single-maintainer project, but a cleaner separation
   of "the app" vs. "the SDK" vs. "the community registry."

Whichever direction, note that `mod-types`/`mod-build` are *already*
published to npm as of Phase 3 (see that phase's "Deviations" section) — this
isn't a decision that's still theoretical, real consumers (mod authors,
`fate-core-mods`' own CI) already depend on the current npm packages existing
at their current names/versions, so any restructure needs a migration path,
not just a repo move.

## Privacy Policy needs updating — Phase 2/3 make it factually wrong

**Context:** `privacy-policy/languages/en.md` (and the other locales) currently
states, verbatim:

- §2: *"The App operates entirely offline and does not collect any personal
  data from users."*
- §5: *"The App does not integrate with any third-party services or external
  APIs. No data is shared with or collected by third parties."*

Both statements are already false as of Phase 2 (install-from-URL fetches an
author-supplied URL on explicit user action) and become more clearly false
with Phase 3: `src/mods/registryClient.ts`'s `refreshIndex()` runs
**automatically, in the background, on every app boot** (`main.ts`, no user
action required) and fetches `registry.json` from
`https://stanislavsonder.github.io/fate-core-mods` — a real third-party
network request the current policy explicitly says doesn't happen. The Mod
Store's detail view (`ModStoreDetailModal.vue`) also fetches and renders
community-authored README content from the same host on demand.

**What needs to happen** before Phase 2/3 should be considered fully shipped
to end users (not just implemented):

- Rewrite §2 and §5 to accurately describe what's actually fetched (registry
  index, mod bundles/manifests/translations/READMEs — all from
  `github.io`/GitHub Pages, all either automatic-background or
  explicit-user-install, never containing character data going *out*) and
  when (background refresh vs. explicit install-from-URL vs. explicit Mod
  Store browsing).
- Character data itself is still never transmitted anywhere — that part of
  the policy stays true and should stay emphasized, this isn't a privacy
  *regression* so much as an accuracy gap in what the app now legitimately does.
- `usePolicy.ts` / `PrivacyPolicyPage.vue` already has the mechanism for this
  (§7 of the policy itself: "significant changes will be communicated to you
  through a dialogue prompt upon launching the App after the policy is
  updated") — updating the policy content should naturally trigger that
  existing re-acceptance flow, no new plumbing needed.
- Do this for every locale under `privacy-policy/languages/`, not just `en.md`.

## Character list card / identity module redesign

**Context:** Phase 1 made `avatar` a required core `Character` field
(`packages/mod-types/src/character.ts`), independent of whether
`sonder@core-identity` is installed — see
[phase-1-builtins-migration.md](./phase-1-builtins-migration.md) Step 3 and
`src/patches/v2.0.0.ts` (the migration that backfills existing characters).
This fixed the immediate problem: `src/components/ChracterList/parts/CharacterCard.vue`
no longer depends on a specific module for the image every card shows.

**What's still open, deliberately left out of Phase 1:**

- There is currently no way to set/change a character's avatar unless
`sonder@core-identity` is installed — the only avatar editor
(`sonder@core-identity/src/components/parts/Avatar.vue`) lives inside that
module's sheet section (`Identity.vue`). A character created with zero
modules gets the empty-string default (placeholder image) and has no UI
path to add a real one without installing identity first.
- `CharacterCard.vue` and `sonder@core-identity` (`Identity.vue`, `Avatar.vue`)
are candidates for a broader redesign now that `avatar` is a core concept —
e.g., an avatar picker directly in character creation
(`CharacterConfiguration.vue`), independent of module selection.
- Owner: user ("I'll tinker something") — no fixed design yet, intentionally
left open rather than guessed at here.



## Cypress e2e coverage for Phase 2 (external mod loading)

**Context:** Phase 2 (install-from-URL, Dexie-backed mod storage, the
runtime loader, Settings → Mods, dev-mode live reload) shipped with unit/
integration coverage (`src/tests/unit/mods/`) but **zero Cypress e2e
coverage** — every one of these flows was instead verified once, by hand,
in a live Chrome session (see the session that closed out
`phase-2-loader-storage-devmode.md`). That manual pass caught six real bugs
that no automated test caught first:

1. A literal `@` in a translation string crashed vue-i18n's message parser
   the moment Developer Mode was opened (`settings.developer.installFromUrl.urlPlaceholder`).
2. `ModsManagePage.vue` displayed raw i18n keys instead of resolved mod
   names (missing `$t()`; `safeManifest()` not signing the manifest).
3. A disabled-across-reload mod's name showed as a raw key (translations
   never merged for a mod that was never `loadExternalMod`-ed this session).
4. `packages/example-mod`'s `onInstall` wasn't idempotent, silently wiping
   character data on every reload (also caught: `docs/MOD_API.md` had
   documented `onInstall` as "runs once", which is wrong).
5. The dev-mode hot-reimport threw `DataCloneError` — passing the live
   reactive Pinia character object into `changeCharacterModules` instead of
   going through the existing `reconfigureCharacter` action.
6. (Pre-existing, not Phase 2's bug, but only surfaced by actually creating
   a character live) every built-in module's `manifest.json` still declared
   `appVersion: "^1.x"` after the 2.0.0 bump, so *no* character could be
   created at all.

None of these are exotic — they're exactly the class of bug that only shows
up when real browser APIs run for real: vue-i18n message compilation, blob-URL
`import()` (confirmed **unavailable in Node/Vitest** — this is why
`src/tests/unit/mods/integration.exampleMod.test.ts` substitutes a `data:`
URL for that one step), `structuredClone` on a Vue reactive proxy, and
autosave debounce timing. Unlike the unit suite, Cypress runs in a real
browser and could close the blob-URL gap completely — this is the one
mechanism nothing in the automated suite exercises for real.

**What's needed**, roughly in priority order:

- **A committed fixture mod bundle** under `src/tests/e2e/fixtures/mods/`
  (a manifest.json + built bundle.mjs + translations/en.json — e.g. a
  trimmed copy of `packages/example-mod`'s build output) so specs don't
  need to spawn `@fate-core/mod-build` during the Cypress run. Regenerate it
  manually (`pnpm --filter example-mod build` + copy) whenever
  `packages/mod-build`'s shim/CSS-injection behavior or `SDK_VERSION` changes
  — there's no automation tying the fixture to the real preset output yet,
  so it can drift silently; a follow-up could add a CI check that diffs them.
- **Serve the fixture via `cy.intercept`**, not a second running process —
  intercept `GET **/mods/example/manifest.json`, `.../bundle.mjs`, and
  `.../translations/en.json` and reply with the fixture files' contents.
  This avoids the process-management complexity of running
  `mod-build`'s dev server (or any static server) alongside Cypress in CI,
  and keeps the whole spec self-contained.
- **Install-from-URL spec**: Settings → Developer → enable → install from
  the intercepted URL → typed-confirmation prompt (type the wrong string,
  assert it stays open; type the mod id, assert it installs) → toast →
  appears in Settings → Mods as `Loaded`.
- **Character-sheet spec**: create a character with the fixture mod
  selected (assert the "External" badge renders — `CharacterConfiguration.vue`),
  open its config modal (assert the config option renders from
  `manifest.json`, not the bundle), fill in the mod's own field, reload the
  page, assert the value survived (this is exactly the `getModData`/
  `setModData` round-trip bug #4 above would have caught).
- **Mods management spec**: disable (assert the character sheet section
  disappears without a full reload — `ModsManagePage.vue`'s in-session
  `ModRegistry` status flip), re-enable, update, and the remove-guard
  (attempt remove while a character still references it, assert it's
  blocked and lists the character name — `installService.ts`'s `remove()`).
  Removing `confirmRemove`'s use of `@capacitor/dialog`'s native
  `Dialog.confirm` (a real blocking browser `confirm()` on web) needs
  either a Cypress-specific stub or accepting that spec can't assert past
  the confirm step in Chrome headless the way `cy.on('window:confirm')`
  normally would for `window.confirm` — check whether Capacitor's web
  fallback actually calls `window.confirm` before assuming `cy.on` works.
- **Dev-mode live reload**: lower priority / harder to automate well — it
  needs a second running process (`mod-build`'s dev server) alongside
  Cypress, which is exactly the complexity the `cy.intercept` approach above
  is designed to avoid for the other specs. If attempted, keep it as its
  own opt-in spec (e.g. `dev-mode.cy.ts`, run manually or in a separate CI
  job) rather than blocking the main suite on spawning a child process.

## Other known follow-ups from Phase 1 (see that doc's checklist for detail)

- Manual verification never done in the coding session: Pink skin in a real
browser/device, `.fchar`/`.fmod` round-trip against a pre-Phase-1 export,
non-English locale spot-check, iOS/Android smoke test.
- Dice materials (white/black) were deliberately not converted to mods in
Phase 1 — only shapes were. Revisit if a real need for custom materials
shows up.
- ~~`FateModDice.shapes`/`materials` stay `unknown[]`...~~ Done in Phase 4 —
now properly typed `DiceConstructor[]`/`DiceMaterial[]`.
- Double check missing translations and fix it.
- Add more debug info for mod devs

