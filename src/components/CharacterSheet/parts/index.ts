import type { FateModuleComponent } from '@/modules/utils/types'
import Identity from './Identity/Identity.vue'
import Consequences from './Consequences/Consequences.vue'

export default [
	{
		id: 'identity',
		component: Identity,
		order: 100
	},
	{
		id: 'consequences',
		component: Consequences,
		order: 600
	}
] as FateModuleComponent[]
