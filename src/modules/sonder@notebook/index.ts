import type { FateModuleManifest } from '@/modules/utils/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from './manifest.json'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

export default {
	...signRecord(manifest, manifest.id),
	components,
	onInstall,
	onReconfigure,
	onUninstall
} as FateModuleManifest
