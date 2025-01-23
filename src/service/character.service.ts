import { characters } from '@/db'
import { Character } from '@/types'

class CharacterService {
	#characters = characters

	constructor() {}

	async getCharacter(id: string | number): Promise<Character | undefined> {
		return this.#characters.get(Number(id))
	}

	async createCharacter(character: Character): Promise<Character> {
		// @ts-ignore
		delete character.id
		character.id = await this.#characters.add(character)
		return character
	}

	async getCharacters(): Promise<Character[]> {
		return this.#characters.toArray()
	}

	async updateCharacter(character: Character): Promise<number> {
		const dto = JSON.parse(JSON.stringify(character))
		return this.#characters.update(character.id, dto)
	}

	async removeCharacter(id: string | number): Promise<void> {
		return this.#characters.delete(Number(id))
	}
}

export default new CharacterService()
