import type { Character, FateContext } from '@/types'
import type { FateModuleManifest } from '@/modules/utils/types'
import { getModules } from '@/modules/utils/getModules'
import { markRaw } from 'vue'

export function installModule(module: FateModuleManifest, context: FateContext, character: Character) {
	context.modules[module.id] = module

	if (Array.isArray(module.components) && module.components.length > 0) {
		context.components.push(...module.components.map(markRaw))
	}

	if (module.templates && Object.keys(module.templates).length > 0) {
		Object.assign(context.templates, module.templates)
	}

	if (module.constants && Object.keys(module.constants).length > 0) {
		Object.assign(context.constants, module.constants)
	}

	module.onInstall(context, character)
}

export function installModules(context: FateContext, character: Character, modules?: FateModuleManifest[]) {
	const modulesToInstall = modules || getModules(character._modules)
	modulesToInstall.sort((a, b) => a.loadPriority - b.loadPriority)

	modulesToInstall.forEach(module => {
		installModule(module, context, character)
	})
}
