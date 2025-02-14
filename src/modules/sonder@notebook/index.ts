import type { FateModuleManifest } from '@/modules/utils/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from './manifest.json'
import config from './src/config'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

export default {
	...signRecord(manifest, manifest.id),
	config,
	components,
	onInstall,
	onReconfigure,
	onUninstall
} as FateModuleManifest
