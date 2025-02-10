import type { FateModuleConfig, FateModuleConfigGroup, FateModuleConfigOption } from '@/modules/utils/types'
import manifest from '../manifest.json'
import { signRecord } from '@/modules/utils/localizationSigners'
import constants from './constants'

const groups: FateModuleConfigGroup[] = signRecord([], manifest.id)

const options: FateModuleConfigOption[] = signRecord(
	[
		{
			id: 'max-tokens',
			name: 't.config.maxTokens.name',
			tooltip: 't.config.maxTokens.tooltip',
			type: 'number',
			default: constants.MAX_TOKENS,
			limits: {
				min: 1,
				max: 100
			}
		}
	],
	manifest.id
)

export default {
	options,
	groups
} as FateModuleConfig
