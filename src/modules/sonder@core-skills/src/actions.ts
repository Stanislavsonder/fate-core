import type { Character, FateContext } from '@/types'
import skills from './skills'
import { clone } from '@/utils/helpers/clone'
import manifest from '../manifest.json'
import type { Skill } from './types'

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
		const skillConfig = getSkillConfigOptions(skill.id, config)
		return skillConfig.enabled !== false
	})
	skillsCopy.forEach(skill => {
		const skillConfig = getSkillConfigOptions(skill.id, config)
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

	context.shared['sonder@core-skills'] = {
		skills: new Map<string, Skill>()
	}

	skillsCopy.forEach(skill => {
		context.shared['sonder@core-skills']?.skills.set(skill.id, skill)
	})

	// Double check if the character has the skills object
	character.skills = character.skills ?? {}
}

export function onUninstall(_context: FateContext, character: Character): Promise<void> | void {
	delete character.skills
}

export function onReconfigure(context: FateContext, character: Character): Promise<void> | void {
	// Update character skills with the new config
	const characterSkills = Object.entries(character.skills!)
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

	context.shared['sonder@core-skills']?.skills.forEach((_, id) => {
		if (!skillsCopy.find(s => s.id === id)) {
			context.shared['sonder@core-skills']!.skills.delete(id)
		}
	})
	skillsCopy.forEach(skill => {
		context.shared['sonder@core-skills']?.skills.set(skill.id, skill)
	})

	// Remove skills if used in stunts
	for (const stunt of character.stunts) {
		if (stunt.skillId && !context.shared['sonder@core-skills']?.skills.has(stunt.skillId)) {
			stunt.skillId = undefined
		}
	}
}
