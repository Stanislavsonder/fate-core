import { Character, CharacterAspect, CharacterAspectType, ConsequenceLevel, Item, Stunt } from '@/types'
import { version } from '../../../package.json' with { type: 'json' }

const aspect: CharacterAspect = {
	name: '',
	description: '',
	type: CharacterAspectType.Other
}

const stunt: Stunt = {
	name: '',
	description: '',
	skillId: '',
	priceInTokens: 0
}

const item: Item = {
	name: '',
	description: '',
	quantity: 1,
	icon: 'Cube',
	iconColor: undefined
}

const character: Character = {
	_modules: {
		'sonder@core-skills': '1.0.0',
		'sonder@core-stress': '1.0.0'
	},
	id: -1,
	_version: version,
	name: '',
	race: '',
	description: '',
	tokens: 3,
	aspects: [],
	skills: {},
	stunts: [],
	stress: [],
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
	],
	inventory: []
}

export default {
	aspect,
	stunt,
	item,
	character
}
