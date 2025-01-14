export type Item = {
	name: string
	description?: string
	quantity: number
	icon: string
	iconColor?: string
}

export type Inventory = Item[]

export type Character = {
	_version?: string
	id?: string
	name: string
	race: string
	avatar?: string
	tokens: number
	description: string
	aspects: CharacterAspect[]
	skills: {
		[key: string]: number
	}
	stunts: Stunt[]
	stress: Stress[]
	consequences: Consequence[]
	inventory: Inventory
}

export enum CharacterAspectType {
	HighConcept = 'high-concept',
	Trouble = 'trouble',
	Consequence = 'consequence',
	Milestone = 'milestone',
	Other = 'other'
}

export type CharacterAspect = {
	name: string
	description: string
	type: CharacterAspectType
}

export type SkillUsageType = 'overcome' | 'advantage' | 'attack' | 'defend'

export type SkillUsage = {
	overcome: boolean
	advantage: boolean
	attack: boolean
	defend: boolean
}

export type Skill = {
	name: string
	usage: SkillUsage
}

export type Stunt = {
	name: string
	description: string
	skill: string
	priceInTokens: number
}

export type StressBox = {
	count: number
	checked: boolean
	disabled: boolean
}
export type Stress = {
	type: string
	boxes: StressBox[]
}

export enum ConsequenceLevel {
	Mild = 'mild',
	Moderate = 'moderate',
	Severe = 'severe'
}

export type Consequence = {
	level: ConsequenceLevel
	description: string
	disabled: boolean
}
