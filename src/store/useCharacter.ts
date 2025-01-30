import { defineStore } from 'pinia'
import { Character } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/utils/helpers/debounce'
import useFate from '@/store/useFate'
import CharacterService from '@/service/character.service'
import { useRouter } from 'vue-router'

const useCharacter = defineStore('character', () => {
	const ID_KEY = 'currentCharacter'
	const { installCharacterModules } = useFate()
	const router = useRouter()

	const character = ref<Character>()
	const isLoaded = ref<boolean>(false)

	onMounted(async () => {
		// Load current character if exists
		const currentCharacterId = localStorage.getItem(ID_KEY)
		if (currentCharacterId) {
			await loadCharacter(Number(currentCharacterId))
			return
		}

		// Redirect to the character creation page if no character is loaded
		router.push('character/create')
		isLoaded.value = true
	})

	// Watch for changes in the character object and update the character in the database
	watch(character, debounce(updateCharacter, 300), { deep: true })

	async function loadCharacter(id: number) {
		isLoaded.value = false
		character.value = await CharacterService.getCharacter(id)
		if (!character.value) {
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

	return {
		character,
		loadCharacter,
		newCharacter,
		removeCharacter,
		isLoaded
	}
})

export default useCharacter
