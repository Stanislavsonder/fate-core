import type { FateModuleComponent } from '@/modules/utils/types'
import Identity from './Identity/Identity.vue'

export default [
	{
		id: 'identity',
		component: Identity,
		order: 100
	}
] as FateModuleComponent[]
