import type { Character, CharacterAspect, FateTemplates, Stunt } from '@/types'
import { CharacterAspectType, ConsequenceLevel } from '@/types'
import { version } from '../../../package.json'

const aspect: CharacterAspect = {
	name: '',
	description: '',
	type: CharacterAspectType.Other
}

const stunt: Stunt = {
	name: '',
	description: '',
	skillId: undefined,
	priceInTokens: 0
}

const character: Partial<Character> = {
	_modules: {
		'sonder@core-skills': {
			version: '1.0.0',
			config: {}
		},
		'sonder@core-stress': {
			version: '1.0.0',
			config: {}
		}
	},
	id: -1,
	_version: version,
	name: '',
	race: '',
	description: '',
	tokens: 3,
	aspects: [],
	stunts: [],
	consequences: [
		{
			level: ConsequenceLevel.Mild,
			description: '',
			disabled: false
		},
		{
			level: ConsequenceLevel.Mild,
			description: '',
			disabled: true
		},
		{
			level: ConsequenceLevel.Moderate,
			description: '',
			disabled: false
		},
		{
			level: ConsequenceLevel.Severe,
			description: '',
			disabled: false
		}
	]
}

export default {
	aspect,
	stunt,
	character
} as FateTemplates
