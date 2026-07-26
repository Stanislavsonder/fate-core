# FATE: Core

A digital character sheet for the FATE Core RPG system — Vue 3 + Ionic, targeting web, iOS, and Android via Capacitor.

- **Google Play:** https://play.google.com/store/apps/details?id=com.sonder.fate_core
- **Web version:** https://fate.stanislavsonder.com

## Mods

The character sheet is fully modular. Built-in modules (aspects, skills, stress, dice, …) live in `src/modules/`, and the app also loads community-made mods at runtime:

- **Mod Store** — browse and install mods from the public registry, right in the app (Settings → Mods). The registry lives in its own repo: [fate-core-mods](https://github.com/Stanislavsonder/fate-core-mods).
- **Write your own** — scaffold a mod project with `create-fate-mod`, build it against the `@fate-core/mod-types` / `@fate-core/mod-build` SDK, and live-reload it in the app via Developer Mode. See [docs/MOD_API.md](./docs/MOD_API.md) for the full author guide.

## Development

Requires Node ≥ 24 and pnpm.

```bash
pnpm install
pnpm dev        # dev server
pnpm test       # unit (Vitest) + e2e (Cypress)
pnpm build      # type-check + production build
```

See [CLAUDE.md](./CLAUDE.md) for a fuller tour of the architecture and commands, and `planning/modules-2-0/` for the mod-system design docs.
