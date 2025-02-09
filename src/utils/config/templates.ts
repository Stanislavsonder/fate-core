import type { Character, CharacterAspect, FateTemplates } from '@/types'
import { CharacterAspectType, ConsequenceLevel } from '@/types'
import { version } from '../../../package.json'

const aspect: CharacterAspect = {
	name: '',
	description: '',
	type: CharacterAspectType.Other
}
const character: Partial<Character> = {
	_modules: {},
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
	character
} as FateTemplates
