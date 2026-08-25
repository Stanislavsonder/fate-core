# Phase 4 — App Store upload + auto-submit

Outcome: the release workflow uploads the `.ipa` to App Store Connect, waits for processing, creates the App Store version for `X.Y.Z`, attaches the build with release notes, and **submits it for review** — zero visits to appstoreconnect.apple.com on a normal release. Apple's review itself remains asynchronous (usually 1–2 days); the pipeline ends at "Waiting for Review".

Split into two sub-steps so value lands early:

## 4a — Upload only (manual submit)

Append to `release.yml`:

```yaml
appstore-upload:
  needs: [build-ios, prepare]
  if: ${{ !inputs.dry_run }}
  runs-on: macos-15
  steps:
    - uses: actions/download-artifact@v4
      with: { name: ios-ipa }
    - uses: apple-actions/upload-testflight-build@v3
      with:
        app-path: fate-core-v${{ needs.prepare.outputs.version }}.ipa
        issuer-id: ${{ secrets.ASC_ISSUER_ID }}
        api-key-id: ${{ secrets.ASC_KEY_ID }}
        api-private-key: ${{ secrets.ASC_PRIVATE_KEY }}
```

(Despite the name, this is the standard "upload build to App Store Connect" path — the same build is then usable for TestFlight *and* App Store release. `xcrun altool` is deprecated; this action wraps the supported upload route.)

After 4a a release still needs a manual step in ASC: create version → pick build → submit. That's the gap 4b closes.

## 4b — Auto-submit script — `scripts/release/submit-appstore.ts`

No marketplace action covers "create version + attach build + submit for review", so this is a small script against the **App Store Connect REST API** (same `node --experimental-transform-types` pattern as other repo scripts). Auth: JWT (ES256) signed with the `.p8` key — `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY` env vars; the `jose` npm package (or ~30 lines with `node:crypto`) handles signing.

Flow (all against `https://api.appstoreconnect.apple.com/v1`):

1. **App id:** known constant **`6782209520`** (https://appstoreconnect.apple.com/apps/6782209520) — hardcode it; optionally assert it via `GET /apps?filter[bundleId]=com.sonder.fatecore` as a sanity check.
2. **Poll for the processed build:** `GET /builds?filter[app]=…&filter[version]=<CURRENT_PROJECT_VERSION>` until `processingState == 'VALID'`. Processing takes **10–30+ min** after upload — poll every 60 s with a hard timeout (~60 min), and handle `INVALID`/`FAILED_PROCESSING` as fatal.
3. **Ensure the App Store version:** `GET /apps/{id}/appStoreVersions?filter[versionString]=X.Y.Z`; if absent, `POST /appStoreVersions` (`platform: IOS`, `versionString: X.Y.Z`).
4. **Attach the build:** `PATCH /appStoreVersions/{id}/relationships/build`.
5. **Set "What's New":** `GET .../appStoreVersionLocalizations` → `PATCH` `whatsNew` for `en-US` using the Phase 1 `whatsnew-en-US` text.
6. **Submit for review:** `POST /reviewSubmissions` (`platform: IOS`) + `POST /reviewSubmissionItems` linking the appStoreVersion, then `PATCH` the submission with `submitted: true`. (This is the current review-submission API; the older `appStoreVersionSubmissions` endpoint is deprecated.)

Workflow job `appstore-submit` (ubuntu is fine — pure API calls): `needs: appstore-upload`, runs `pnpm submit-appstore` with the `ASC_*` secrets and version/notes from artifacts. Add package.json script `"submit-appstore"`.

## Gotchas

- **Current state (2026-07): the app's FIRST version is still in review** (app `6782209520`). ASC allows only **one version in review at a time**, so the auto-submit step cannot run until that version is approved and released. Build **uploads** (4a) work regardless — so 4a can be implemented and tested now, 4b only exercised after the first approval. The script should detect an existing in-review submission and fail gracefully with a clear message rather than erroring mid-flow.
- The **first fully-automated release should be watched**: version state must be "Prepared for Submission" before submit; leftover half-created versions in ASC from past manual releases can conflict (script handles "version already exists" by reusing it).
- `ITSAppUsesNonExemptEncryption` in Info.plist (Phase 0.3) is required — otherwise the build sits in "Missing Compliance" and step 2 never yields a submittable build.
- Phased release, screenshots/description updates are out of scope here (Phase 5); the script only ships a new build + what's-new.
- If Apple **rejects** the review, resolution is manual in ASC (respond/fix, then re-run the release with a bumped version).

## Acceptance test

1. Run a release → workflow green end-to-end; ASC shows the version "Waiting for Review" with correct build number and what's-new text, with no manual console interaction.
2. Kill-switch check: re-running `appstore-submit` when a submission is already in review fails gracefully with a clear message (idempotency guard in the script).
