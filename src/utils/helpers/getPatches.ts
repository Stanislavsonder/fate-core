import type { FatePatch } from '@/types'
import semver from 'semver'

export function getPatches(patches: FatePatch[], fromVersion: string): FatePatch[] {
	// Filter patches that have a version greater than the provided fromVersion.
	const applicablePatches = patches.filter(patch => semver.gt(patch.version, fromVersion))

	if (applicablePatches.length === 0) {
		return []
	}

	// Sort the filtered patches in ascending order based on their version.
	applicablePatches.sort((a, b) => semver.compare(a.version, b.version))

	return applicablePatches
}
