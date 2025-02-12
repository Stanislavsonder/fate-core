import type { FateModuleManifest } from '@/modules/utils/types'
import type { Character, FateContext } from '@/types'
import constants from '@/utils/config/constants'
import { getModules } from '@/modules/utils/getModules'

export function uninstallModule(module: FateModuleManifest, context: FateContext, character: Character) {
	if (module.shared && Object.keys(module.shared).length > 0) {
		for (const key in module.shared) {
			// @ts-ignore
			delete context.shared[key]
		}
	}

	if (module.templates && Object.keys(module.templates).length > 0) {
		for (const key in module.templates) {
			// @ts-ignore
			delete context.templates[key]
		}
	}

	if (module.constants && Object.keys(module.constants).length > 0) {
		for (const key in module.constants) {
			// @ts-ignore
			context.constants[key] = constants[key]
		}
	}

	if (Array.isArray(module.components) && module.components.length > 0) {
		context.components = context.components.filter(c => !module.components!.find(e => e.id === c.id))
	}

	module.onUninstall(context, character)
}

export function uninstallModules(context: FateContext, character: Character, modules?: FateModuleManifest[]) {
	const modulesToUninstall = modules || getModules(character._modules)

	modulesToUninstall.forEach(module => {
		uninstallModule(module, context, character)
	})
}
