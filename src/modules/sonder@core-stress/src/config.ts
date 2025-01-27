import { FateModuleConfigOption } from '@/modules/utils/types'
import manifest from '../manifest.json'
import { signRecord } from '@/modules/utils/localizationSigners'

const options: FateModuleConfigOption[] = signRecord(
	[
		{
			id: `${manifest.id}.physical-enabled`,
			name: 't.config.physical.enabled.name',
			type: 'boolean',
			default: true
		},
		{
			id: `${manifest.id}.mental-enabled`,
			name: 't.config.mental.enabled.name',
			type: 'boolean',
			default: true
		}
	],
	manifest.id
)

export default {
	options,
	groups: []
}
