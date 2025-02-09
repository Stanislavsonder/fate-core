import type { Character } from '@/types'
import { ConsequenceLevel } from '@/types'
import { CharacterAspectType } from '@/types'

const coreCharacter: Partial<Character> = {
	_version: '1.0.5',
	_modules: {
		'sonder@core-skills': { version: '1.0.0', config: {} },
		'sonder@core-stress': {
			version: '1.0.0',
			config: { 'sonder@core-stress.mental-enabled': false }
		}
	},
	id: 1,
	name: 'Kaelen Sylvari',
	race: 'Half-Elf',
	avatar:
		'https://files.oaiusercontent.com/file-SFNt2hDjf74tv5nViqcJfH?se=2025-01-29T09%3A58%3A09Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1ac3cf69-680f-45c1-862f-f0bd7d3866cf.webp&sig=pcPu5pkre2GN8q22RpdiWkfHgBLyPWZ35M3snVP0L9I%3D',
	tokens: 5,
	description: 'A skilled adventurer and protector of nature, adept at solving problems through wit and action.',
	aspects: [
		{
			name: 'Quick Thinking',
			description: 'Always finds a way out of tricky situations with clever ideas.',
			type: CharacterAspectType.HighConcept
		},
		{
			name: 'Haunted by the Past',
			description: 'Memories of past failures still linger and influence decisions.',
			type: CharacterAspectType.Trouble
		},
		{
			name: 'Unwavering Resolve',
			description: 'Stays strong even when others falter.',
			type: CharacterAspectType.Other
		},
		{
			name: 'Defender of the Wilds',
			description: 'Deeply connected with the forest and its creatures.',
			type: CharacterAspectType.Other
		}
	],
	stunts: [
		{
			skillId: 'sonder@core-skills.lore',
			name: 'Arcane Scholar',
			description: 'Gain a +2 to overcome challenges related to magical knowledge.',
			priceInTokens: 2
		},
		{
			skillId: 'sonder@core-skills.athletics',
			name: 'Fleet-Footed',
			description: 'Gain a +2 when using Athletics to overcome physical obstacles.',
			priceInTokens: 2
		},
		{
			skillId: 'sonder@core-skills.notice',
			name: 'Keen Observation',
			description: 'Use Notice to create an advantage by spotting hidden details.',
			priceInTokens: 1
		}
	],
	consequences: [
		{
			level: ConsequenceLevel.Mild,
			description: 'A sprained wrist from climbing a rocky cliff.',
			disabled: false
		}
	]
}

export default [coreCharacter]
