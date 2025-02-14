import Dexie, { type EntityTable } from 'dexie'
import type { Character } from '@/types'

const db = new Dexie('CharactersDatabase') as Dexie & {
	characters: EntityTable<Character, 'id'>
}

db.version(1).stores({
	characters: '++id, _modules, _version, name, race, avatar, tokens, description, aspects, skills, stunts, stress, consequences, inventory'
})

export default db.characters
