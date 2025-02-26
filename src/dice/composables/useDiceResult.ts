import type { Dice } from '../shapes'
import type { DiceResult } from '../types'

/**
 * Calculates the total result from all dice
 */
export function calculateDiceResult(diceArray: Dice[]): DiceResult {
	return diceArray[0].formatResult(diceArray.map(dice => dice.getResult()))
}
