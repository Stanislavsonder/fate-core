// tests/modules.test.ts

import { describe, it, expect } from 'vitest'
import { isConfigsEqual, modulesDiff } from '@/modules/utils/modulesDiff'
import type { CharacterModules } from '@/types'

describe('isConfigsEqual', () => {
	it('should return true if both configs are undefined', () => {
		expect(isConfigsEqual(undefined, undefined)).toBe(true)
	})

	it('should return false if one config is undefined and the other is an object', () => {
		expect(isConfigsEqual({ a: 1 }, undefined)).toBe(false)
		expect(isConfigsEqual(undefined, { a: 1 })).toBe(false)
	})

	it('should return true for two empty objects', () => {
		expect(isConfigsEqual({}, {})).toBe(true)
	})

	it('should return true for two identical objects', () => {
		const configA = { a: 1, b: 2 }
		const configB = { a: 1, b: 2 }
		expect(isConfigsEqual(configA, configB)).toBe(true)
	})

	it('should return true for two objects with the same keys in a different order', () => {
		const configA = { a: 1, b: 2 }
		const configB = { b: 2, a: 1 }
		expect(isConfigsEqual(configA, configB)).toBe(true)
	})

	it('should return true for nested objects that are identical', () => {
		const configA = { nested: { x: 10, y: 20 } }
		const configB = { nested: { x: 10, y: 20 } }
		expect(isConfigsEqual(configA, configB)).toBe(true)
	})
})

describe('modulesDiff', () => {
	it('should return empty instructions when both old and new modules are empty', () => {
		const oldModules: CharacterModules = {}
		const newModules: CharacterModules = {}

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.install).toEqual({})
		expect(diff.uninstall).toEqual({})
		expect(diff.reconfigure).toEqual({})
	})

	it('should mark all modules for installation when old modules are empty', () => {
		const oldModules: CharacterModules = {}
		const newModules: CharacterModules = {
			mod1: { version: '1.0', config: { a: 1 } },
			mod2: { version: '2.0' }
		}

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.install).toEqual(newModules)
		expect(diff.uninstall).toEqual({})
		expect(diff.reconfigure).toEqual({})
	})

	it('should mark all modules for uninstallation when new modules are empty', () => {
		const oldModules: CharacterModules = {
			mod1: { version: '1.0', config: { a: 1 } },
			mod2: { version: '2.0' }
		}
		const newModules: CharacterModules = {}

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.uninstall).toEqual(oldModules)
		expect(diff.install).toEqual({})
		expect(diff.reconfigure).toEqual({})
	})

	it('should not mark modules as updated if they exist in both with identical configs', () => {
		const moduleData = { version: '1.0', config: { a: 1 } }
		const oldModules: CharacterModules = { mod1: moduleData }
		const newModules: CharacterModules = { mod1: { version: '1.0', config: { a: 1 } } }

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.install).toEqual({})
		expect(diff.uninstall).toEqual({})
		expect(diff.reconfigure).toEqual({})
	})

	it('should mark modules for reconfiguration when the config has changed', () => {
		const oldModules: CharacterModules = { mod1: { version: '1.0', config: { a: 1 } } }
		const newModules: CharacterModules = { mod1: { version: '1.0', config: { a: 2 } } }

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.reconfigure).toEqual({ mod1: { version: '1.0', config: { a: 2 } } })
		expect(diff.install).toEqual({})
		expect(diff.uninstall).toEqual({})
	})

	it('should mark a module for reconfiguration if one config is undefined and the other is defined', () => {
		const oldModules: CharacterModules = { mod1: { version: '1.0', config: undefined } }
		const newModules: CharacterModules = { mod1: { version: '1.0', config: { a: 1 } } }

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.reconfigure).toEqual({ mod1: { version: '1.0', config: { a: 1 } } })
	})

	it('should correctly determine install, uninstall, and reconfigure in a mixed scenario', () => {
		const oldModules: CharacterModules = {
			mod1: { version: '1.0', config: { a: 1 } },
			mod2: { version: '2.0', config: { b: 2 } },
			mod3: { version: '3.0', config: { c: 3 } }
		}

		const newModules: CharacterModules = {
			// mod1 is removed → should be uninstalled
			mod2: { version: '2.0', config: { b: 2 } }, // unchanged
			mod3: { version: '3.0', config: { c: 4 } }, // config changed → reconfigure
			mod4: { version: '4.0', config: { d: 4 } } // new module → install
		}

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.uninstall).toEqual({ mod1: { version: '1.0', config: { a: 1 } } })
		expect(diff.install).toEqual({ mod4: { version: '4.0', config: { d: 4 } } })
		expect(diff.reconfigure).toEqual({ mod3: { version: '3.0', config: { c: 4 } } })
	})

	it('should not mark a module for reconfiguration if only the version changes but the config remains equal', () => {
		// Since the function only checks the config, a version change alone is ignored.
		const oldModules: CharacterModules = { mod1: { version: '1.0', config: { a: 1 } } }
		const newModules: CharacterModules = { mod1: { version: '1.1', config: { a: 1 } } }

		const diff = modulesDiff(oldModules, newModules)

		expect(diff.install).toEqual({})
		expect(diff.uninstall).toEqual({})
		expect(diff.reconfigure).toEqual({})
	})
})
