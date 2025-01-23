import { Character, FateContext } from '@/types'
import skills from './skills'

export function onInstall(context: FateContext, character: Character): Promise<void> | void {
	// Add module skills to the context
	context.skills.enabled = true

	skills.forEach(skill => {
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
