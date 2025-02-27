import Modules from '@/modules'
import type { FateContext, Character } from '@/types'
import semver from 'semver'
import { getPatches } from '@/utils/helpers/getPatches'
import { showErrorToast, showSuccessToast, showWarningToast } from '@/utils/helpers/toast'
import i18n from '@/i18n'

const { t } = i18n.global

export async function updateModules(context: FateContext, character: Character): Promise<boolean> {
	try {
		for (const [id, module] of Object.entries(character._modules)) {
			const moduleManifest = Modules.get(id)

			if (!moduleManifest) {
				showErrorToast(`modules.notFound`, { module: id })
				delete character._modules[id]
				continue
			}

			const latestVersion = moduleManifest.version
			const installedVersion = module.version

			if (installedVersion && semver.neq(installedVersion, latestVersion)) {
				const patches = getPatches(moduleManifest.patches || [], installedVersion)

				if (patches.length > 0) {
					let notes = ''
					for (const patch of patches) {
						await patch.action?.(context, character)

						if (patch.incompatible) {
							showWarningToast(`modules.incompatibleVersion`, { module: t(moduleManifest.name), version: patch.version })
							delete character._modules[id]
							break
						}

						notes += patch.note || ''
					}

					notes && showSuccessToast(notes)
				}

				context.modules[id] = {
					...context.modules[id],
					version: latestVersion
				}

				character._modules[id] = {
					...character._modules[id],
					version: latestVersion
				}

				showSuccessToast(`modules.updated`, { module: t(moduleManifest.name), version: latestVersion })
			}
		}
	} catch (error) {
		showErrorToast(`Error updating modules: ${error}`)
		return false
	}

	return true
}
