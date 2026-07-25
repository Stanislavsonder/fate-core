import type { FatePatch } from '@/types'

/**
 * `avatar` moved from an optional field owned by sonder@core-identity to a
 * required core Character field (packages/mod-types/src/character.ts), so
 * every character — including ones with no modules installed — always has
 * one. Backfills existing characters that predate this change, whether or
 * not they ever had sonder@core-identity installed.
 */
const v2_0_0: FatePatch = {
	version: '2.0.0',
	action: async (_context, character) => {
		character.avatar = character.avatar ?? ''
	}
}

export default v2_0_0
