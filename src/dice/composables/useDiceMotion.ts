import * as CANNON from 'cannon-es'
import { Motion } from '@capacitor/motion'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import type { AccelListenerEvent } from '@capacitor/motion'
import { isIos } from '@/utils/helpers/platform'
import { ACCEL_THRESHOLD, MAX_DICE_VELOCITY } from '@/dice/constants'
import type { ICollisionEvent } from 'cannon'
import type { Dice } from '../shapes'

/**
 * Sets up acceleration listeners for shake detection
 */
export async function setupAccelerationListener(
	onShake: (accelVec: CANNON.Vec3, strength: number) => void,
	isEnabled: boolean,
	threshold: number = ACCEL_THRESHOLD,
	cooldownTime: number = 300
): Promise<{ remove: () => void } | null> {
	if (!isEnabled) return null

	let shakeCooldown = false

	const listener = await Motion.addListener('accel', (event: AccelListenerEvent) => {
		if (!event?.acceleration?.x || !event?.acceleration?.y || !event?.acceleration?.z) return

		const { x, y, z } = event.acceleration
		const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2)

		if (magnitude > threshold && !shakeCooldown) {
			let sceneX = isIos ? -x : x
			const sceneY = 1 + Math.random()
			let sceneZ = isIos ? y : -y

			// Handle different screen orientations
			if (isIos) {
				switch (window.screen.orientation.angle) {
					case 270:
						;[sceneX, sceneZ] = [sceneZ, -sceneX]
						break
					case 90:
						;[sceneX, sceneZ] = [-sceneZ, sceneX]
						break
					case 180:
						;[sceneX, sceneZ] = [-sceneX, -sceneZ]
						break
				}
			} else {
				switch (window.screen.orientation.angle) {
					case 90:
						;[sceneX, sceneZ] = [-sceneZ, sceneX]
						break
					case 270:
						;[sceneX, sceneZ] = [sceneZ, -sceneX]
						break
				}
			}

			const accelVec = new CANNON.Vec3(sceneX, sceneY, sceneZ)
			accelVec.normalize()

			onShake(accelVec, magnitude)

			shakeCooldown = true
			setTimeout(() => {
				shakeCooldown = false
			}, cooldownTime)
		}
	})

	return listener
}

/**
 * Applies a shake impulse to all dice
 */
export function applyShakeImpulse(diceArray: Dice[], accelVec: CANNON.Vec3, magnitude: number, force: number, maxForce: number): void {
	const forceScale = (force / maxForce) * 5 * magnitude
	accelVec.scale(forceScale, accelVec)
	const impulsePoint = new CANNON.Vec3(0, 0, 0)

	for (const dice of diceArray) {
		dice.body.applyImpulse(accelVec, impulsePoint)

		// Limit maximum velocity
		const currentVelocity = dice.body.velocity.length()
		if (currentVelocity > MAX_DICE_VELOCITY) {
			const scale = MAX_DICE_VELOCITY / currentVelocity
			dice.body.velocity.scale(scale, dice.body.velocity)
		}
	}
}

/**
 * Handles dice collision effects (haptic feedback)
 */
export function handleDiceCollision(
	event: ICollisionEvent,
	isHapticEnabled: boolean,
	velocityThreshold: number,
	lastCollisionTime: { current: number },
	collisionCooldown: number
): void {
	if (!isHapticEnabled) return

	const impactVelocity = event.contact.getImpactVelocityAlongNormal ? event.contact.getImpactVelocityAlongNormal() : 2

	const now = Date.now()
	if (impactVelocity > velocityThreshold && now - lastCollisionTime.current > collisionCooldown) {
		lastCollisionTime.current = now
		Haptics.impact({ style: ImpactStyle.Light })
	}
}
