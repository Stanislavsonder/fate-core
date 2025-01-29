import { characters } from '@/db'
import { Character, CharacterModules } from '@/types'

class CharacterService {
	CHARACTER_EXTENSION = '.fchar'
	CHARACTER_MODULE_EXTENSION = '.fmod'
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

	exportCharacter(character: Character): void {
		const element = document.createElement('a')
		const file = new Blob([JSON.stringify(character)], { type: 'application/json' })
		element.href = URL.createObjectURL(file)
		element.download = `${character.name}${this.CHARACTER_EXTENSION}`
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	exportModules(character: Character): void {
		const element = document.createElement('a')
		const file = new Blob([JSON.stringify(character._modules)], { type: 'application/json' })
		element.href = URL.createObjectURL(file)
		element.download = `${character.name}${this.CHARACTER_MODULE_EXTENSION}`
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	async importCharacter(file: File): Promise<Character | never> {
		return new Promise<Character>((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => {
				const character = JSON.parse(reader.result as string)
				if (this.#validateCharacter(character)) {
					resolve(character as Character)
				}
				reject(new Error('Invalid character file'))
			}
			reader.onerror = reject
			reader.readAsText(file)
		}).catch(error => {
			throw new Error(error)
		})
	}

	async importCharacterModules(file: File): Promise<CharacterModules | never> {
		return new Promise<CharacterModules>((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => {
				const modules = JSON.parse(reader.result as string)
				if (this.#validateModules(modules)) {
					resolve(modules as CharacterModules)
				}
				reject(new Error('Invalid modules file'))
			}
			reader.onerror = reject
			reader.readAsText(file)
		}).catch(error => {
			throw new Error(error)
		})
	}

	#validateCharacter(character: unknown): boolean {
		console.log(character)
		// TODO: Implement character validation
		return true
	}

	#validateModules(modules: unknown): boolean {
		console.log(modules)
		// TODO: Implement modules validation
		return true
	}
}

export default new CharacterService()
