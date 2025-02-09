import { type FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import config from './src/config'
import components from './src/components'
import constants from './src/constants'
import { onInstall, onUninstall, onReconfigure } from './src/actions'
import { signRecord } from '@/modules/utils/localizationSigners'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	config,
	constants,
	components,
	onInstall,
	onUninstall,
	onReconfigure
}

export default MODULE
