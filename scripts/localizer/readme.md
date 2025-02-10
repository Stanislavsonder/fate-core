# Translation Script

This script is used to update and manage translation files in your project. It can be run from the command line via `pnpm translate` (for core translations) or `pnpm translate <module-id>` (for a specific module).

## How It Works

1. **Folder Detection**
    - If no argument is provided, the script updates translations in `src/i18n/translations`.
    - If a module ID is provided (e.g., `pnpm translate example-module`), it updates translations in `src/modules/<module-id>/translations`.

2. **Input File**
    - The script reads an `input.json` file located alongside the script. This JSON file contains translation blocks for each language:
      ```json
      {
        "en": {
          "someKey": "Hello",
          "nested": {
            "subKey": "World"
          }
        },
        "fr": {
          "someKey": "Bonjour",
          "nested": {
            "subKey": "Monde"
          }
        }
      }
      ```
    - Optionally, the input may include a `__system` key with special instructions:
      ```json
      {
        "__system": {
          "deleteKeys": ["some.nested.keyPath"],
          "renameKeys": {
            "old.path": "new.path"
          },
          "moveKeys": {
            "old.path": "another.new.path"
          }
        },
        "en": { ... },
        "fr": { ... }
      }
      ```
        - **deleteKeys**: An array of keys (in dot notation) to remove from each language file.
        - **renameKeys**: A mapping of `oldKeyPath` → `newKeyPath`. Effectively a rename operation.
        - **moveKeys**: A mapping of `oldKeyPath` → `newKeyPath`. Similar to rename, but semantically for reorganizing structure.

3. **Language Structure Validation**
    - The script checks that all languages in the input JSON (`input.json`) have the same structure (same keys).
    - If there's a mismatch in keys across languages, the script will exit with an error.

4. **Merging Translations**
    - For each language in `input.json`, the script reads (or creates) the corresponding `<language>.json` file in the translations folder.
    - It then merges new or updated keys from `input.json` into that file.

5. **Applying System Instructions**
    - If `__system` instructions exist:
        - **Delete Keys**: Removes the specified keys (and any nested values) from each language file.
        - **Rename Keys**: Copies the value from the old key path to the new one, then deletes the old key.
        - **Move Keys**: Similar to rename, but intended for reorganizing hierarchy (old path → new path).
    - If `input.json` contains only `__system` (and no language blocks), the script applies these operations to _every_ `.json` file in the translations folder.

6. **Writing Updated Files**
    - After merging and applying system instructions, the script writes updated JSON files back to the same location.
    - If a file did not exist previously, it creates a new one.

7. **Done!**
    - The script logs its progress, noting any keys that are updated, created, deleted, renamed, or moved.

## Typical Usage

- **Core Translations**
```bash
    pnpm translate
```
This updates src/i18n/translations/`<lang>`.json using the data in input.json.

- **Module-Specific Translations**
- **Module ID: example-module**
```bash
    pnpm translate module-id
```

This updates src/modules/`<module-id>`/translations/`<lang>`.json using the data in input.json.

## Notes
- Ensure `input.json` is in the same directory as the translation script.
- The script will fail if it detects any mismatch in the structure of the language blocks in `input.json`.
- Use the `__system` object within `input.json` for any advanced management of keys (deleting, renaming, moving).
