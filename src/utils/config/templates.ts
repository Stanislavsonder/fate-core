import type { Character, FateTemplates } from '@/types'
import { version } from '../../../package.json'

const character: Partial<Character> = {
	_modules: {},
	id: -1,
	_version: version,
	name: '',
	race: '',
	description: ''
}

export default {
	character
} as FateTemplates
