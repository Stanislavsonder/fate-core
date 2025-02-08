import type { Character, FateContext } from '@/types'
import skills from './skills'
import { type Skill } from '@/types'
import { clone } from '@/utils/helpers/clone'
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
	let skillsCopy = clone(skills)

	// Filter and change per config
	const config = character._modules[manifest.id]?.config
	if (config) {
		skillsCopy = adjustSkillsList(config as Record<string, boolean | undefined>)
	}

	skillsCopy.forEach(skill => {
		context.skills.set(skill._id, skill)
	})

	// Double check if the character has the skills object
	if (character && !character.skills) {
		character.skills = {}
	}
}

export function onUninstall(context: FateContext, character: Character): Promise<void> | void {
	// Remove module skills from the context
	skills.forEach(skill => {
		context.skills.delete(skill._id)
	})

	// Remove module skills from the character
	const characterSkills = Object.keys(character.skills)
	for (const id of characterSkills) {
		if (!context.skills.has(id)) {
			delete character.skills[id]
		}
	}

	// Remove skills if used in stunts
	for (const stunt of character.stunts) {
		if (stunt.skillId && !context.skills.has(stunt.skillId)) {
			stunt.skillId = undefined
		}
	}
}

export function onReconfigure(context: FateContext, character: Character): Promise<void> | void {
	// Update character skills with the new config
	const characterSkills = Object.entries(character.skills)
	const config = character._modules[manifest.id]?.config
	const newSkills = characterSkills.filter(skill => {
		const skillConfig = getSkillConfigOptions(skill[0], config as Record<string, boolean | undefined>)
		return skillConfig.enabled !== false
	})
	character.skills = Object.fromEntries(newSkills)

	// Update context skills with the new config
	let skillsCopy = clone(skills)
	if (config) {
		skillsCopy = adjustSkillsList(config as Record<string, boolean | undefined>)
	}

	context.skills.forEach((_, id) => {
		if (!skillsCopy.find(s => s._id === id)) {
			context.skills.delete(id)
		}
	})
	skillsCopy.forEach(skill => {
		context.skills.set(skill._id, skill)
	})

	// Remove skills if used in stunts
	for (const stunt of character.stunts) {
		if (stunt.skillId && !context.skills.has(stunt.skillId)) {
			stunt.skillId = undefined
		}
	}
}
