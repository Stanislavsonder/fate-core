import type { CharacterModules } from '@/types'
import { ModRegistry } from '@/mods/modRegistry'

/**
 * Retrieves the configuration for core modules.
 *
 * @returns {CharacterModules} The configuration object for core modules.
 */
export function getCoreModulesConfig(): CharacterModules {
	const coreModules: CharacterModules = {}
	for (const module of ModRegistry.getLoadedManifests().values()) {
		if (module.tags.includes('core')) {
			coreModules[module.id] = {
				config: {},
				version: module.version
			}
		}
	}
	return coreModules
}
