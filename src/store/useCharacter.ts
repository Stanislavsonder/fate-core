import { defineStore } from 'pinia'
import { Character, CharacterModules } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/utils/helpers/debounce'
import useFate from '@/store/useFate'
import CharacterService from '@/service/character.service'

const useCharacter = defineStore('character', () => {
	const ID_KEY = 'currentCharacter'
	const { installCharacterModules, changeCharacterModules } = useFate()

	const character = ref<Character>()
	const isLoaded = ref<boolean>(false)

	onMounted(async () => {
		// Load current character if exists
		const currentCharacterId = localStorage.getItem(ID_KEY)
		if (currentCharacterId) {
			await loadCharacter(Number(currentCharacterId))
			return
		}

		isLoaded.value = true
	})

	// Watch for changes in the character object and update the character in the database
	watch(character, debounce(updateCharacter, 300), { deep: true })

	async function loadCharacter(id: number) {
		isLoaded.value = false
		character.value = await CharacterService.getCharacter(id)
		if (!character.value) {
			isLoaded.value = true
			return
		}
		localStorage.setItem(ID_KEY, id.toString())
		await installCharacterModules(character.value)
		isLoaded.value = true
	}

	async function newCharacter(template: Character) {
		isLoaded.value = false
		const newCharacter = await installCharacterModules(template)
		character.value = await CharacterService.createCharacter(newCharacter)
		localStorage.setItem(ID_KEY, character.value.id.toString())
		isLoaded.value = true
	}

	async function updateCharacter() {
		if (character.value) {
			await CharacterService.updateCharacter(character.value)
		}
	}

	async function removeCharacter(id: number) {
		await CharacterService.removeCharacter(id)
		if (character.value?.id === id) {
			localStorage.removeItem(ID_KEY)
			character.value = undefined
		}
	}

	async function reconfigureCharacter(id: number, modules: CharacterModules): Promise<void> {
		isLoaded.value = false
		const dbCharacter = await CharacterService.getCharacter(id)

		if (!dbCharacter) {
			isLoaded.value = true
			throw new Error('Character not found')
		}

		character.value = await changeCharacterModules(dbCharacter, modules)
		await CharacterService.updateCharacter(character.value)
		localStorage.setItem(ID_KEY, character.value.id.toString())
		isLoaded.value = true
	}

	return {
		character,
		loadCharacter,
		newCharacter,
		removeCharacter,
		reconfigureCharacter,
		isLoaded
	}
})

export default useCharacter
