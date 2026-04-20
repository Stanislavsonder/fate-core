import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import CharacterService from '@/service/character.service'
import type { CharacterModules } from '@/types'
import useCharacter from '@/store/useCharacter'
import usePolicy from '@/composables/usePolicy'
import router, { ROUTES } from '@/router'

type PendingFile = { type: 'url'; url: string } | { type: 'file'; file: File }

const pendingFile = ref<PendingFile | null>(null)
const pendingModules = ref<CharacterModules | null>(null)

export default function useFileHandler() {
	const { isPolicyAccepted } = usePolicy()

	async function fetchFileFromUrl(url: string, fallbackName: string): Promise<File> {
		const webUrl = Capacitor.convertFileSrc(url)
		const response = await fetch(webUrl)
		const text = await response.text()
		const rawName = url.split('/').pop()?.split('?')[0] ?? fallbackName
		return new File([text], decodeURIComponent(rawName), { type: 'application/json' })
	}

	async function importCharacterAndNavigate(file: File): Promise<void> {
		const characterStore = useCharacter()
		const character = await CharacterService.importCharacter(file)
		await characterStore.newCharacter(character)
		await router.push(ROUTES.CHARACTER_SHEET)
	}

	async function importModulesAndNavigate(file: File): Promise<void> {
		const modules = await CharacterService.importCharacterModules(file)
		pendingModules.value = modules
		await router.push(ROUTES.CHARACTER_CREATE)
	}

	async function handleIncomingUrl(url: string): Promise<void> {
		const lower = url.toLowerCase()
		const isFchar = lower.endsWith(CharacterService.CHARACTER_EXTENSION)
		const isFmod = lower.endsWith(CharacterService.CHARACTER_MODULE_EXTENSION)
		if (!isFchar && !isFmod) return

		if (isPolicyAccepted.value) {
			const file = await fetchFileFromUrl(url, isFchar ? 'character.fchar' : 'character.fmod')
			if (isFchar) {
				await importCharacterAndNavigate(file)
			} else {
				await importModulesAndNavigate(file)
			}
		} else {
			pendingFile.value = { type: 'url', url }
			router.push(ROUTES.START_SCREEN)
		}
	}

	async function handleIncomingFile(file: File): Promise<void> {
		const isFchar = file.name.endsWith(CharacterService.CHARACTER_EXTENSION)
		const isFmod = file.name.endsWith(CharacterService.CHARACTER_MODULE_EXTENSION)
		if (!isFchar && !isFmod) return

		if (isPolicyAccepted.value) {
			if (isFchar) {
				await importCharacterAndNavigate(file)
			} else {
				await importModulesAndNavigate(file)
			}
		} else {
			pendingFile.value = { type: 'file', file }
			router.push(ROUTES.START_SCREEN)
		}
	}

	async function processPendingFile(): Promise<boolean> {
		if (!pendingFile.value) return false
		const pending = pendingFile.value
		pendingFile.value = null

		const file =
			pending.type === 'url'
				? await fetchFileFromUrl(
						pending.url,
						pending.url.toLowerCase().endsWith(CharacterService.CHARACTER_MODULE_EXTENSION) ? 'character.fmod' : 'character.fchar'
					)
				: pending.file

		const isFmod = file.name.endsWith(CharacterService.CHARACTER_MODULE_EXTENSION)
		if (isFmod) {
			await importModulesAndNavigate(file)
		} else {
			await importCharacterAndNavigate(file)
		}
		return true
	}

	return {
		pendingFile,
		pendingModules,
		handleIncomingUrl,
		handleIncomingFile,
		processPendingFile
	}
}
