export type Character = {
	name: string
	race: string
	image: string
	tokens: {
		current: number
		refresh: number
	}
	description: string
	aspects: CharacterAspect[]
	skills: {
		[key: string]: number
	}
	stunts: Stunt[]
	stress: Stress[]
	consequences: Consequence[]
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

export type Skill = {
	name: string
	description: string
	usage: {
		attack: boolean
		defend: boolean
		overcome: boolean
		advantage: boolean
	}
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
	count: number
	description: string
	disabled: boolean
}

export type Inventory = {}

export type Game = {}

export type Scene = {}

export type GameSetting = {}

export type Validator = (value: string | number) => string | null | undefined
