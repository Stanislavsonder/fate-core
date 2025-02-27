import type { FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import { onInstall, onUninstall, onReconfigure } from './src/actions'
import config from './src/config'
import components from './src/components'
import constants from './src/constants'
import { signRecord } from '@/modules/utils/localizationSigners'
import patches from './src/patches'
const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	config,
	components,
	constants,
	patches,
	onInstall,
	onReconfigure,
	onUninstall
}

export default MODULE
