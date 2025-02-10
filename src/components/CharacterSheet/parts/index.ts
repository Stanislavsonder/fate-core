import type { FateModuleComponent } from '@/modules/utils/types'
import Identity from './Identity/Identity.vue'
import Aspects from './Aspects/Aspects.vue'
import Consequences from './Consequences/Consequences.vue'

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
		id: 'consequences',
		component: Consequences,
		order: 600
	}
] as FateModuleComponent[]
