import { DiceMaterial } from './index'
import * as THREE from 'three'

const blackDefault = new DiceMaterial(
	'black',
	new THREE.MeshStandardMaterial({ color: 0x313131 }),
	new THREE.MeshStandardMaterial({ color: 0xffffff }),
	'#313131'
)

export default blackDefault
