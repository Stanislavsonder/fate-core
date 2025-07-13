import { describe, it, expect } from 'vitest'
import { getPatches } from '@/utils/helpers/getPatches'
import type { FatePatch } from '@/types'

function makePatch(version: string): FatePatch {
	return {
		version,
		note: '',
		incompatible: false,
		action: async () => {}
	}
}

describe('getPatches', () => {
	it('returns empty array when no patches are newer than fromVersion', () => {
		const patches = [makePatch('1.0.0'), makePatch('1.1.0')]
		expect(getPatches(patches, '1.1.0')).toEqual([])
	})

	it('filters and sorts patches greater than fromVersion', () => {
		const patches = [makePatch('1.2.0'), makePatch('1.0.0'), makePatch('1.1.0')]
		const result = getPatches(patches, '0.9.0')
		expect(result.map(p => p.version)).toEqual(['1.0.0', '1.1.0', '1.2.0'])
	})

	it('ignores patches below or equal to fromVersion', () => {
		const patches = [makePatch('1.0.0'), makePatch('1.2.0')]
		const result = getPatches(patches, '1.1.0')
		expect(result.map(p => p.version)).toEqual(['1.2.0'])
	})
})
