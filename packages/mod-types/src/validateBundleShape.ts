import type { FateModBundle, FateModCapability } from './bundle'

const LIFECYCLE_FNS = ['onInstall', 'onUninstall', 'onReconfigure'] as const

/**
 * Cheap structural checks run on a freshly `import()`ed external bundle before
 * anything (assembleMod, translations, the character sheet) trusts its shape.
 * Throws a descriptive error on the first violation found — the app's loader
 * catches it and quarantines the mod rather than letting a malformed bundle
 * crash the app; the registry's CI smoke-load check runs the exact same
 * function so the two never drift.
 */
export function validateBundleShape(bundle: unknown, capabilities: FateModCapability[] | undefined): asserts bundle is FateModBundle {
	if (!bundle || typeof bundle !== 'object') {
		throw new Error('bundle default export must be an object')
	}

	const b = bundle as Record<string, unknown>

	if (capabilities?.includes('sheetComponents') && b.components !== undefined) {
		if (!Array.isArray(b.components)) {
			throw new Error('bundle.components must be an array')
		}
		b.components.forEach((component, index) => {
			const c = component as Record<string, unknown> | null
			if (!c || typeof c !== 'object' || typeof c.id !== 'string' || typeof c.order !== 'number' || !c.component) {
				throw new Error(`bundle.components[${index}] must be { id: string, component, order: number }`)
			}
		})
	}

	for (const fn of LIFECYCLE_FNS) {
		if (b[fn] !== undefined && typeof b[fn] !== 'function') {
			throw new Error(`bundle.${fn} must be a function`)
		}
	}

	if (b.patches !== undefined) {
		if (!Array.isArray(b.patches)) {
			throw new Error('bundle.patches must be an array')
		}
		b.patches.forEach((patch, index) => {
			const p = patch as Record<string, unknown> | null
			if (!p || typeof p !== 'object' || typeof p.version !== 'string' || typeof p.action !== 'function') {
				throw new Error(`bundle.patches[${index}] must be { version: string, action: function }`)
			}
		})
	}

	if (capabilities?.includes('theme') && b.theme !== undefined) {
		const theme = b.theme as Record<string, unknown> | null
		if (!theme || typeof theme.css !== 'string') {
			throw new Error('bundle.theme.css must be a string')
		}
	}
}
