import type { FateModuleComponent } from '@/modules/utils/types'
import Notebook from './Notebook.vue'

export default [
	{
		id: 'notebook',
		component: Notebook,
		order: 1000
	}
] as FateModuleComponent[]
