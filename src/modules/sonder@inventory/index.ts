import type { FateModuleManifest } from '@/modules/utils/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from './manifest.json'
import constants from './src/constants'
import templates from './src/templates'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

export default {
	...signRecord(manifest, manifest.id),
	constants,
	templates,
	components,
	onInstall,
	onReconfigure,
	onUninstall
} as FateModuleManifest
