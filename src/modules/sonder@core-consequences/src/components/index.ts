import type { FateModuleComponent } from '@/modules/utils/types'
import Consequences from '@/modules/sonder@core-consequences/src/components/Consequences.vue'

export default [
	{
		id: 'consequences',
		component: Consequences,
		order: 600
	}
] as FateModuleComponent[]
