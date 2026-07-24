import type { FateModuleManifest } from '@/modules/utils/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from './manifest.json'
import constants from './src/constants'
import templates from './src/templates'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

// Don't forget to update manifest.json and import file in modules index file!
export default {
	...signRecord(manifest, manifest.id),
	constants,
	components,
	templates,
	onInstall,
	onReconfigure,
	onUninstall
} as FateModuleManifest
