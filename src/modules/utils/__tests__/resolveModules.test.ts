import { describe, it, expect } from 'vitest'
import { resolveModules } from '../resolveModules'
import type { FateModuleManifest } from '../types'

describe('resolveModules', () => {
	// Helper function to create test modules
	const createModule = (
		id: string,
		version = '1.0.0',
		dependencies = {},
		loadPriority = 0,
		incompatibleWith?: string[],
		appVersion?: string,
		name = id
	): FateModuleManifest => ({
		id,
		name,
		version,
		dependencies,
		loadPriority,
		incompatibleWith,
		appVersion
	})

	it('should handle empty module list', () => {
		const result = resolveModules([])
		expect(result.resolvedModules).toEqual([])
		expect(result.issues).toEqual([])
		expect(result.disabledModules).toEqual([])
	})

	it('should detect duplicate modules', () => {
		const modules = [createModule('mod1'), createModule('mod1')]
		const result = resolveModules(modules)
		expect(result.issues).toHaveLength(1)
		expect(result.issues[0].type).toBe('dependency-cycle')
		expect(result.issues[0].moduleId).toBe('mod1')
		expect(result.disabledModules).toHaveLength(1)
	})

	it('should sort by load priority when no dependencies exist', () => {
		const modules = [createModule('mod1', '1.0.0', {}, 2), createModule('mod2', '1.0.0', {}, 1), createModule('mod3', '1.0.0', {}, 0)]
		const result = resolveModules(modules)
		expect(result.resolvedModules.map(m => m.id)).toEqual(['mod3', 'mod2', 'mod1'])
		expect(result.issues).toHaveLength(0)
		expect(result.disabledModules).toHaveLength(0)
	})

	it('should respect dependencies in sorting', () => {
		const modules = [createModule('mod1', '1.0.0', { mod2: '^1.0.0' }), createModule('mod2', '1.0.0', { mod3: '^1.0.0' }), createModule('mod3', '1.0.0')]
		const result = resolveModules(modules)
		expect(result.resolvedModules.map(m => m.id)).toEqual(['mod3', 'mod2', 'mod1'])
		expect(result.issues).toHaveLength(0)
		expect(result.disabledModules).toHaveLength(0)
	})

	it('should detect missing dependencies and suggest enabling them', () => {
		const modules = [createModule('mod1', '1.0.0', { 'non-existent': '^1.0.0' })]
		const result = resolveModules(modules)
		expect(result.issues).toHaveLength(1)
		expect(result.issues[0]).toMatchObject({
			type: 'missing-dependency',
			moduleId: 'mod1',
			details: {
				dependencyId: 'non-existent'
			}
		})
		expect(result.issues[0].suggestedActions[0].type).toBe('enable')
		expect(result.disabledModules).toHaveLength(1)
		expect(result.resolvedModules).toHaveLength(0)
	})

	it('should detect version mismatches and suggest updates', () => {
		const modules = [createModule('mod1', '1.0.0', { mod2: '^2.0.0' }), createModule('mod2', '1.0.0')]
		const result = resolveModules(modules)
		expect(result.issues).toHaveLength(1)
		expect(result.issues[0]).toMatchObject({
			type: 'version-mismatch',
			moduleId: 'mod1',
			details: {
				dependencyId: 'mod2',
				requiredVersion: '^2.0.0',
				actualVersion: '1.0.0'
			}
		})
		expect(result.issues[0].suggestedActions).toHaveLength(2)
		expect(result.issues[0].suggestedActions[0].type).toBe('update')
		expect(result.issues[0].suggestedActions[1].type).toBe('disable')
		expect(result.disabledModules).toHaveLength(1)
		expect(result.resolvedModules).toHaveLength(1)
	})

	it('should detect incompatible modules and suggest actions', () => {
		const modules = [createModule('mod1', '1.0.0', {}, 0, ['mod2']), createModule('mod2', '1.0.0')]
		const result = resolveModules(modules)
		expect(result.issues).toHaveLength(1)
		expect(result.issues[0]).toMatchObject({
			type: 'incompatible-modules',
			moduleId: 'mod1',
			details: {
				incompatibleWith: [{ id: 'mod2' }]
			}
		})
		expect(result.issues[0].suggestedActions).toHaveLength(2)
		expect(result.issues[0].suggestedActions[0].type).toBe('choose-one')
		expect(result.issues[0].suggestedActions[1].type).toBe('disable')
		expect(result.resolvedModules.length).toBeGreaterThan(0)
	})

	it('should detect dependency cycles and suggest breaking them', () => {
		const modules = [createModule('mod1', '1.0.0', { mod2: '^1.0.0' }), createModule('mod2', '1.0.0', { mod1: '^1.0.0' })]
		const result = resolveModules(modules)
		expect(result.issues).toHaveLength(1)
		expect(result.issues[0]).toMatchObject({
			type: 'dependency-cycle',
			details: {
				cycleModules: expect.arrayContaining([expect.objectContaining({ id: 'mod1' }), expect.objectContaining({ id: 'mod2' })])
			}
		})
		expect(result.issues[0].suggestedActions[0].type).toBe('disable')
		expect(result.disabledModules).toHaveLength(2)
		expect(result.resolvedModules).toHaveLength(0)
	})

	it('should handle complex dependency graph with priorities', () => {
		const modules = [
			createModule('mod1', '1.0.0', { mod2: '^1.0.0', mod3: '^1.0.0' }, 1),
			createModule('mod2', '1.0.0', { mod4: '^1.0.0' }, 2),
			createModule('mod3', '1.0.0', { mod4: '^1.0.0' }, 0),
			createModule('mod4', '1.0.0', {}, 1)
		]
		const result = resolveModules(modules)
		expect(result.resolvedModules.map(m => m.id)).toEqual(['mod4', 'mod3', 'mod2', 'mod1'])
		expect(result.issues).toHaveLength(0)
		expect(result.disabledModules).toHaveLength(0)
	})

	it('should handle app version mismatches', () => {
		const modules = [createModule('mod1', '1.0.0', {}, 0, undefined, '^2.0.0')]
		const result = resolveModules(modules)
		expect(result.issues).toHaveLength(1)
		expect(result.issues[0]).toMatchObject({
			type: 'app-version-mismatch',
			moduleId: 'mod1',
			details: {
				appVersion: '1.0.0',
				requiredAppVersion: '^2.0.0'
			}
		})
		expect(result.issues[0].suggestedActions[0].type).toBe('disable')
		expect(result.disabledModules).toHaveLength(1)
		expect(result.resolvedModules).toHaveLength(0)
	})
})
