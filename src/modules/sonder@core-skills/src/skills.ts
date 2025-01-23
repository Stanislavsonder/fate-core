import { type Skill } from '@/types'
import { signRecord } from '@/modules/utils/localizationSigners'
import manifest from '../manifest.json' with { type: 'json' }

const _module: Skill['_module'] = {
	name: manifest.id,
	version: manifest.version
}

const skills: Skill[] = [
	{
		_id: 'athletics',
		_module,
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
		_id: 'rapport',
		_module,
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
		_id: 'notice',
		_module,
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
		_id: 'drive',
		_module,
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
		_id: 'will',
		_module,
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
		_id: 'burglary',
		_module,
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
		_id: 'fight',
		_module,
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
		_id: 'lore',
		_module,
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
		_id: 'contacts',
		_module,
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
		_id: 'deceive',
		_module,
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
		_id: 'provoke',
		_module,
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
		_id: 'investigate',
		_module,
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
		_id: 'craft',
		_module,
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
		_id: 'resources',
		_module,
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
		_id: 'stealth',
		_module,
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
		_id: 'shoot',
		_module,
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
		_id: 'physique',
		_module,
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
		_id: 'empathy',
		_module,
		name: 't.skills.empathy.name',
		description: 't.skills.empathy.description',
		usage: {
			attack: false,
			defend: true,
			overcome: true,
			advantage: true
		}
	}
].map(e => {
	e._id = `${manifest.id}.${e._id}`
	return e
})

export default signRecord(skills, manifest.id)
