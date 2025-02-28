import type { Character, FateContext } from '@/types'
import type { FateModuleManifest } from '@/modules/utils/types'
import { getModules } from '@/modules/utils/getModules'
import { markRaw } from 'vue'
import { resolveModules } from '@/modules/utils/resolveModules'
import { showIssuesMessage } from './showIssuesMessage'
import { updateModule } from './updateModules'

export function installModule(module: FateModuleManifest, context: FateContext, character: Character) {
	context.modules[module.id] = module

	if (module.shared && Object.keys(module.shared).length > 0) {
		Object.assign(context.shared, {
			[module.id]: module.shared
		})
	}

	if (module.constants && Object.keys(module.constants).length > 0) {
		Object.assign(context.constants, module.constants)
	}

	if (module.templates && Object.keys(module.templates).length > 0) {
		Object.assign(context.templates, module.templates)
	}

	if (Array.isArray(module.components) && module.components.length > 0) {
		context.components.push(...module.components.map(markRaw))
	}

	if (module.version !== character._modules[module.id].version) {
		updateModule(context, character, module.id, character._modules[module.id])
	}

	module.onInstall(context, character)
}

export function installModules(context: FateContext, character: Character, modules?: FateModuleManifest[]) {
	const modulesToInstall = modules || getModules(character._modules)
	const result = resolveModules(modulesToInstall)

	showIssuesMessage(result.issues)

	result.resolvedModules.forEach((module: FateModuleManifest) => {
		installModule(module, context, character)
	})
}
