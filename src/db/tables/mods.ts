import db from '../database'

export type StoredModSource = 'registry' | 'url' | 'dev'

export interface StoredMod {
	id: string
	version: string
	source: StoredModSource
	/** Disabled mods are not loaded on next launch but keep their stored data. */
	enabled: boolean
	/** The static manifest exactly as fetched. */
	manifestJson: string
	/** Full text of bundle.mjs. */
	bundleCode: string
	/** `{ [lang]: messages }` as fetched. */
	translationsJson: string
	/** SHA-256 of bundleCode. Pinned from the registry in Phase 3; computed at install time for 'url'/'dev'. */
	sha256: string
	/** Where it came from — registry artifact URL, user-provided URL, or dev server URL. */
	sourceUrl: string
	installedAt: number
	updatedAt: number
}

const mods = db.mods

export const modsService = {
	async getAllEnabled(): Promise<StoredMod[]> {
		const all = await mods.toArray()
		return all.filter(mod => mod.enabled)
	},
	async getAll(): Promise<StoredMod[]> {
		return mods.toArray()
	},
	async get(id: string): Promise<StoredMod | undefined> {
		return mods.get(id)
	},
	async put(row: StoredMod): Promise<string> {
		return mods.put(row)
	},
	async delete(id: string): Promise<void> {
		return mods.delete(id)
	},
	async setEnabled(id: string, enabled: boolean): Promise<void> {
		await mods.update(id, { enabled, updatedAt: Date.now() })
	}
}

export default mods
