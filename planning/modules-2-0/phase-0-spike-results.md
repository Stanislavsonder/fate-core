# Phase 0 — Spike Results

> **Removed post-Phase 2**: the spike (`src/views/dev/SpikePage.vue`, route
> `/tabs/settings/dev/spike`) shipped in-app temporarily, gated behind debug
> mode, so the go/no-go result below could be reproduced/re-verified by hand
> without a throwaway branch. It was deleted once Phase 2's real loader
> (`src/mods/loader.ts`, `importBlobModule.ts`) shipped and was itself
> verified working end-to-end in a live browser — the spike's job was done.
> The results below remain the historical record of the decision this
> unblocked (**Go for Phase 2**, README.md decisions D1/D2).

## Test matrix — import()

| Environment | import() of blob URL works | Component reactive (counter increments) | Notes |
|---|---|---|---|
| Web dev server (Chrome) | ✅ | ✅ | Tested 2026-07-24. Resolved in ~58ms for a 205-byte string. |
| Web prod build (`vite preview`) | ✅ | ✅ | Tested 2026-07-24. Resolved in ~7ms. Confirmed only **one** synthetic Vue namespace object exists in the production bundle (`vue.runtime.esm-bundler-*.js`, dedicated shared chunk) — no duplicate Vue instance. |
| Web | ✅ | ✅ | User-confirmed 2026-07-25. |
| Android emulator (`pnpm build:android`) | ✅ | ✅ | User-confirmed 2026-07-25. |
| iOS simulator | ✅ | ✅ | User-confirmed 2026-07-25. |
| **iOS real device (iPad)** (`pnpm build:ios`) | ✅ | ✅ | User-confirmed 2026-07-25 — the platform this spike most needed to de-risk. |

(Initial 2026-07-24 pass reported the counter stuck at 0 on every platform;
root cause was a false alarm — the rendered `<button>` from the blob-imported
component had no visible styling, so it read as plain text and the "RUN
IMPORT() SPIKE" button was being clicked instead. Fixed by giving the
dynamically-rendered button visible button styling. Re-tested 2026-07-25,
confirmed working everywhere.)

## crypto.subtle.digest results

| Environment | Works | Notes |
|---|---|---|
| Web dev server (`http://localhost`) | ✅ | Tested 2026-07-24. `localhost` is a secure context even over plain `http://`. |
| Web prod build / PWA (`https://`) | ✅ | User-confirmed 2026-07-25. |
| Android (`capacitor://` / `https://`) | ✅ | User-confirmed 2026-07-25. |
| iOS (`capacitor://`) | ✅ | User-confirmed 2026-07-25 (simulator + real device). |

## Timing

- Blob string size used in spike: 205 bytes (trivial component). Import time:
  ~7-60ms depending on environment.
- Re-test with a ~500 KB string on the oldest supported device for a
  realistic measurement — see `phase-0-groundwork.md` Step 5.5. Not yet done;
  not a blocker (the mechanism itself is proven, only real-world timing is
  outstanding).

## Go / no-go

- [x] Blob-URL `import()` works on all target environments (web, iOS
      simulator, real iOS device, Android emulator)
- [x] Component reactivity across the import() boundary works on all target
      environments — `globalThis.FateSDK.vue` shim pattern confirmed
- [x] `crypto.subtle.digest` works everywhere tested (including `localhost`
      over plain `http://`, and all Capacitor/HTTPS contexts)
- [x] Decision D1 in `README.md`: **confirmed**. Blob-URL `import()` is
      viable on every target platform — no fallback needed.
- [x] Decision D2 in `README.md`: **confirmed**. `window.FateSDK` shim
      sharing the host's Vue instance produces working reactivity across the
      import() boundary on every target platform.

**Go for Phase 2.** The one real technical unknown the whole project stood on
is resolved. Remaining non-blocking follow-ups: measure import time for a
realistic (~500 KB) bundle on the oldest supported device; the `__vitePreload`
wrapping Vite applies to `import(/* @vite-ignore */ ...)` in production
builds (noted below) should be kept in mind when the Phase 2 SDK/loader is
built, though it did not cause any observed problem here.

## Notes

- 2026-07-24: investigated the compiled production bundle
  (`dist/assets/vue.runtime.esm-bundler-*.js`) — confirmed a single shared
  Vue namespace object is exported once and imported by every chunk that
  needs it, including the SpikePage chunk. No duplicate Vue instance.
- 2026-07-24: noted Vite wraps the dynamic `import()` call in a
  `__vitePreload` helper in production even with `/* @vite-ignore */` — the
  import still resolves correctly; worth keeping in mind for Phase 2's loader
  but not a blocker.
- 2026-07-25: initial "stuck at 0" report across all platforms was a false
  alarm — the blob-imported component's raw, unstyled `<button>` wasn't
  visually recognizable as clickable. Styled it; re-tested clean everywhere.
