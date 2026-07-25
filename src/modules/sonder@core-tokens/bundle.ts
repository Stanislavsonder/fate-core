import { defineFateMod } from '@fate-core/mod-types'
import constants from './src/constants'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

export default defineFateMod({
	constants,
	components,
	onInstall,
	onReconfigure,
	onUninstall
})
