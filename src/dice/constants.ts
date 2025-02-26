import type { DiceMaterial } from './materials'
import blackDefault from './materials/blackDefault'
import whiteDefault from './materials/whiteDefault'
import type { DiceConstructor } from './shapes'
import FudgeDice from './shapes/fudge/fudge'
import D20Dice from './shapes/d20/d20'
import type { DiceSceneConfig } from './types'

// Scene constants
export const SCENE_HEIGHT = 20
export const DICE_SEGMENTS = 20
export const DICE_RADIUS = 0.7
export const DICE_MASS = 2

// Physics constants
export const RESTITUTION = 0.3
export const COLLISION_VELOCITY_THRESHOLD = 1.5
export const MIN_IMPULSE = 5
export const MAX_DICE_VELOCITY = 40

// Motion constants
export const ACCEL_THRESHOLD = 8
export const SHAKE_COOLDOWN_TIME = 300
export const COLLISION_COOLDOWN = 200

// Dice rolling constants
export const VELOCITY_THRESHOLD_FOR_STOPPED = 0.05
export const ANGULAR_VELOCITY_THRESHOLD_FOR_STOPPED = 0.05
export const RESULT_CHECK_DELAY = 500

// Configuration limits
export const MIN_NUMBER_OF_DICE = 1
export const MAX_NUMBER_OF_DICE = 4 * 4
export const MIN_GRAVITY = 5
export const MAX_GRAVITY = 100
export const MIN_SCALE = 4
export const MAX_SCALE = 16
export const MIN_FORCE = 10
export const MAX_FORCE = 100

export const DICE_SHAPES: Map<string, DiceConstructor> = new Map([
	[FudgeDice.name, FudgeDice],
	[D20Dice.name, D20Dice]
] as Array<[string, DiceConstructor]>)

export const DICE_MATERIALS: Map<string, DiceMaterial> = new Map([
	[whiteDefault.name, whiteDefault],
	[blackDefault.name, blackDefault]
])

export const DEFAULT_DICE_SCENE_CONFIG: DiceSceneConfig = {
	numberOfDice: 4,
	gravity: 25,
	scale: 12,
	force: 50,
	shake: true,
	haptic: true,
	showResult: true,
	dice: {
		shape: FudgeDice.name,
		material: 'white'
	}
}

export const D20_DICE_SCENE_CONFIG: DiceSceneConfig = {
	numberOfDice: 1,
	gravity: 25,
	scale: 12,
	force: 50,
	shake: true,
	haptic: true,
	showResult: true,
	dice: {
		shape: D20Dice.name,
		material: 'white'
	}
}
