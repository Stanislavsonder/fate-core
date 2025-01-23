import { FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json' with { type: 'json' }
import { onInstall, onUninstall } from './src/actions'
import translations from './translations'
import { signRecord } from '@/modules/utils/localizationSigners'

const MODULE: FateModuleManifest = {
	...signRecord(manifest, manifest.id),
	translations,
	onInstall,
	onUninstall
}

export default MODULE
