import type { ICollisionEvent } from 'cannon'
import type { DiceMaterial } from '../materials'
import type * as CANNON from 'cannon-es'
import type * as THREE from 'three'
import type { DiceResult } from '../types'

export type DiceConstructor = {
	new (material: DiceMaterial, size: number, quality: number, mass: number, world: CANNON.World, onCollide: (event: ICollisionEvent) => void): Dice
	icon: string
	name: string
}

export abstract class Dice {
	public static name: string
	public static icon: string

	public mesh: THREE.Mesh | THREE.Group
	public body: CANNON.Body

	protected constructor(
		public material: DiceMaterial,
		public size: number,
		public quality: number,
		public mass: number,
		public world: CANNON.World,
		public onCollide: (event: ICollisionEvent) => void
	) {
		this.mesh = this.createMesh()
		this.body = this.createBody(this.world, this.onCollide)
	}

	public abstract clone(): Dice
	public abstract getResult(): number
	public abstract formatResult(result: number | number[]): DiceResult
	public abstract changeMaterial(material: DiceMaterial): void

	protected abstract createMesh(): THREE.Mesh | THREE.Group
	protected abstract createBody(world: CANNON.World, onCollide: (event: ICollisionEvent) => void): CANNON.Body
}
