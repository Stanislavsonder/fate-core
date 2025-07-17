import { Dice } from '../index'
import type { DiceMaterial } from '../../materials'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import type { BoxGeometry, BufferGeometry, Group } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { DICE_MASS } from '../../constants'
import type { ICollisionEvent } from 'cannon'
import type { FaceUpAmount, DiceResult } from '../../types'
import d6Icon from './d6.svg'

function createDiceMesh(material: DiceMaterial, size: number, quality: number): Group {
	const diceGroup = new THREE.Group()

	const geometry = createRoundedBoxGeometry(size, size, size, quality, size / 10)
	applyPipDents(geometry, size)

	const outerMesh = new THREE.Mesh(geometry, material.faceMaterial)
	outerMesh.castShadow = true
	outerMesh.receiveShadow = true
	diceGroup.add(outerMesh)

	const pips = createPipMeshes(material, size)
	diceGroup.add(pips)

	return diceGroup
}

export function createRoundedBoxGeometry(width: number, height: number, depth: number, segments: number, edgeRadius: number): BufferGeometry {
	let boxGeometry: BoxGeometry | BufferGeometry = new THREE.BoxGeometry(width, height, depth, segments, segments, segments)

	const positionAttr = boxGeometry.attributes.position
	const subCubeHalfSize = 0.5 - edgeRadius

	for (let i = 0; i < positionAttr.count; i++) {
		let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i)
		const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize)

		const addition = new THREE.Vector3().subVectors(position, subCube)

		if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
			addition.normalize().multiplyScalar(edgeRadius)
			position = subCube.add(addition)
		} else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) {
			addition.z = 0
			addition.normalize().multiplyScalar(edgeRadius)
			position.x = subCube.x + addition.x
			position.y = subCube.y + addition.y
		} else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
			addition.y = 0
			addition.normalize().multiplyScalar(edgeRadius)
			position.x = subCube.x + addition.x
			position.z = subCube.z + addition.z
		} else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
			addition.x = 0
			addition.normalize().multiplyScalar(edgeRadius)
			position.y = subCube.y + addition.y
			position.z = subCube.z + addition.z
		}

		positionAttr.setXYZ(i, position.x, position.y, position.z)
	}

	boxGeometry.deleteAttribute('normal')
	boxGeometry.deleteAttribute('uv')
	boxGeometry = mergeVertices(boxGeometry)
	boxGeometry.computeVertexNormals()

	return boxGeometry
}

function applyPipDents(geometry: BufferGeometry, size: number): void {
	const radius = size * 0.12
	const depth = size * 0.08

	const offset = size * 0.2
	const patterns: Record<number, [number, number][]> = {
		1: [[0, 0]],
		2: [
			[-offset, offset],
			[offset, -offset]
		],
		3: [
			[-offset, offset],
			[0, 0],
			[offset, -offset]
		],
		4: [
			[-offset, offset],
			[-offset, -offset],
			[offset, offset],
			[offset, -offset]
		],
		5: [
			[-offset, offset],
			[-offset, -offset],
			[offset, offset],
			[offset, -offset],
			[0, 0]
		],
		6: [
			[-offset, offset],
			[-offset, 0],
			[-offset, -offset],
			[offset, offset],
			[offset, 0],
			[offset, -offset]
		]
	}

	const faces = [
		{ value: 3, axis: 'x', sign: 1 },
		{ value: 4, axis: 'x', sign: -1 },
		{ value: 2, axis: 'z', sign: 1 },
		{ value: 5, axis: 'z', sign: -1 },
		{ value: 1, axis: 'y', sign: 1 },
		{ value: 6, axis: 'y', sign: -1 }
	] as const

	const centers: THREE.Vector3[] = []
	faces.forEach(face => {
		patterns[face.value].forEach(([a, b]) => {
			const center = new THREE.Vector3()
			switch (face.axis) {
				case 'x':
					center.set(face.sign * size * 0.5 - face.sign * depth, a, b)
					break
				case 'y':
					center.set(a, face.sign * size * 0.5 - face.sign * depth, b)
					break
				case 'z':
					center.set(a, b, face.sign * size * 0.5 - face.sign * depth)
					break
			}
			centers.push(center)
		})
	})

	const position = geometry.attributes.position as THREE.BufferAttribute
	for (let i = 0; i < position.count; i++) {
		const vertex = new THREE.Vector3().fromBufferAttribute(position, i)
		centers.forEach(center => {
			const dist = vertex.distanceTo(center)
			if (dist < radius) {
				const dir = vertex.clone().sub(center).normalize()
				const strength = (1 - dist / radius) * depth
				vertex.addScaledVector(dir, -strength)
			}
		})
		position.setXYZ(i, vertex.x, vertex.y, vertex.z)
	}
	position.needsUpdate = true
	geometry.computeVertexNormals()
}

