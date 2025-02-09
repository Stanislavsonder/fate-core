import type { FateModuleComponent } from '@/modules/utils/types'
import Identity from './Identity/Identity.vue'
import Aspects from './Aspects/Aspects.vue'
import Stunts from './Stunts/Stunts.vue'
import Consequences from './Consequences/Consequences.vue'
import Tokens from './Tokens/Tokens.vue'

export default [
	{
		id: 'identity',
		component: Identity,
		order: 100
	},
	{
		id: 'aspects',
		component: Aspects,
		order: 200
	},
	{
		id: 'stunts',
		component: Stunts,
		order: 400
	},
	{
		id: 'consequences',
		component: Consequences,
		order: 600
	},
	{
		id: 'tokens',
		component: Tokens,
		order: 700
	}
] as FateModuleComponent[]
