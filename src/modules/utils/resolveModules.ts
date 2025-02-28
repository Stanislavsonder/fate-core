import semver from 'semver'
import { version } from '../../../package.json'
import type { FateModuleManifest, ModuleResolutionResult, ModuleResolutionIssue } from '@/modules/utils/types'
import i18n from '@/i18n'
const { t } = i18n.global

/**
 * Main function to install/resolve modules properly.
 *
 * It will:
 * - Validate each module's `appVersion` requirement
 * - Validate dependencies and versions
 * - Check for incompatible modules
 * - Perform a topological sort that respects dependencies
 * - Within dependency groups, it sorts by ascending loadPriority
 *
 * Instead of throwing errors, it now returns a ModuleResolutionResult that includes:
 * - resolvedModules: The sorted list of modules that can be safely loaded
 * - issues: List of issues found during resolution with suggested actions
 * - disabledModules: List of modules that were disabled due to issues
 */
export function resolveModules(allModules: FateModuleManifest[] | null | undefined): ModuleResolutionResult {
	const modules = normalizeModuleInput(allModules)

	if (!modules.length) {
		return createEmptyResolutionResult()
	}

	const issues: ModuleResolutionIssue[] = []
	const disabledModules = new Set<string>()
	const moduleMap = new Map<string, FateModuleManifest>()

	try {
		buildModuleMap(modules, moduleMap, issues, disabledModules)
		validateAppVersions(modules, moduleMap, issues, disabledModules)
		identifyIncompatibleModules(modules, moduleMap, issues, disabledModules)

		const { graph, inDegree } = buildDependencyGraph(modules, moduleMap, issues, disabledModules)
		const sorted = performTopologicalSort(modules, moduleMap, graph, inDegree, disabledModules)

		handleCyclicDependencies(modules, sorted, issues, disabledModules)

		return {
			resolvedModules: sorted,
			issues,
			disabledModules: modules.filter(m => m.id && disabledModules.has(m.id))
		}
	} catch (error) {
		console.error('Error in resolveModules:', error)
		return createErrorResolutionResult()
	}
}

function normalizeModuleInput(allModules: FateModuleManifest[] | null | undefined): FateModuleManifest[] {
	return Array.isArray(allModules) ? [...allModules].filter(Boolean) : []
}

function createEmptyResolutionResult(): ModuleResolutionResult {
	return { resolvedModules: [], issues: [], disabledModules: [] }
}

function createErrorResolutionResult(): ModuleResolutionResult {
	return {
		resolvedModules: [],
		issues: [
			{
				type: 'dependency-cycle',
				moduleId: 'unknown',
				moduleName: 'unknown',
				details: {},
				suggestedActions: [
					{
						type: 'disable',
						description: t('suggestions.modules.error'),
						targetModules: []
					}
				]
			}
		],
		disabledModules: []
	}
}

function buildModuleMap(
	modules: FateModuleManifest[],
	moduleMap: Map<string, FateModuleManifest>,
	issues: ModuleResolutionIssue[],
	disabledModules: Set<string>
): void {
	for (const mod of modules) {
		if (!mod.id) {
			console.warn('Invalid module found:', mod)
			continue
		}

		if (moduleMap.has(mod.id)) {
			issues.push(createDuplicateModuleIssue(mod))
			disabledModules.add(mod.id)
			continue
		}
		moduleMap.set(mod.id, mod)
	}
}

function createDuplicateModuleIssue(mod: FateModuleManifest): ModuleResolutionIssue {
	return {
		type: 'dependency-cycle',
		moduleId: mod.id,
		moduleName: t(mod.name || mod.id),
		details: {},
		suggestedActions: [
			{
				type: 'choose-one',
				description: t('suggestions.modules.duplicateChooseOne'),
				targetModules: [mod.id]
			}
		]
	}
}

function validateAppVersions(
	modules: FateModuleManifest[],
	moduleMap: Map<string, FateModuleManifest>,
	issues: ModuleResolutionIssue[],
	disabledModules: Set<string>
): void {
	for (const mod of modules) {
		if (!mod.id || disabledModules.has(mod.id)) continue

		if (mod.appVersion && !semver.satisfies(version, mod.appVersion)) {
			issues.push(createAppVersionMismatchIssue(mod))
			disabledModules.add(mod.id)
		}
	}
}

