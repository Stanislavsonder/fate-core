import type { FateModuleConfigOption, FateModuleConfigGroup, FateModuleConfig } from '@/modules/utils/types'
import skills from './skills'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from '../manifest.json'

const groups: FateModuleConfigGroup[] = [
	signRecord(
		{
			id: 'custom-skills',
			name: 't.config.customSkills.name',
			description: 't.config.customSkills.groupDescription'
		},
		manifest.id
	),
	...skills.map(skill => {
		return {
			id: skill.id,
			name: skill.name,
			description: skill.description
		}
	})
]

const options: FateModuleConfigOption[] = [
	{
		id: 'custom-skills',
		groupId: 'custom-skills',
		name: 't.config.customSkills.name',
		type: 'custom-list',
		default: [],
		itemTemplate: {
			fields: [
				{
					id: 'id',
					name: 't.config.customSkills.id',
					type: 'string',
					default: ''
				},
				{
					id: 'name',
					name: 't.config.customSkills.skillName',
					type: 'string',
					default: ''
				},
				{
					id: 'description',
					name: 't.config.customSkills.description',
					type: 'string',
					default: ''
				},
				{
					id: 'overcome',
					name: 't.config.overcome.name',
					type: 'boolean',
					default: true
				},
				{
					id: 'advantage',
					name: 't.config.advantage.name',
					type: 'boolean',
					default: true
				},
				{
					id: 'attack',
					name: 't.config.attack.name',
					type: 'boolean',
					default: true
				},
				{
					id: 'defend',
					name: 't.config.defend.name',
					type: 'boolean',
					default: true
				}
			]
		}
	},
	...(skills
		.map(skill => {
			return [
				{
					id: skill.id + '-enabled',
					groupId: skill.id,
					name: 't.config.enabled.name',
					tooltip: 't.config.enabled.tooltip',
					type: 'boolean',
					default: true
				},
				{
					id: skill.id + '-overcome',
					groupId: skill.id,
					name: 't.config.overcome.name',
					tooltip: 't.config.overcome.tooltip',
					type: 'boolean',
					default: skill.usage.overcome
				},
				{
					id: skill.id + '-advantage',
					groupId: skill.id,
					name: 't.config.advantage.name',
					tooltip: 't.config.advantage.tooltip',
					type: 'boolean',
					default: skill.usage.advantage
				},
				{
					id: skill.id + '-attack',
					groupId: skill.id,
					name: 't.config.attack.name',
					tooltip: 't.config.attack.tooltip',
					type: 'boolean',
					default: skill.usage.attack
				},
				{
					id: skill.id + '-defend',
					groupId: skill.id,
					name: 't.config.defend.name',
					tooltip: 't.config.defend.tooltip',
					type: 'boolean',
					default: skill.usage.defend
				}
			]
		})
		.flat() as FateModuleConfigOption[])
]

const config: FateModuleConfig = {
	groups,
	options: signRecord(options, manifest.id)
}

export default config
