import type { FateModuleComponent } from '@/modules/utils/types'
import Notebook from './Notebook.vue'
import { markRaw } from 'vue'

export default [
	{
		id: 'notebook',
		component: markRaw(Notebook),
		order: 1000
	}
] as FateModuleComponent[]
