import type { FateModuleComponent } from '@/modules/utils/types'

export function mergeComponents(components: FateModuleComponent[]): FateModuleComponent[] {
	const componentMap = new Map<string, FateModuleComponent>()

	for (const core of components.sort((a, b) => a.order - b.order)) {
		componentMap.set(core.id, core)
	}

	return Array.from(componentMap.values()).sort((a, b) => a.order - b.order)
}
