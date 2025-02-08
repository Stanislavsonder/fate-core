import Inventory from './Inventory.vue'
import type { FateModuleComponent } from '@/modules/utils/types'

export default [
	{
		id: 'inventory',
		component: Inventory,
		order: 500
	}
] as FateModuleComponent[]
