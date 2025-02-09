import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from '../manifest.json'
import type { Skill } from './types'

const skills: Skill[] = [
	{
		id: 't.athletics',
		name: 't.skills.athletics.name',
		description: 't.skills.athletics.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.rapport',
		name: 't.skills.rapport.name',
		description: 't.skills.rapport.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.notice',
		name: 't.skills.notice.name',
		description: 't.skills.notice.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.drive',
		name: 't.skills.drive.name',
		description: 't.skills.drive.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.will',
		name: 't.skills.will.name',
		description: 't.skills.will.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: false
		}
	},
	{
		id: 't.burglary',
		name: 't.skills.burglary.name',
		description: 't.skills.burglary.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.fight',
		name: 't.skills.fight.name',
		description: 't.skills.fight.description',
		usage: {
			attack: true,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.lore',
		name: 't.skills.lore.name',
		description: 't.skills.lore.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.contacts',
		name: 't.skills.contacts.name',
		description: 't.skills.contacts.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.deceive',
		name: 't.skills.deceive.name',
		description: 't.skills.deceive.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.provoke',
		name: 't.skills.provoke.name',
		description: 't.skills.provoke.description',
		usage: {
			attack: true,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.investigate',
		name: 't.skills.investigate.name',
		description: 't.skills.investigate.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.craft',
		name: 't.skills.craft.name',
		description: 't.skills.craft.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.resources',
		name: 't.skills.resources.name',
		description: 't.skills.resources.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.stealth',
		name: 't.skills.stealth.name',
		description: 't.skills.stealth.description',
		usage: {
			attack: false,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.shoot',
		name: 't.skills.shoot.name',
		description: 't.skills.shoot.description',
		usage: {
			attack: true,
			defend: false,
			overcome: true,
			advantage: true
		}
	},
	{
		id: 't.physique',
		name: 't.skills.physique.name',
		description: 't.skills.physique.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: false
		}
	},
	{
		id: 't.empathy',
		name: 't.skills.empathy.name',
		description: 't.skills.empathy.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	}
]

export default signRecord(skills, manifest.id)
