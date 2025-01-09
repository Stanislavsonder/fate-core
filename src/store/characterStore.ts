import { defineStore } from 'pinia'
import { Character } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { BASE_CHARACTER } from '@/constants'
import { clone, debounce, isCharacterNeedsUpdate, updateCharacterVersion } from '@/utils'
import { useI18n } from 'vue-i18n'

const useCharactersStore = defineStore('characters', () => {
	const indexDB = ref<IDBDatabase | null>(null)
	const { t } = useI18n()
	const allCharacters = ref<Character[]>([])
	const currentCharacterId = ref<string | undefined>(localStorage.getItem('currentCharacter') || undefined)
	const character = ref<Character>(structuredClone(BASE_CHARACTER))
	const isLoaded = ref<boolean>(false)

	watch(character, debounce(saveCharacter, 300), { deep: true })

	onMounted(async () => {
		const request = indexedDB.open('characters', 3)

		request.onupgradeneeded = () => {
			const db = request.result
			db.createObjectStore('characters', { keyPath: 'id', autoIncrement: true })
		}

		request.onsuccess = async () => {
			indexDB.value = request.result
			if (currentCharacterId.value) {
				try {
					const currentCharacter = await getCharacter(currentCharacterId.value)
					if (currentCharacter) {
						character.value = currentCharacter

						if (isCharacterNeedsUpdate(character.value) && confirm(t('character.update-message'))) {
							character.value = updateCharacterVersion(character.value)
							await saveCharacter(character.value)
						}
					}
				} catch (error) {
					console.error('[CharacterLoading] Unable to load character:', error)
					character.value = structuredClone(BASE_CHARACTER)
				}
			}
			isLoaded.value = true
		}
	})

	function getCharacter(id: string) {
		if (!indexDB.value) {
			return
		}

		const transaction = indexDB.value.transaction('characters', 'readonly')
		const store = transaction.objectStore('characters')

		return new Promise<Character>((resolve, reject) => {
			const request = store.get(Number(id))

			request.onsuccess = () => {
				if (!request.result) {
					reject(new Error('Character not found'))
				} else {
					resolve(request.result)
				}
			}

			request.onerror = () => {
				reject(request.error)
			}
		})
	}

	async function getAllCharacters(): Promise<void> {
		if (!indexDB.value) {
			return
		}

		const transaction = indexDB.value.transaction('characters', 'readonly')
		const store = transaction.objectStore('characters')

		allCharacters.value =
			(await new Promise<Character[]>((resolve, reject) => {
				const request = store.getAll()

				request.onsuccess = () => {
					resolve(request.result || [])
				}

				request.onerror = () => {
					console.error(request.error)
					reject(request.error || [])
				}
			})) || []
	}

	function saveCharacter(characterToSave: Character) {
		if (!indexDB.value) {
			return
		}

		const transaction = indexDB.value.transaction('characters', 'readwrite')
		const store = transaction.objectStore('characters')

		return new Promise<void>((resolve, reject) => {
			const request = characterToSave.id ? store.put(clone(characterToSave)) : store.add(clone(characterToSave))

			request.onsuccess = () => {
				if (!characterToSave.id) {
					character.value.id = request.result as string
					localStorage.setItem('currentCharacter', character.value.id)
					currentCharacterId.value = character.value.id
				}
				resolve()
			}

			request.onerror = () => {
				reject(request.error)
			}
		})
	}

	async function setCharacter(id: string) {
		const characterToSet = await getCharacter(id)
		if (characterToSet) {
			character.value = characterToSet
			localStorage.setItem('currentCharacter', id)
			currentCharacterId.value = character.value.id
		}
	}

	async function removeCharacter(id: string) {
		if (!indexDB.value) {
			return
		}

		const transaction = indexDB.value.transaction('characters', 'readwrite')
		const store = transaction.objectStore('characters')

		new Promise<void>((resolve, reject) => {
			const request = store.delete(Number(id))

			request.onsuccess = () => {
				resolve()
			}

			request.onerror = () => {
				reject(request.error)
			}
		}).then(() => {
			if (currentCharacterId.value === id) {
				localStorage.removeItem('currentCharacter')
				currentCharacterId.value = undefined
				character.value = structuredClone(BASE_CHARACTER)
			}
			allCharacters.value = allCharacters.value.filter(character => character.id !== id)
		})
	}

	function newCharacter() {
		character.value = structuredClone(BASE_CHARACTER)
		localStorage.removeItem('currentCharacter')
		currentCharacterId.value = undefined
	}

	return {
		character,
		allCharacters,
		isLoaded,
		setCharacter,
		removeCharacter,
		newCharacter,
		getAllCharacters,
		currentCharacterId
	}
})

export default useCharactersStore
