import Inventory from './Inventory.vue'
import type { FateModuleComponent } from '@/modules/utils/types'
import { markRaw } from 'vue'

export default [
	{
		id: 'inventory',
		component: markRaw(Inventory),
		order: 500
	}
] as FateModuleComponent[]
