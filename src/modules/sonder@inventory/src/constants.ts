import type { FateConstants } from '@/types'

const constants: Pick<FateConstants, 'COLORS_OPTIONS' | 'MAX_ITEM_QUANTITY'> = {
	// prettier-ignore
	COLORS_OPTIONS: [
		'#ffc400', // Gold
		'#D32F2F', // Red 700
		'#1976D2', // Blue 700
		'#388E3C', // Green 700
		'#7B1FA2', // Purple 700
		'#5D4037', // Brown 700
		'#00796B', // Teal 700
	],
	MAX_ITEM_QUANTITY: 1_000_000_000
}

export default constants
