import type { CharacterModules } from '@/types'
import Modules from '@/modules'

/**
 * Retrieves the configuration for core modules.
 *
 * @returns {CharacterModules} The configuration object for core modules.
 */
export function getCoreModulesConfig(): CharacterModules {
	const coreModules: CharacterModules = {}
	for (const module of Modules) {
		if (module.tags.includes('core')) {
			coreModules[module.id] = {
				config: {},
				version: module.version
			}
		}
	}
	return coreModules
}
