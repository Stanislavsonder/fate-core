import Modules from '@/modules'
import type { CharacterModules } from '@/types'
import type { FateModuleManifest } from '@/modules/utils/types'

export function getModules(modulesList: CharacterModules): FateModuleManifest[] {
	return Object.keys(modulesList)
		.map(id => Modules.get(id))
		.filter(m => m && modulesList[m.id].version === m.version) as FateModuleManifest[]
}
