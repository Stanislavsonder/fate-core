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

function adjustSkillsList(config: Record<string, unknown>): Skill[] {
	let skillsCopy = clone(skills)
	skillsCopy = skillsCopy.filter(skill => {
		const skillConfig = getSkillConfigOptions(skill.id, config as Record<string, boolean | undefined>)
		return skillConfig.enabled !== false
	})
	skillsCopy.forEach(skill => {
		const skillConfig = getSkillConfigOptions(skill.id, config as Record<string, boolean | undefined>)
		skill.usage.overcome = skillConfig.overcome ?? skill.usage.overcome
		skill.usage.advantage = skillConfig.advantage ?? skill.usage.advantage
		skill.usage.attack = skillConfig.attack ?? skill.usage.attack
		skill.usage.defend = skillConfig.defend ?? skill.usage.defend
	})

	// Process custom skills
	const customSkills = (config['custom-skills'] as Array<Record<string, unknown>>) || []

	// Create a map to group fields by skill ID
	const skillsMap = new Map<string, Record<string, unknown>>()

	// First pass: identify all skill IDs and group fields
	const newCustomSkills: Skill[] = customSkills.map(customSkill => {
		return {
			id: `custom-${customSkill.id}`,
			name: customSkill.name as string,
			description: customSkill.description as string,
			usage: {
				overcome: customSkill.overcome as boolean,
				advantage: customSkill.advantage as boolean,
				attack: customSkill.attack as boolean,
				defend: customSkill.defend as boolean
			}
		}
	})

	// Second pass: create skill objects from the grouped fields
	skillsMap.forEach((fieldMap, skillId) => {
		// Get the skill information from the field map
		const skillName = fieldMap[`${skillId}-name`] as string
		const skillDescription = fieldMap[`${skillId}-description`] as string

		// Skip if the skill name is empty
		if (!skillName) return

		// Generate a unique ID for the custom skill
		const uniqueSkillId = `custom-${skillId}`

		// Check if skill with this ID already exists
		if (skillsCopy.some(s => s.id === uniqueSkillId)) return

		// Get usage options
		const overcome = (fieldMap[`${skillId}-overcome`] as boolean) ?? true
		const advantage = (fieldMap[`${skillId}-advantage`] as boolean) ?? true
		const attack = (fieldMap[`${skillId}-attack`] as boolean) ?? true
		const defend = (fieldMap[`${skillId}-defend`] as boolean) ?? true

		// Create a new skill
		const newSkill: Skill = {
			id: uniqueSkillId,
			name: skillName,
			description: skillDescription || '',
			usage: {
				overcome,
				advantage,
				attack,
				defend
			}
		}

		skillsCopy.push(newSkill)
	})

	return [...skillsCopy, ...newCustomSkills]
}

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	let skillsCopy = clone(skills)

	// Filter and change per config
	const config = character._modules[manifest.id]?.config

	if (config) {
		skillsCopy = adjustSkillsList(config as Record<string, unknown>)
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
	// Get custom skills
	const config = character._modules[manifest.id]?.config || {}
	let skillsCopy = clone(skills)
	if (config) {
		skillsCopy = adjustSkillsList(config as Record<string, unknown>)
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
	for (const stunt of character.stunts || []) {
		if (stunt.skillId && !context.shared['sonder@core-skills']?.skills.has(stunt.skillId)) {
			stunt.skillId = undefined
		}
	}
}
