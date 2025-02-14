import Modules from '@/modules'
import type { CharacterModules } from '@/types'
import type { FateModuleManifest } from '@/modules/utils/types'

export function getModules(modulesList: CharacterModules): FateModuleManifest[] {
	const modules = Object.keys(modulesList)
	return Modules.filter(m => {
		const x = modules.find(x => x === m.id)
		return x && modulesList[x].version === m.version
	})
}
