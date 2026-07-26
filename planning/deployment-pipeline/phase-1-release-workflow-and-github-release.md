# Phase 1 — Release workflow + GitHub Release

Outcome of this phase alone: pressing **Actions → Release → Run workflow** produces a git tag `vX.Y.Z` and a GitHub Release containing the signed `.apk`, `.aab`, `.ipa`, a zipped web build, and an auto-generated changelog. Store uploads and Pages come in Phases 2–4 as additional jobs on the same workflow.

## 1.1 Release-notes script — `scripts/release-notes/index.ts`

Follow the existing scripts pattern (`node --experimental-transform-types`, like `scripts/version-bump/index.ts`). The devDependency `conventional-changelog-atom` is already installed but unused — either wire `conventional-changelog` CLI or (simpler, recommended) implement directly:

- Find the last `v*` tag (`git describe --tags --abbrev=0 --match 'v*'`); if none, take full history.
- `git log <lastTag>..HEAD --pretty=%s` → group by conventional-commit type: **Features** (`feat`), **Fixes** (`fix`), **Other** (everything else worth showing: `perf`, `refactor`; drop `chore`, `build`, `ci`, `test`, `docs` noise).
- Outputs (written to a `release-artifacts/` temp dir, git-ignored):
  1. `RELEASE_NOTES.md` — markdown body for the GitHub Release; also prepended to `CHANGELOG.md` under a `## X.Y.Z (YYYY-MM-DD)` heading.
  2. `whatsnew/whatsnew-en-US` — plain text, **≤500 chars** (Play hard limit), bullet-style summary derived from the same data. Also reused as the App Store "What's New" text in Phase 4.

Add package.json script: `"release-notes": "node --experimental-transform-types ./scripts/release-notes/index.ts"`.

## 1.2 CI-friendly build scripts

`build:android`/`build:ios` end with interactive `cap open`. Add non-interactive variants (also useful locally):

```json
"build:android:ci": "pnpm build && npx cap sync android",
"build:ios:ci": "pnpm build && npx cap sync ios"
```

## 1.3 `.github/workflows/release.yml`

```yaml
name: Release
on:
  workflow_dispatch:
    inputs:
      dry_run:
        description: 'Build everything but skip store uploads and Pages deploy'
        type: boolean
        default: false
concurrency:
  group: release
  cancel-in-progress: false
```

Guard: fail immediately if `github.ref != 'refs/heads/main'`.

### Job: `prepare` (ubuntu-latest)

1. Checkout with `fetch-depth: 0` (needed for tags/changelog).
2. Read `version` from `package.json` → job output `version`.
3. **Sanity checks** (fail fast with clear messages):
   - tag `v${version}` does not already exist;
   - `versionName` in `android/app/build.gradle` == version;
   - `MARKETING_VERSION` in `ios/App/App.xcodeproj/project.pbxproj` == version
   (i.e. `pnpm version-bump` was run on the release branch).
4. Run `pnpm release-notes`; upload `RELEASE_NOTES.md` + `whatsnew/` as the `release-notes` artifact; output the notes body.

### Job: `build-web` (ubuntu-latest, needs: prepare)

- pnpm setup (same steps as `tests.yml`: `npm i -g pnpm`, `actions/setup-node` with `node-version-file: package.json`, `pnpm install`).
- `pnpm build` → `dist/`.
- Upload `dist` artifact (consumed by Pages deploy) + `fate-core-web-v${version}.zip` for the release.

### Job: `build-android` (ubuntu-latest, needs: prepare)

- pnpm setup + `actions/setup-java` (Temurin, JDK 21 — matches AGP 8.11 requirements).
- `pnpm build:android:ci`.
- Decode keystore: `echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > $RUNNER_TEMP/upload.keystore`; export `ANDROID_KEYSTORE_PATH=$RUNNER_TEMP/upload.keystore` + the three password/alias env vars from secrets (consumed by the Phase 0 signing config).
- `cd android && ./gradlew bundleRelease assembleRelease`.
- Rename + upload artifacts: `fate-core-v${version}.aab` (`android/app/build/outputs/bundle/release/`), `fate-core-v${version}.apk` (`.../apk/release/`).

### Job: `build-ios` (macos-15, needs: prepare)

- pnpm setup + `pnpm build:ios:ci`.
- `cd ios/App && pod install` (CocoaPods preinstalled on macOS runners).
- Write `ASC_PRIVATE_KEY` secret to `$RUNNER_TEMP/AuthKey.p8`.
- Archive:

  ```bash
  xcodebuild -workspace App.xcworkspace -scheme App -configuration Release \
    -destination 'generic/platform=iOS' \
    -archivePath $RUNNER_TEMP/App.xcarchive archive \
    -allowProvisioningUpdates \
    -authenticationKeyPath $RUNNER_TEMP/AuthKey.p8 \
    -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID"
  ```

- Export:

  ```bash
  xcodebuild -exportArchive -archivePath $RUNNER_TEMP/App.xcarchive \
    -exportOptionsPlist ExportOptions.plist -exportPath $RUNNER_TEMP/export \
    -allowProvisioningUpdates \
    -authenticationKeyPath $RUNNER_TEMP/AuthKey.p8 \
    -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID"
  ```

- Upload `fate-core-v${version}.ipa` artifact.

### Job: `github-release` (ubuntu-latest, needs: [build-web, build-android, build-ios])

- Download all artifacts.
- `softprops/action-gh-release@v2`: `tag_name: v${version}` (action creates the tag on `main`), `name: v${version}`, body from `RELEASE_NOTES.md`, files: apk, aab, ipa, web zip. Skipped when `dry_run`.
- Commit the updated `CHANGELOG.md` back to `main` (`git commit -m "chore: changelog for v${version}"` with `github-actions[bot]` identity). Note: the commit message must pass commitlint's conventional format if hooks ever run in CI — `chore:` is valid.

## 1.4 Acceptance test

1. On a throwaway branch merged to `main` (or with `dry_run: true` first), run the workflow.
2. Verify: all three builds green; release `vX.Y.Z` exists with 4 assets; changelog content matches commits since previous tag; `.apk` installs on a device (signed!); re-running with the same version fails the tag-exists check.
