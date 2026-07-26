import { defineFateMod } from '@fate-core/mod-types'
import D6Dice from './src/d6'
import goldMaterial from './src/goldMaterial'

export default defineFateMod({
	dice: {
		shapes: [D6Dice],
		materials: [goldMaterial]
	}
})
