import type { Character, FateTemplates } from '@/types'
import { version } from '../../../package.json'

const character: Character = {
	_modules: {},
	id: -1,
	_version: version,
	name: ''
}

export default {
	character
} as FateTemplates
