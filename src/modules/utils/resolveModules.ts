import semver from 'semver'
import { version } from '../../../package.json'
import type { FateModuleManifest } from '@/modules/utils/types'
import i18n from '@/i18n'
const { t } = i18n.global

/**
 * Main function to install/resolve modules properly.
 *
 * It will:
 * - Validate each module's `appVersion` requirement
 * - Validate dependencies and versions
 * - Check for incompatible modules (new feature!)
 * - Perform a topological sort that respects dependencies
 * - Within dependency groups, it sorts by ascending loadPriority
 *
 * Throws an error if:
 * - Any module has unsatisfiable dependencies
 * - `appVersion` mismatch
 * - There is a dependency cycle
 * - Two or more modules are incompatible
 */
export function resolveModules(allModules: FateModuleManifest[]): FateModuleManifest[] {
	// 1. Build a map of moduleId -> module for quick lookup
	const moduleMap = new Map<string, FateModuleManifest>()
	for (const mod of allModules) {
		if (moduleMap.has(mod.id)) {
			throw new Error(t('errors.modules.duplicate', { value: t(mod.name) }))
		}
		moduleMap.set(mod.id, mod)
	}

	// 2. Validate appVersion constraints
	for (const mod of allModules) {
		if (mod.appVersion) {
			if (!semver.satisfies(version, mod.appVersion)) {
				throw new Error(
					t('errors.modules.appVersionMismatch', {
						appVersion: version,
						module: t(mod.name),
						requiredVersion: mod.appVersion
					})
				)
			}
		}
	}

	// 3. Check for incompatible modules
	//
	// If module A lists B in its "incompatibleWith" array and
	// both A and B are present in allModules, throw an error.
	for (const mod of allModules) {
		const incompatibleList = mod.incompatibleWith ?? []
		for (const incompatibleId of incompatibleList) {
			if (moduleMap.has(incompatibleId)) {
				throw new Error(
					t('errors.module.incompatible', {
						module: t(mod.name),
						anotherModule: t(moduleMap.get(incompatibleId)!.name)
					})
				)
			}
		}
	}

	// 4. Build adjacency list (dependency graph) and in-degree map
	//    Also validate that dependencies exist and version constraints are satisfied.
	const adjacencyList = new Map<string, string[]>() // who depends on whom
	const inDegree = new Map<string, number>() // how many dependencies each module has

	for (const mod of allModules) {
		adjacencyList.set(mod.id, [])
		inDegree.set(mod.id, 0)
	}

	for (const mod of allModules) {
		const deps = mod.dependencies ?? {}
		for (const [depModuleId, requiredRange] of Object.entries(deps)) {
			// Check that the dependency ID actually exists
			const depMod = moduleMap.get(depModuleId)
			if (!depMod) {
				throw new Error(
					t('errors.modules.missingDependency', {
						module: t(mod.name),
						dependency: t(moduleMap.get(depModuleId)!.name)
					})
				)
			}
			// Check the version constraint
			if (!semver.satisfies(depMod.version, requiredRange)) {
				throw new Error(
					t('errors.modules.dependencyVersionMismatch', {
						module: t(mod.name),
						dependency: t(depMod.name),
						requiredVersion: requiredRange,
						actualVersion: depMod.version
					})
				)
			}
			// If dependency is valid, record the edge:
			//    "mod" depends on "depModuleId", so "depModuleId" must come before "mod".
			adjacencyList.get(depModuleId)?.push(mod.id)
			inDegree.set(mod.id, (inDegree.get(mod.id) ?? 0) + 1)
		}
	}

	// 5. Topological sort with a tie-breaker on loadPriority
	//
	// We maintain a list (zeroInDegree) of all modules whose inDegree == 0.
	// Each iteration, we sort by ascending loadPriority, pick the first, "install" it,
	// and decrement in-degree for its dependents. This ensures we install
	// all dependencies first. If we can't resolve all modules, there's a cycle.
	const zeroInDegree: FateModuleManifest[] = []

	// Initialize zeroInDegree list
	for (const mod of allModules) {
		if ((inDegree.get(mod.id) ?? 0) === 0) {
			zeroInDegree.push(mod)
		}
	}

	// We'll store the final installation order
	const sorted: FateModuleManifest[] = []

	while (zeroInDegree.length > 0) {
		// Sort zeroInDegree by ascending loadPriority
		zeroInDegree.sort((a, b) => a.loadPriority - b.loadPriority)

		// Take the first module from the zeroInDegree list
		const current = zeroInDegree.shift()!
		sorted.push(current)

		// For each module that depends on current, decrement its inDegree
		const neighbors = adjacencyList.get(current.id) || []
		for (const neighborId of neighbors) {
			const oldVal = inDegree.get(neighborId) || 0
			const newVal = oldVal - 1
			inDegree.set(neighborId, newVal)
			if (newVal === 0) {
				// If in-degree is now 0, add it to zeroInDegree
				const neighborMod = moduleMap.get(neighborId)!
				zeroInDegree.push(neighborMod)
			}
		}
	}

	// 6. Check if all modules were resolved
	if (sorted.length !== allModules.length) {
		const remaining = allModules
			.filter(m => !sorted.includes(m))
			.map(m => `"${t(m.name)}"`)
			.join(', ')
		throw new Error(t('errors.modules.cannotResolve', { remaining }))
	}

	return sorted
}