function createPipMeshes(material: DiceMaterial, size: number): Group {
	const group = new THREE.Group()
	const radius = size * 0.12 * 0.9
	const depth = size * 0.08
	const offset = size * 0.2

	const geometry = new THREE.CircleGeometry(radius, 16)
	const patterns: Record<number, [number, number][]> = {
		1: [[0, 0]],
		2: [
			[-offset, offset],
			[offset, -offset]
		],
		3: [
			[-offset, offset],
			[0, 0],
			[offset, -offset]
		],
		4: [
			[-offset, offset],
			[-offset, -offset],
			[offset, offset],
			[offset, -offset]
		],
		5: [
			[-offset, offset],
			[-offset, -offset],
			[offset, offset],
			[offset, -offset],
			[0, 0]
		],
		6: [
			[-offset, offset],
			[-offset, 0],
			[-offset, -offset],
			[offset, offset],
			[offset, 0],
			[offset, -offset]
		]
	}

	const faces = [
		{ value: 3, axis: 'x', sign: 1 },
		{ value: 4, axis: 'x', sign: -1 },
		{ value: 2, axis: 'z', sign: 1 },
		{ value: 5, axis: 'z', sign: -1 },
		{ value: 1, axis: 'y', sign: 1 },
		{ value: 6, axis: 'y', sign: -1 }
	] as const

	faces.forEach(face => {
		patterns[face.value].forEach(([a, b]) => {
			const pip = new THREE.Mesh(geometry, material.symbolMaterial)
			switch (face.axis) {
				case 'x':
					pip.position.set(face.sign * size * 0.5 - face.sign * depth * 0.5, a, b)
					pip.rotation.y = Math.PI / 2
					break
				case 'y':
					pip.position.set(a, face.sign * size * 0.5 - face.sign * depth * 0.5, b)
					pip.rotation.x = -Math.PI / 2
					break
				case 'z':
					pip.position.set(a, b, face.sign * size * 0.5 - face.sign * depth * 0.5)
					break
			}
			group.add(pip)
		})
	})

	return group
}

function createDiceBody(world: CANNON.World, onCollide: (event: ICollisionEvent) => void): CANNON.Body {
	const body = new CANNON.Body({
		mass: DICE_MASS,
		shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
		sleepTimeLimit: 0.2
	})

	body.collisionResponse = true
	body.collisionFilterGroup = 1
	body.collisionFilterMask = 1
	body.angularDamping = 0.3
	body.linearDamping = 0.3
	body.sleepSpeedLimit = 0.4
	body.sleepTimeLimit = 0.5
	body.allowSleep = true
	// @ts-ignore
	body.minForce = 0.05
	body.addEventListener('collide', onCollide)
	world.addBody(body)
	return body
}

export function getD6DieValue(dice: Dice): number {
	const rightFace = new THREE.Vector3(1, 0, 0)
	const leftFace = new THREE.Vector3(-1, 0, 0)
	const frontFace = new THREE.Vector3(0, 0, 1)
	const backFace = new THREE.Vector3(0, 0, -1)
	const topFace = new THREE.Vector3(0, 1, 0)
	const bottomFace = new THREE.Vector3(0, -1, 0)

	const mesh = dice.mesh as THREE.Object3D
	const worldMatrix = mesh.matrixWorld
	const worldRight = rightFace.clone().applyMatrix4(worldMatrix).normalize()
	const worldLeft = leftFace.clone().applyMatrix4(worldMatrix).normalize()
	const worldFront = frontFace.clone().applyMatrix4(worldMatrix).normalize()
	const worldBack = backFace.clone().applyMatrix4(worldMatrix).normalize()
	const worldTop = topFace.clone().applyMatrix4(worldMatrix).normalize()
	const worldBottom = bottomFace.clone().applyMatrix4(worldMatrix).normalize()

	const upVector = new THREE.Vector3(0, 1, 0)
	const facesUpAmount: FaceUpAmount[] = [
		{ face: 'right', value: 3, amount: worldRight.dot(upVector) },
		{ face: 'left', value: 4, amount: worldLeft.dot(upVector) },
		{ face: 'front', value: 2, amount: worldFront.dot(upVector) },
		{ face: 'back', value: 5, amount: worldBack.dot(upVector) },
		{ face: 'top', value: 1, amount: worldTop.dot(upVector) },
		{ face: 'bottom', value: 6, amount: worldBottom.dot(upVector) }
	]

	facesUpAmount.sort((a, b) => b.amount - a.amount)
	return facesUpAmount[0].value
}

export default class D6Dice extends Dice {
	static name = 'D6'
	static icon = d6Icon

	constructor(material: DiceMaterial, size: number, quality: number, mass: number, world: CANNON.World, onCollide: (event: ICollisionEvent) => void) {
		super(material, size, quality, mass, world, onCollide)
	}

	public getResult(): number {
		return getD6DieValue(this)
	}

	public formatResult(result: number | number[]): DiceResult {
		if (Array.isArray(result)) {
			const sum = result.reduce((acc, curr) => acc + curr, 0)
			return {
				value: sum,
				values: result,
				text: result.map(v => v.toString()).join(', '),
				color: result.every(v => v === 6) ? 'success' : result.every(v => v === 1) ? 'danger' : 'medium'
			}
		}
		return {
			value: result,
			values: [result],
			text: result.toString(),
			color: result === 6 ? 'success' : result === 1 ? 'danger' : 'medium'
		}
	}

	public changeMaterial(material: DiceMaterial): void {
		this.material = material
		this.mesh = this.createMesh()
	}

	protected createMesh(): Group {
		return createDiceMesh(this.material, this.size, this.quality)
	}

	protected createBody(world: CANNON.World, onCollide: (event: ICollisionEvent) => void): CANNON.Body {
		return createDiceBody(world, onCollide)
	}

	public clone(): Dice {
		const cloned = new D6Dice(this.material, this.size, this.quality, this.mass, this.world, this.onCollide)
		cloned.body.position.copy(this.body.position)
		cloned.body.quaternion.copy(this.body.quaternion)
		cloned.mesh.position.copy(this.mesh.position as THREE.Vector3)
		cloned.mesh.quaternion.copy(this.mesh.quaternion as THREE.Quaternion)
		return cloned
	}
}
