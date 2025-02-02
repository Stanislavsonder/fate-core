import { defineStore } from 'pinia'
import { Character, CharacterModules, FateContext, Skill, Stress } from '@/types'
import { computed, ref } from 'vue'
import { clone } from '@/utils/helpers/clone'
import { FateModuleManifest } from '@/modules/utils/types'
import { templates, constants } from '@/utils/config'
import Modules from '@/modules'
import { modulesDiff } from '@/modules/utils/modulesDiff'

const EMPTY_FATE_CONTEXT: FateContext = {
	modules: {},
	constants,
	templates,
	skills: {
		enabled: false,
		list: [],
		map: new Map<string, Skill>()
	},
	stress: {
		enabled: false,
		list: [],
		map: new Map<string, Stress>()
	}
}

const useFate = defineStore('fate', () => {
	const context = ref<FateContext>(EMPTY_FATE_CONTEXT)
	const isReady = ref<boolean>(true)
	const constants = computed(() => context.value.constants)
	const templates = computed(() => context.value.templates)

	async function installCharacterModules(character: Character): Promise<Character> {
		isReady.value = false
		const char = clone(character)
		const modulesToInstall = getModules(char._modules)
		const ctx = clone(EMPTY_FATE_CONTEXT)

		ctx.skills.map = new Map<string, Skill>()
		ctx.stress.map = new Map<string, Stress>()

		for (const m of modulesToInstall) {
			ctx.modules[m.id] = m
			if (m.onInstall) {
				m.onInstall(ctx, char)
			}
		}
		context.value = ctx
		isReady.value = true
		return char
	}

	async function changeCharacterModules(character: Character, newModules: CharacterModules): Promise<Character> {
		isReady.value = false

		const char = clone({ ...character, _modules: newModules })
		const ctx = context.value

		// Get change instructions
		const diff = modulesDiff(character._modules, newModules)

		// Uninstall modules
		let modules = getModules(diff.uninstall)
		for (const m of modules) {
			delete ctx.modules[m.id]
			m.onUninstall(ctx, char)
		}

		// Install modules
		modules = getModules(diff.install)
		for (const m of modules) {
			ctx.modules[m.id] = m
			m.onInstall(ctx, char)
		}

		// Reconfigure modules
		modules = getModules(diff.reconfigure)
		for (const m of modules) {
			ctx.modules[m.id] = m
			m.onReconfigure(ctx, char)
		}

		context.value = ctx
		isReady.value = true

		console.log(context.value)

		return char
	}

	async function updateCharacterModule(character: Character, moduleId: string, toVersion: string): Promise<Character> {
		// TODO: Implement module update
		console.log('Update module', moduleId, 'to version', toVersion)
		return character
	}

	function getModules(modulesList: CharacterModules): FateModuleManifest[] {
		const modules = Object.keys(modulesList)
		return Modules.filter(m => {
			const x = modules.find(x => x === m.id)
			return x && modulesList[x].version === m.version
		})
	}

	function getSkill(id: string): Skill | never {
		const skill = context.value.skills.map.get(id)
		if (!skill) {
			throw new Error(`Skill with id ${id} not found`)
		}
		return skill
	}

	function getStress(id: string): Stress | never {
		const stress = context.value.stress.map.get(id)
		if (!stress) {
			throw new Error(`Stress with id ${id} not found`)
		}
		return stress
	}

	return {
		context,
		constants,
		templates,
		isReady,
		installCharacterModules,
		changeCharacterModules,
		updateCharacterModule,
		getSkill,
		getStress
	}
})

export default useFate
