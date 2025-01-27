import { Character, FateContext } from '@/types'
import skills from './skills'
import { type Skill } from '@/types'
import { clone } from '@/utils'
import manifest from '../manifest.json'

function getSkillConfigOptions(
	skillId: string,
	config: Record<string, boolean | undefined>
): {
	enabled?: boolean
	overcome?: boolean
	advantage?: boolean
	attack?: boolean
	defend?: boolean
} {
	return {
		enabled: config[`${skillId}-enabled`],
		overcome: config[`${skillId}-overcome`],
		advantage: config[`${skillId}-advantage`],
		attack: config[`${skillId}-attack`],
		defend: config[`${skillId}-defend`]
	}
}

function adjustSkillsList(config: Record<string, boolean | undefined>): Skill[] {
	let skillsCopy = clone(skills)
	skillsCopy = skillsCopy.filter(skill => {
		const skillConfig = getSkillConfigOptions(skill._id, config)
		return skillConfig.enabled !== false
	})
	skillsCopy.forEach(skill => {
		const skillConfig = getSkillConfigOptions(skill._id, config)
		skill.usage.overcome = skillConfig.overcome ?? skill.usage.overcome
		skill.usage.advantage = skillConfig.advantage ?? skill.usage.advantage
		skill.usage.attack = skillConfig.attack ?? skill.usage.attack
		skill.usage.defend = skillConfig.defend ?? skill.usage.defend
	})
	return skillsCopy
}

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	// Add module skills to the context
	context.skills.enabled = true

	let skillsCopy = clone(skills)

	// Filter and change per config
	const config = character._modules[manifest.id]?.config
	if (config) {
		skillsCopy = adjustSkillsList(config as Record<string, boolean | undefined>)
	}

	skillsCopy.forEach(skill => {
		context.skills.map.set(skill._id, skill)
		context.skills.list.push(skill)
	})

	// Double check if the character has the skills object
	if (character && !character.skills) {
		character.skills = {}
	}
}

export function onUninstall(context: FateContext, character: Character): Promise<void> | void {
	// Remove module skills from the context
	skills.forEach(skill => {
		context.skills.map.delete(skill._id)
		context.skills.list = context.skills.list.filter(s => s._id !== skill._id)
	})

	// Disable skills if there are no more skills from other modules
	if (context.skills.list.length === 0) {
		context.skills.enabled = false
	}

	// Remove module skills from the character
	const characterSkills = Object.keys(character.skills)
	for (const skill of characterSkills) {
		if (skills.find(s => s._id === skill)) {
			delete character.skills[skill]
		}
	}
}

export function onUpdate(context: FateContext, character: Character): Promise<void> | void {
	// Update character skills with the new config
	const characterSkills = Object.entries(character.skills)
	const config = character._modules[manifest.id]?.config
	characterSkills.filter(skill => {
		const skillConfig = getSkillConfigOptions(skill[0], config as Record<string, boolean | undefined>)
		return skillConfig.enabled !== false
	})
	character.skills = Object.fromEntries(characterSkills)

	// Update context skills with the new config
	let skillsCopy = clone(skills)
	if (config) {
		skillsCopy = adjustSkillsList(config as Record<string, boolean | undefined>)
	}

	context.skills.list = context.skills.list.filter(skill => {
		return skill._module.name !== manifest.id
	})
	context.skills.list.push(...skillsCopy)

	context.skills.map.clear()
	skillsCopy.forEach(skill => {
		context.skills.map.set(skill._id, skill)
	})
}