function createAppVersionMismatchIssue(mod: FateModuleManifest): ModuleResolutionIssue {
	return {
		type: 'app-version-mismatch',
		moduleId: mod.id,
		moduleName: t(mod.name || mod.id),
		details: {
			appVersion: version,
			requiredAppVersion: mod.appVersion
		},
		suggestedActions: [
			{
				type: 'disable',
				description: t('suggestions.modules.appVersionDisable'),
				targetModules: [mod.id]
			}
		]
	}
}

function identifyIncompatibleModules(
	modules: FateModuleManifest[],
	moduleMap: Map<string, FateModuleManifest>,
	issues: ModuleResolutionIssue[],
	disabledModules: Set<string>
): void {
	for (const mod of modules) {
		if (!mod.id || disabledModules.has(mod.id)) continue

		const incompatibleList = mod.incompatibleWith ?? []
		const incompatibleFound: Array<{ id: string; name: string }> = []

		for (const incompatibleId of incompatibleList) {
			const incompatibleMod = moduleMap.get(incompatibleId)
			if (incompatibleMod && !disabledModules.has(incompatibleId)) {
				incompatibleFound.push({
					id: incompatibleId,
					name: t(incompatibleMod.name || incompatibleId)
				})
			}
		}

		if (incompatibleFound.length > 0) {
			issues.push(createIncompatibleModulesIssue(mod, incompatibleFound))
		}
	}
}

function createIncompatibleModulesIssue(mod: FateModuleManifest, incompatibleFound: Array<{ id: string; name: string }>): ModuleResolutionIssue {
	return {
		type: 'incompatible-modules',
		moduleId: mod.id,
		moduleName: t(mod.name || mod.id),
		details: {
			incompatibleWith: incompatibleFound
		},
		suggestedActions: [
			{
				type: 'choose-one',
				description: t('suggestions.modules.incompatibleChooseOne'),
				targetModules: [mod.id, ...incompatibleFound.map(m => m.id)]
			},
			{
				type: 'disable',
				description: t('suggestions.modules.incompatibleDisableAll'),
				targetModules: [mod.id, ...incompatibleFound.map(m => m.id)]
			}
		]
	}
}

function buildDependencyGraph(
	modules: FateModuleManifest[],
	moduleMap: Map<string, FateModuleManifest>,
	issues: ModuleResolutionIssue[],
	disabledModules: Set<string>
): { graph: Map<string, Set<string>>; inDegree: Map<string, number> } {
	const graph = new Map<string, Set<string>>()
	const inDegree = new Map<string, number>()

	initializeGraph(modules, disabledModules, graph, inDegree)
	validateDependencies(modules, moduleMap, issues, disabledModules, graph, inDegree)

	return { graph, inDegree }
}

function initializeGraph(modules: FateModuleManifest[], disabledModules: Set<string>, graph: Map<string, Set<string>>, inDegree: Map<string, number>): void {
	modules
		.filter(mod => mod.id && !disabledModules.has(mod.id))
		.forEach(mod => {
			graph.set(mod.id, new Set())
			inDegree.set(mod.id, 0)
		})
}

function validateDependencies(
	modules: FateModuleManifest[],
	moduleMap: Map<string, FateModuleManifest>,
	issues: ModuleResolutionIssue[],
	disabledModules: Set<string>,
	graph: Map<string, Set<string>>,
	inDegree: Map<string, number>
): void {
	for (const mod of modules) {
		if (!mod.id || disabledModules.has(mod.id)) continue

		const deps = mod.dependencies ?? {}
		for (const [depId, requiredRange] of Object.entries(deps)) {
			const depMod = moduleMap.get(depId)

			if (!depMod || disabledModules.has(depId)) {
				issues.push(createMissingDependencyIssue(mod, depId))
				disabledModules.add(mod.id)
				continue
			}

			if (!semver.satisfies(depMod.version, requiredRange)) {
				issues.push(createVersionMismatchIssue(mod, depId, depMod, requiredRange))
				disabledModules.add(mod.id)
				continue
			}

			updateDependencyGraph(depId, mod.id, graph, inDegree)
		}
	}
}

function createMissingDependencyIssue(mod: FateModuleManifest, depId: string): ModuleResolutionIssue {
	return {
		type: 'missing-dependency',
		moduleId: mod.id,
		moduleName: t(mod.name || mod.id),
		details: {
			dependencyId: depId
		},
		suggestedActions: [
			{
				type: 'enable',
				description: t('suggestions.modules.enableDependency'),
				targetModules: [depId]
			}
		]
	}
}

