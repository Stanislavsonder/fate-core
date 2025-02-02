import { type FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import translations from './translations'
import config from './src/config'
import { onInstall, onUninstall, onReconfigure } from './src/actions'
import { signRecord } from '@/modules/utils/localizationSigners'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	translations,
	config,
	onInstall,
	onUninstall,
	onReconfigure
}

export default MODULE
