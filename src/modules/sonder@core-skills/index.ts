import { type FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import translations from './translations'
import config from './src/config'
import { onInstall, onUninstall, onUpdate } from './src/actions'
import { signRecord } from '@/modules/utils/localizationSigners'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	translations,
	config,
	onInstall,
	onUninstall,
	onUpdate
}

export default MODULE
