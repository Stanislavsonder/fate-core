import { type FateModuleManifest } from '@/modules/utils/types'
import manifest from './manifest.json'
import components from './src/components'
import constants from './src/constants'
import { onInstall, onUninstall, onReconfigure } from './src/actions'
import { signRecord } from '@/modules/utils/localizationSigners'
import shared from './src/shared'

const MODULE = {
	...signRecord(manifest, manifest.id),
	constants,
	components,
	shared,
	onInstall,
	onUninstall,
	onReconfigure
} as FateModuleManifest

export default MODULE
