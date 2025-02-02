import { CharacterModules } from '@/types'
import { ModulesUpdateInstruction } from '@/modules/utils/types'
import isEqual from 'lodash/isEqual'

export function isConfigsEqual(a: Record<string, unknown> | undefined, b: Record<string, unknown> | undefined): boolean {
	return isEqual(a, b)
}

export function modulesDiff(oldModules: CharacterModules, newModules: CharacterModules): ModulesUpdateInstruction {
	const diff: ModulesUpdateInstruction = {
		install: {},
		uninstall: {},
		reconfigure: {}
	}
	const oldModulesMap = new Map(Object.entries(oldModules).map(m => [m[0], m[1]]))
	const newModulesMap = new Map(Object.entries(newModules).map(m => [m[0], m[1]]))

	for (const [id, m] of oldModulesMap) {
		if (!newModulesMap.has(id)) {
			diff.uninstall[id] = m
		}
	}

	for (const [id, m] of newModulesMap) {
		const oldModule = oldModulesMap.get(id)
		if (!oldModule) {
			diff.install[id] = m
		} else if (!isConfigsEqual(oldModule.config, m.config)) {
			diff.reconfigure[id] = m
		}
	}
	return diff
}