function createVersionMismatchIssue(mod: FateModuleManifest, depId: string, depMod: FateModuleManifest, requiredRange: string): ModuleResolutionIssue {
	return {
		type: 'version-mismatch',
		moduleId: mod.id,
		moduleName: t(mod.name || mod.id),
		details: {
			dependencyId: depId,
			dependencyName: t(depMod.name || depId),
			requiredVersion: requiredRange,
			actualVersion: depMod.version
		},
		suggestedActions: [
			{
				type: 'update',
				description: t('suggestions.modules.updateDependency'),
				targetModules: [depId]
			},
			{
				type: 'disable',
				description: t('suggestions.modules.disableDependentModule'),
				targetModules: [mod.id]
			}
		]
	}
}

function updateDependencyGraph(depId: string, moduleId: string, graph: Map<string, Set<string>>, inDegree: Map<string, number>): void {
	graph.get(depId)?.add(moduleId)
	inDegree.set(moduleId, (inDegree.get(moduleId) ?? 0) + 1)
}

function performTopologicalSort(
	modules: FateModuleManifest[],
	moduleMap: Map<string, FateModuleManifest>,
	graph: Map<string, Set<string>>,
	inDegree: Map<string, number>,
	disabledModules: Set<string>
): FateModuleManifest[] {
	const sorted: FateModuleManifest[] = []
	const zeroInDegree = findModulesWithZeroInDegree(modules, disabledModules, inDegree)

	while (zeroInDegree.length > 0) {
		sortByLoadPriority(zeroInDegree)

		const current = zeroInDegree.shift()
		if (!current?.id) continue

		sorted.push(current)
		processNeighbors(current.id, graph, inDegree, moduleMap, disabledModules, zeroInDegree)
	}

	return sorted
}

function findModulesWithZeroInDegree(modules: FateModuleManifest[], disabledModules: Set<string>, inDegree: Map<string, number>): FateModuleManifest[] {
	return modules.filter(mod => mod.id && !disabledModules.has(mod.id) && inDegree.get(mod.id) === 0)
}

function sortByLoadPriority(modules: FateModuleManifest[]): void {
	modules.sort((a, b) => (a.loadPriority ?? 0) - (b.loadPriority ?? 0))
}

function processNeighbors(
	currentId: string,
	graph: Map<string, Set<string>>,
	inDegree: Map<string, number>,
	moduleMap: Map<string, FateModuleManifest>,
	disabledModules: Set<string>,
	zeroInDegree: FateModuleManifest[]
): void {
	const neighbors = graph.get(currentId)
	if (!neighbors) return

	for (const neighborId of neighbors) {
		if (disabledModules.has(neighborId)) continue

		const newDegree = (inDegree.get(neighborId) ?? 0) - 1
		inDegree.set(neighborId, newDegree)

		if (newDegree === 0) {
			const neighborMod = moduleMap.get(neighborId)
			if (neighborMod && !disabledModules.has(neighborId)) {
				zeroInDegree.push(neighborMod)
			}
		}
	}
}

function handleCyclicDependencies(
	modules: FateModuleManifest[],
	sorted: FateModuleManifest[],
	issues: ModuleResolutionIssue[],
	disabledModules: Set<string>
): void {
	const remainingModules = findUnresolvedModules(modules, disabledModules, sorted)

	if (remainingModules.length > 0) {
		const cycleModules = remainingModules.map(m => ({
			id: m.id,
			name: t(m.name || m.id)
		}))

		issues.push(createCyclicDependencyIssue(remainingModules, cycleModules))
		remainingModules.forEach(m => disabledModules.add(m.id))
	}
}

function findUnresolvedModules(modules: FateModuleManifest[], disabledModules: Set<string>, sorted: FateModuleManifest[]): FateModuleManifest[] {
	return modules.filter(m => m.id && !disabledModules.has(m.id) && !sorted.includes(m))
}

function createCyclicDependencyIssue(remainingModules: FateModuleManifest[], cycleModules: Array<{ id: string; name: string }>): ModuleResolutionIssue {
	return {
		type: 'dependency-cycle',
		moduleId: remainingModules[0].id,
		moduleName: t(remainingModules[0].name || remainingModules[0].id),
		details: {
			cycleModules
		},
		suggestedActions: [
			{
				type: 'disable',
				description: t('suggestions.modules.breakCycle'),
				targetModules: remainingModules.map(m => m.id)
			}
		]
	}
}
