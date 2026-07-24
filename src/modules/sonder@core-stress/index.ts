import type { FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import { onInstall, onUninstall, onReconfigure } from './src/actions'
import components from './src/components'
import constants from './src/constants'
import { signRecord } from '@/modules/utils/localizationSigners'
import patches from './src/patches'
const MODULE = {
	...signRecord(manifest, manifest.id),
	components,
	constants,
	patches,
	onInstall,
	onReconfigure,
	onUninstall
} as FateModuleManifest

export default MODULE
