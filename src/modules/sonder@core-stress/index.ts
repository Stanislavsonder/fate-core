import { FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import { onInstall, onUninstall, onReconfigure } from './src/actions'
import config from './src/config'
import { signRecord } from '@/modules/utils/localizationSigners'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	config,
	onInstall,
	onReconfigure,
	onUninstall
}

export default MODULE
