import { DiceMaterial } from './index'
import * as THREE from 'three'

const blackDefault = new DiceMaterial(
	'black',
	new THREE.MeshStandardMaterial({ color: 0x000000 }),
	new THREE.MeshStandardMaterial({ color: 0xffffff }),
	'#000000'
)

export default blackDefault
