import { ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import CharacterService from '@/service/character.service'
import useCharacter from '@/store/useCharacter'
import usePolicy from '@/composables/usePolicy'
import router, { ROUTES } from '@/router'

type PendingFile = { type: 'url'; url: string } | { type: 'file'; file: File }

const pendingFile = ref<PendingFile | null>(null)

export default function useFileHandler() {
	const { isPolicyAccepted } = usePolicy()

	async function importAndNavigate(file: File): Promise<void> {
		const characterStore = useCharacter()
		const character = await CharacterService.importCharacter(file)
		await characterStore.newCharacter(character)
		await router.push(ROUTES.CHARACTER_SHEET)
	}

	async function processUrl(url: string): Promise<void> {
		const webUrl = Capacitor.convertFileSrc(url)
		const response = await fetch(webUrl)
		const text = await response.text()
		const rawName = url.split('/').pop()?.split('?')[0] ?? 'character.fchar'
		const fileName = decodeURIComponent(rawName)
		const file = new File([text], fileName, { type: 'application/json' })
		await importAndNavigate(file)
	}

	async function handleIncomingUrl(url: string): Promise<void> {
		if (!url.toLowerCase().endsWith(CharacterService.CHARACTER_EXTENSION)) return

		if (isPolicyAccepted.value) {
			await processUrl(url)
		} else {
			pendingFile.value = { type: 'url', url }
			router.push(ROUTES.START_SCREEN)
		}
	}

	async function handleIncomingFile(file: File): Promise<void> {
		if (!file.name.endsWith(CharacterService.CHARACTER_EXTENSION)) return

		if (isPolicyAccepted.value) {
			await importAndNavigate(file)
		} else {
			pendingFile.value = { type: 'file', file }
			router.push(ROUTES.START_SCREEN)
		}
	}

	async function processPendingFile(): Promise<boolean> {
		if (!pendingFile.value) return false
		const pending = pendingFile.value
		pendingFile.value = null

		if (pending.type === 'url') {
			await processUrl(pending.url)
		} else {
			await importAndNavigate(pending.file)
		}
		return true
	}

	return {
		pendingFile,
		handleIncomingUrl,
		handleIncomingFile,
		processPendingFile
	}
}
