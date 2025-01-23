import { Stress } from '@/types'
import manifest from '../manifest.json'
import { signRecord } from '@/modules/utils/localizationSigners'

const _module: Stress['_module'] = {
	name: manifest.id,
	version: manifest.version
}

const boxes: Stress['boxes'] = [
	{
		count: 1,
		checked: false,
		disabled: false
	},
	{
		count: 2,
		checked: false,
		disabled: false
	},
	{
		count: 3,
		checked: false,
		disabled: true
	},
	{
		count: 4,
		checked: false,
		disabled: true
	}
]

const physical: Stress = {
	_module,
	_id: `${manifest.id}.physical`,
	name: 't.stress.physical.name',
	description: 't.stress.physical.description',
	boxes: [...boxes]
}

const mental: Stress = {
	_module,
	_id: `${manifest.id}.mental`,
	name: 't.stress.mental.name',
	description: 't.stress.mental.description',
	boxes: [...boxes]
}

export default signRecord([physical, mental], manifest.id)
