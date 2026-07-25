import { defineFateMod } from '@fate-core/mod-types'
import components from './src/components'
import { onInstall, onReconfigure, onUninstall } from './src/actions'

export default defineFateMod({
	components,
	onInstall,
	onReconfigure,
	onUninstall
})
