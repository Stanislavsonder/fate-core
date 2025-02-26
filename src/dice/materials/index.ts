import type * as THREE from 'three'

export class DiceMaterial {
	constructor(
		public readonly name: string,
		public readonly faceMaterial: THREE.MeshStandardMaterial,
		public readonly symbolMaterial: THREE.MeshStandardMaterial,
		public readonly previewColor: string
	) {}
}
