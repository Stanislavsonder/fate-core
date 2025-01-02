import { defineStore } from 'pinia'
import { Character } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { BASE_CHARACTER } from '@/constants'
import { clone, debounce, isCharacterNeedsUpdate, updateCharacterVersion } from '@/utils'
import { useI18n } from 'vue-i18n'

const useCharactersStore = defineStore('characters', () => {
	const indexDB = ref<IDBDatabase | null>(null)
	const { t } = useI18n()

	const character = ref<Character>(structuredClone(BASE_CHARACTER))
	const isLoaded = ref<boolean>(false)
	watch(character, debounce(saveCharacter, 300), { deep: true })

	onMounted(() => {
		const request = indexedDB.open('characters', 3)

		request.onupgradeneeded = () => {
			const db = request.result
			db.createObjectStore('characters', { keyPath: 'id', autoIncrement: true })
		}

		request.onsuccess = async () => {
			indexDB.value = request.result
			const currentCharacterId = localStorage.getItem('currentCharacter')
			if (currentCharacterId) {
				try {
					const currentCharacter = await getCharacter(currentCharacterId)
					if (currentCharacter) {
						character.value = currentCharacter

						if (isCharacterNeedsUpdate(character.value) && confirm(t('character.update-message'))) {
							character.value = updateCharacterVersion(character.value)
							await saveCharacter(character.value)
						}
					}
				} catch (error) {
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

	function getAllCharacters() {
		if (!indexDB.value) {
			return
		}

		const transaction = indexDB.value.transaction('characters', 'readonly')
		const store = transaction.objectStore('characters')

		return new Promise<Character[]>((resolve, reject) => {
			const request = store.getAll()

			request.onsuccess = () => {
				resolve(request.result)
			}

			request.onerror = () => {
				reject(request.error)
			}
		})
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
				}
				resolve()
			}

			request.onerror = () => {
				reject(request.error)
			}
		})
	}

	function setCharacter(newCharacter: Character) {
		if (!newCharacter.id) {
			return
		}
		character.value = newCharacter
		localStorage.setItem('currentCharacter', newCharacter.id)
	}

	function clearCharacter() {
		character.value = structuredClone(BASE_CHARACTER)
	}

	return {
		character,
		isLoaded,
		clearCharacter,
		setCharacter,
		getAllCharacters
	}
})

export default useCharactersStore
