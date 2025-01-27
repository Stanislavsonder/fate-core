import { FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import { onInstall, onUninstall, onUpdate } from './src/actions'
import translations from './translations'
import config from './src/config'
import { signRecord } from '@/modules/utils/localizationSigners'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	translations,
	config,
	onInstall,
	onUpdate,
	onUninstall
}

export default MODULE
