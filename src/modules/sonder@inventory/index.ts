import type { FateModuleManifest } from '@/modules/utils/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from './manifest.json'
import config from './src/config'
import constants from './src/constants'
import templates from './src/templates'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	config,
	constants,
	templates,
	components,
	onInstall,
	onReconfigure,
	onUninstall
}

export default MODULE
