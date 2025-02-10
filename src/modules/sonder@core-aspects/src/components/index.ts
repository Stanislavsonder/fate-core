import type { FateModuleComponent } from '@/modules/utils/types'
import Aspects from './Aspects.vue'

export default [
	{
		id: 'aspects',
		component: Aspects,
		order: 200
	}
] as FateModuleComponent[]
