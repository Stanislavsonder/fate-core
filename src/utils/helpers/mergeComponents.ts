import type { FateModuleComponent } from '@/modules/utils/types'

export function mergeComponents(coreComponents: FateModuleComponent[], moduleComponents: FateModuleComponent[]): FateModuleComponent[] {
	const componentMap = new Map<string, FateModuleComponent>()

	for (const core of coreComponents) {
		componentMap.set(core.id, core)
	}

	for (const m of moduleComponents) {
		componentMap.set(m.id, m)
	}

	return Array.from(componentMap.values()).sort((a, b) => a.order - b.order)
}
