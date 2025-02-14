import type { FateModuleManifest } from '@/modules/utils/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from './manifest.json'
import config from './src/config'
import constants from './src/constants'
import components from './src/components'
import templates from './src/templates'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

export default {
	...signRecord(manifest, manifest.id),
	config,
	constants,
	templates,
	components,
	onInstall,
	onReconfigure,
	onUninstall
} as FateModuleManifest
