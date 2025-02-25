import type { FateModuleComponent } from '@/modules/utils/types'

export function mergeComponents(components: FateModuleComponent[]): FateModuleComponent[] {
	const componentMap = new Map<string, FateModuleComponent>()

	components.sort((a, b) => a.order - b.order)

	for (const core of components) {
		componentMap.set(core.id, core)
	}

	return Array.from(componentMap.values())
}
