import * as CANNON from 'cannon-es'
import type * as THREE from 'three'
import type { Dice } from '../shapes'
import { DICE_MASS, RESTITUTION } from '@/dice/constants'

/**
 * Creates a physics world with appropriate settings for dice simulation
 */
export function createPhysicsWorld(gravity: number): CANNON.World {
	const world = new CANNON.World({
		allowSleep: true,
		gravity: new CANNON.Vec3(0, -gravity, 0)
	})

	world.defaultContactMaterial.restitution = RESTITUTION
	// @ts-ignore This property exists in Cannon.js but TypeScript doesn't know about it
	world.solver.iterations = 12 // Increased from 10
	// @ts-ignore This property exists in Cannon.js but TypeScript doesn't know about it
	world.solver.tolerance = 0.0005
	world.defaultContactMaterial.contactEquationStiffness = 2e7
	world.defaultContactMaterial.contactEquationRelaxation = 5
	world.defaultContactMaterial.friction = 0.6
	world.defaultContactMaterial.frictionEquationStiffness = 2e6

	world.broadphase = new CANNON.SAPBroadphase(world)
	// @ts-ignore This property exists in Cannon.js but TypeScript doesn't know about it
	world.broadphase.axisIndex = 1
	world.allowSleep = true

	// Configure sleep parameters
	// @ts-ignore These properties exist in Cannon.js but TypeScript doesn't know about them
	world.sleepTimeLimit = 0.3
	// @ts-ignore
	world.sleepSpeedLimit = 1.0

	return world
}

/**
 * Creates physical boundaries for the dice scene
 */
export function createBoundaries(world: CANNON.World, halfSizeX: number, halfSizeZ: number): void {
	// Floor
	const floorBody = new CANNON.Body({
		type: CANNON.Body.STATIC,
		shape: new CANNON.Plane()
	})
	floorBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
	world.addBody(floorBody)

	// Walls
	const wallThickness = 10
	const wallHeight = 50

	const walls = [
		{
			// Left wall
			position: new CANNON.Vec3(-halfSizeX - wallThickness * 0.5, wallHeight * 0.5, 0),
			size: new CANNON.Vec3(wallThickness * 0.5, wallHeight * 0.5, halfSizeZ)
		},
		{
			// Right wall
			position: new CANNON.Vec3(halfSizeX + wallThickness * 0.5, wallHeight * 0.5, 0),
			size: new CANNON.Vec3(wallThickness * 0.5, wallHeight * 0.5, halfSizeZ)
		},
		{
			// Top wall
			position: new CANNON.Vec3(0, wallHeight * 0.5, -halfSizeZ - wallThickness * 0.5),
			size: new CANNON.Vec3(halfSizeX, wallHeight * 0.5, wallThickness * 0.5)
		},
		{
			// Bottom wall
			position: new CANNON.Vec3(0, wallHeight * 0.5, halfSizeZ + wallThickness * 0.5),
			size: new CANNON.Vec3(halfSizeX, wallHeight * 0.5, wallThickness * 0.5)
		}
	]

	walls.forEach(({ position, size }) => {
		const wallShape = new CANNON.Box(size)
		const wallBody = new CANNON.Body({
			type: CANNON.Body.STATIC,
			shape: wallShape
		})
		wallBody.position.copy(position)
		world.addBody(wallBody)
	})

	// Ceiling
	const ceilingShape = new CANNON.Box(new CANNON.Vec3(halfSizeX, wallThickness * 0.5, halfSizeZ))
	const ceilingBody = new CANNON.Body({
		type: CANNON.Body.STATIC,
		shape: ceilingShape
	})
	ceilingBody.position.set(0, wallHeight, 0)
	world.addBody(ceilingBody)
}

/**
 * Places dice in a grid formation at the center of the scene
 */
export function placeDiceInCenter(diceArray: Dice[]): void {
	const spacing = 2.0 // Increased from 0.9 to account for larger dice size
	const rowSize = Math.ceil(Math.sqrt(diceArray.length))
	const baseY = 3 // Increased from 1 to give more room for dice to fall

	diceArray.forEach((dice, i) => {
		dice.body.velocity.setZero()
		dice.body.angularVelocity.setZero()
		dice.body.force.setZero()
		dice.body.torque.setZero()

		const row = Math.floor(i / rowSize)
		const col = i % rowSize

		const xOffset = (col - (rowSize - 1) / 2) * spacing
		const zOffset = (row - (rowSize - 1) / 2) * spacing
		dice.body.position.set(xOffset, baseY, zOffset)

		// Add a small random rotation to make it more interesting
		dice.body.quaternion.setFromEuler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
	})
}

/**
 * Updates the dice meshes based on their physical bodies
 */
export function updateDiceMeshes(diceArray: Dice[]): void {
	for (const dice of diceArray) {
		dice.mesh.position.copy(dice.body.position as unknown as THREE.Vector3)
		dice.mesh.quaternion.copy(dice.body.quaternion as unknown as THREE.Quaternion)
	}
}

/**
 * Applies an impulse to throw the dice
 */
export function throwDice(diceArray: Dice[], force: number, minForce: number, maxForce: number): void {
	diceArray.forEach(dice => {
		const currentVelocity = dice.body.velocity.length()
		const maxImpulse = Math.max(0, DICE_MASS - currentVelocity)
		const scaledImpulse = minForce + ((force - minForce) / (maxForce - minForce)) * (DICE_MASS - minForce)
		const randomFactor = 1 + (Math.random() * 0.2 - 0.1) // ±10% variation
		const finalImpulse = Math.min(scaledImpulse * randomFactor, maxImpulse)

		const x = Math.random() > 0.5 ? finalImpulse : -finalImpulse
		const y = Math.random() * 4 + 1
		const z = Math.random() > 0.5 ? finalImpulse : -finalImpulse

		const impulsePoint = new CANNON.Vec3(0, 0, 0)
		const impulse = new CANNON.Vec3(x, y, z)

		dice.body.applyImpulse(impulse, impulsePoint)
	})
}

/**
 * Checks if all dice have stopped moving
 */
export function areDiceStopped(diceArray: Dice[], velocityThreshold: number, angularThreshold: number): boolean {
	return diceArray.every(dice => {
		const velocity = dice.body.velocity.length()
		const angularVelocity = dice.body.angularVelocity.length()
		return velocity < velocityThreshold && angularVelocity < angularThreshold
	})
}
