import { defineStore } from 'pinia'
import type { Character, CharacterModules, FateContext } from '@/types'
import { computed, ref } from 'vue'
import type { FateModuleManifest } from '@/modules/utils/types'
import { templates, constants } from '@/utils/config'
import { modulesDiff } from '@/modules/utils/modulesDiff'
import { installModules } from '@/modules/utils/installModules'
import { uninstallModules } from '@/modules/utils/uninstallModules'
import { getModules } from '@/modules/utils/getModules'
import { mergeComponents } from '@/utils/helpers/mergeComponents'

const EMPTY_FATE_CONTEXT: Partial<FateContext> = {
	modules: {},
	constants,
	templates,
	components: []
}

const useFate = defineStore('fate', () => {
	const context = ref<FateContext>(EMPTY_FATE_CONTEXT as FateContext)
	const isReady = ref<boolean>(true)
	const constants = computed(() => context.value.constants)
	const templates = computed(() => context.value.templates)

	async function installCharacterModules(character: Character): Promise<Character> {
		isReady.value = false
		const ctx = structuredClone(EMPTY_FATE_CONTEXT) as FateContext

		installModules(ctx, character)

		context.value = ctx
		isReady.value = true

		return character
	}

	async function changeCharacterModules(character: Character, newModules: CharacterModules): Promise<Character> {
		isReady.value = false

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
		isReady.value = true

		return char
	}

	function getModuleComponents() {
		return mergeComponents(context.value.components)
	}

	return {
		context,
		constants,
		templates,
		isReady,
		installCharacterModules,
		changeCharacterModules,
		getModuleComponents
	}
})

export default useFate
