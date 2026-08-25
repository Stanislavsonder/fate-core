import type { Character, FateContext } from '@/types'
import semver from 'semver'
import { version as appVersion } from '../../../package.json'
import { showErrorToast, showSuccessToast } from '@/utils/helpers/toast'
import PATCHES from '@/patches'
import { getPatches } from '@/utils/helpers/getPatches'

export async function updateApplication(context: FateContext, character: Character): Promise<boolean> {
	if (!character._version) {
		character._version = '0.0.0'
	}

	if (semver.lt(character._version, appVersion)) {
		const patches = getPatches(PATCHES, character._version)

		if (patches.length > 0) {
			const incompatiblePatch = patches.find(patch => patch.incompatible)
			if (incompatiblePatch) {
				showErrorToast(incompatiblePatch.note || '')
				return false
			}

			let notes = ''
			for (const patch of patches) {
				await patch.action(context, character)
				notes += patch.note || ''
			}
			showSuccessToast(notes)
		} else {
			showSuccessToast('character.updated', { from: character._version, to: appVersion })
		}
	}
	character._version = appVersion
	return true
}
