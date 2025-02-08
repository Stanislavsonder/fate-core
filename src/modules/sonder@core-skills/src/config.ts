import type { FateModuleConfigOption, FateModuleConfigGroup, FateModuleConfig } from '@/modules/utils/types'
import skills from './skills'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from '../manifest.json'

const groups: FateModuleConfigGroup[] = skills.map(skill => {
	return {
		id: skill._id,
		name: skill.name,
		description: skill.description
	}
})

const options: FateModuleConfigOption[] = skills
	.map(skill => {
		return [
			{
				id: skill._id + '-enabled',
				groupId: skill._id,
				name: 't.config.enabled.name',
				tooltip: 't.config.enabled.tooltip',
				type: 'boolean',
				default: true
			},
			{
				id: skill._id + '-overcome',
				groupId: skill._id,
				name: 't.config.overcome.name',
				tooltip: 't.config.overcome.tooltip',
				type: 'boolean',
				default: skill.usage.overcome
			},
			{
				id: skill._id + '-advantage',
				groupId: skill._id,
				name: 't.config.advantage.name',
				tooltip: 't.config.advantage.tooltip',
				type: 'boolean',
				default: skill.usage.advantage
			},
			{
				id: skill._id + '-attack',
				groupId: skill._id,
				name: 't.config.attack.name',
				tooltip: 't.config.attack.tooltip',
				type: 'boolean',
				default: skill.usage.attack
			},
			{
				id: skill._id + '-defend',
				groupId: skill._id,
				name: 't.config.defend.name',
				tooltip: 't.config.defend.tooltip',
				type: 'boolean',
				default: skill.usage.defend
			}
		]
	})
	.flat() as FateModuleConfigOption[]

const config: FateModuleConfig = {
	groups,
	options: signRecord(options, manifest.id)
}

export default config
