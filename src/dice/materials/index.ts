import type { Material } from 'three'

export class DiceMaterial {
	constructor(
		public readonly name: string,
		public readonly faceMaterial: Material,
		public readonly symbolMaterial: Material,
		public readonly previewColor: string
	) {}
}
