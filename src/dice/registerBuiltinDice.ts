import { ModRegistry } from '@/mods/modRegistry'
import { DICE_SHAPES } from './constants'
import type { DiceConstructor } from './shapes'
import SonderDiceFudge from '@/modules/sonder@dice-fudge'
import SonderDiceD20 from '@/modules/sonder@dice-d20'

const BUILTIN_DICE_MODS = [SonderDiceFudge, SonderDiceD20]

let registered = false

/**
 * Registers the built-in dice mods into ModRegistry and populates
 * DICE_SHAPES from their `dice.shapes`. Deliberately NOT called from
 * main.ts/src/mods/builtins.ts: this module statically imports the dice
 * mods, whose code is Three.js/cannon-es dice geometry — previously only
 * loaded when the (lazy-routed) Roll Dice page was visited. Importing it
 * here instead keeps it behind that same lazy boundary, since this file is
 * only imported by src/dice/composables/useDiceScene.ts. Call once, from
 * useDiceScene(); idempotent.
 *
 * Namespaced keys and removal-on-uninstall are deferred to Phase 4, when
 * external dice mods can actually be installed/removed at runtime — see
 * planning/modules-2-0/phase-4-sdk-extensions.md Step 4. `FateModDice.shapes`
 * stays untyped (`unknown[]`) until then, so the cast below is the one
 * localized unsafe cast for this built-in-only mechanism.
 */
export function registerBuiltinDice(): void {
	if (registered) {
		return
	}
	registered = true

	for (const manifest of BUILTIN_DICE_MODS) {
		ModRegistry.register({ manifest, source: 'builtin', status: 'loaded' })

		const shapes = manifest.dice?.shapes
		if (!shapes) {
			continue
		}

		for (const shape of shapes as DiceConstructor[]) {
			DICE_SHAPES.set(shape.name, shape)
		}
	}
}
