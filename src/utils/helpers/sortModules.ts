import i18n from '@/i18n'
import type { FateModuleManifest } from '@/modules/utils/types'
const { t } = i18n.global

function comparator(a: FateModuleManifest, b: FateModuleManifest): number {
	const aName = t(a.name)
	const bName = t(b.name)
	const isCoreA = a.tags.includes('core')
	const isCoreB = b.tags.includes('core')

	return isCoreA === isCoreB ? aName.localeCompare(bName) : isCoreA ? -1 : 1
}

/**
 * Sorts modules by name, with core modules first.
 *
 * @param {FateModuleManifest[]} modules - The modules to sort.
 * @returns The sorted modules.
 */
export function sortModules(modules: FateModuleManifest[]): FateModuleManifest[] {
	return modules.sort(comparator)
}
