import type { FateModuleConfig, FateModuleConfigGroup, FateModuleConfigOption } from '@/modules/utils/types'
import manifest from '../manifest.json'
import { signRecord } from '@/modules/utils/localizationSigners'

const groups: FateModuleConfigGroup[] = signRecord([], manifest.id)

const options: FateModuleConfigOption[] = signRecord([], manifest.id)

export default {
	options,
	groups
} as FateModuleConfig
