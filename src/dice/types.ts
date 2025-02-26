export interface DiceFaceConfig {
	values: Record<string, number>
	sides: number
}

export type DiceResult = {
	value: number
	values: number[]
	text: string
	color: 'success' | 'danger' | 'medium'
}

export type DiceSceneConfig = {
	numberOfDice: number
	gravity: number
	scale: number
	force: number
	shake: boolean
	haptic: boolean
	showResult: boolean
	dice: {
		shape: string
		material: string
	}
}

export type DiceSymbol = '+' | '-' | '1' | '2' | '3' | '4'

export type SymbolParam = {
	symbol: DiceSymbol | string
	position: [number, number, number]
	rotation: [number, number, number]
	scale?: [number, number, number]
}

export type FaceUpAmount = {
	face: string
	value: number
	amount: number
}
