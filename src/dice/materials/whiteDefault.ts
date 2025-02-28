import { DiceMaterial } from './index'
import * as THREE from 'three'

const whiteDefault = new DiceMaterial(
	'white',
	new THREE.MeshStandardMaterial({ color: 0xffffff }),
	new THREE.MeshStandardMaterial({ color: 0x000000 }),
	'#ffffff'
)

export default whiteDefault
