import { defineStore } from 'pinia'
import type { Character, CharacterModules, FateContext } from '@/types'
import { ref } from 'vue'
import type { FateModuleManifest } from '@/modules/utils/types'
import { templates, constants } from '@/utils/config'
import { modulesDiff } from '@/modules/utils/modulesDiff'
import { installModules } from '@/modules/utils/installModules'
import { uninstallModules } from '@/modules/utils/uninstallModules'
import { getModules } from '@/modules/utils/getModules'
import { mergeComponents } from '@/utils/helpers/mergeComponents'
import { showError } from '@/utils/helpers/dialog'
import { clone } from '@/utils/helpers/clone'

const EMPTY_FATE_CONTEXT: FateContext = {
	modules: {},
	constants,
	templates,
	shared: {},
	components: []
}

const useFate = defineStore('fate', () => {
	const context = ref<FateContext>(clone(EMPTY_FATE_CONTEXT))
	const isReady = ref<boolean>(true)

	async function installCharacterModules(character: Character): Promise<Character> {
		isReady.value = false
		const contextBackup = getContextClone()
		const characterBackup = clone(character)

		try {
			const ctx = clone(EMPTY_FATE_CONTEXT)
			installModules(ctx, character)
			context.value = ctx
			return character
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error?.toString()
			await showError(`Error installing character modules: ${errorMessage}. Reverting changes.`)
			context.value = contextBackup
			return characterBackup
		} finally {
			isReady.value = true
		}
	}

	async function changeCharacterModules(character: Character, newModules: CharacterModules): Promise<Character> {
		isReady.value = false
		const characterBackup = structuredClone(character)
		const contextBackup = getContextClone()

		try {
			const char = { ...character, _modules: newModules }
			const ctx = context.value

			// Get change instructions
			const diff = modulesDiff(character._modules, newModules)
			let modules: FateModuleManifest[]

			// Uninstall modules
			modules = getModules(diff.uninstall)
			uninstallModules(ctx, char, modules)

			// Install modules
			modules = getModules(diff.install)
			installModules(ctx, char, modules)

			// Reconfigure modules
			modules = getModules(diff.reconfigure)
			for (const m of modules) {
				ctx.modules[m.id] = m
				m.onReconfigure(ctx, char)
			}
			context.value = ctx
			return char
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : error?.toString()
			await showError(`Error changing character modules: ${errorMessage}. Reverting changes.`)
			context.value = contextBackup
			return characterBackup
		} finally {
			isReady.value = true
		}
	}

	function getModuleComponents() {
		return mergeComponents(context.value.components)
	}

	function getContextClone() {
		return clone(context.value)
	}

	return {
		context,
		isReady,
		installCharacterModules,
		changeCharacterModules,
		getModuleComponents
	}
})

export default useFate
