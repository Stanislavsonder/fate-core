import type { Dice } from '../shapes'
import type { DiceResult } from '../types'

/**
 * Calculates the total result from all dice
 */
export function calculateDiceResult(diceArray: Dice[]): DiceResult {
	// Group dice by type and calculate sums for each type
	const resultsByType = new Map<string, number>()

	for (const dice of diceArray) {
		const value = dice.getResult()
		const currentTotal = resultsByType.get(dice.constructor.name) || 0
		resultsByType.set(dice.constructor.name, currentTotal + value)
	}

	// Sum all type totals for the final result
	let total = 0
	resultsByType.forEach(typeTotal => {
		total += typeTotal
	})

	return diceArray[0].formatResult(total)
}
