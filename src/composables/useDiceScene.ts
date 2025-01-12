import { computed, nextTick, onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue'
import * as THREE from 'three'
import { BufferGeometry, type Material } from 'three'
import * as CANNON from 'cannon-es'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { AccelListenerEvent, Motion } from '@capacitor/motion'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { ICollisionEvent } from 'cannon'
import { debounce, isIos, randomSign } from '@/utils.js'
import usePermission from '@/composables/usePermission.js'

type Dice = {
	mesh: THREE.Mesh | THREE.Group
	body: CANNON.Body
}

export type DiceSceneConfig = {
	numberOfDice: number
	gravity: number
	scale: number
	force: number
	shake: boolean
	haptic: boolean
	dice: {
		diceMaterial: keyof typeof MATERIALS
		signMaterial: keyof typeof MATERIALS
	}
}

export const MIN_NUMBER_OF_DICE = 1
export const MAX_NUMBER_OF_DICE = 4 * 4
export const MIN_GRAVITY = 5
export const MAX_GRAVITY = 100
export const MIN_SCALE = 4
export const MAX_SCALE = 16
export const MIN_FORCE = 2
export const MAX_FORCE = 20

const MATERIALS: Record<string, Material> = {
	white: new THREE.MeshStandardMaterial({
		color: 0xffffff,
		side: THREE.FrontSide
	}),
	black: new THREE.MeshStandardMaterial({
		color: 0x000000,
		side: THREE.FrontSide
	})
}

export const DEFAULT_DICE_SCENE_CONFIG: DiceSceneConfig = {
	numberOfDice: 4,
	gravity: 25,
	scale: 12,
	force: 14,
	shake: true,
	haptic: true,
	dice: {
		diceMaterial: 'white',
		signMaterial: 'black'
	}
}

function placeDiceInCenter(diceArray: Dice[]) {
	const spacing = 0.9
	const rowSize = Math.ceil(Math.sqrt(diceArray.length))
	const baseY = 1

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
	})
}

function createSymbolMesh(symbol: '+' | '-', material: Material) {
	const size = 0.5
	const thick = 0.1
	if (symbol === '+') {
		const shape = new THREE.Shape()
		shape.moveTo(-size / 2, thick / 2)
		shape.lineTo(-size / 2, -thick / 2)
		shape.lineTo(-thick / 2, -thick / 2)
		shape.lineTo(-thick / 2, -size / 2)
		shape.lineTo(thick / 2, -size / 2)
		shape.lineTo(thick / 2, -thick / 2)
		shape.lineTo(size / 2, -thick / 2)
		shape.lineTo(size / 2, thick / 2)
		shape.lineTo(thick / 2, thick / 2)
		shape.lineTo(thick / 2, size / 2)
		shape.lineTo(-thick / 2, size / 2)
		shape.lineTo(-thick / 2, thick / 2)
		shape.closePath()

		const extrudeSettings = { depth: 0.01, bevelEnabled: false }
		const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
		return new THREE.Mesh(geometry, material)
	}

	const geometry = new THREE.BoxGeometry(size, thick, 0.001)
	return new THREE.Mesh(geometry, material)
}

function createRoundedBoxGeometry(width: number, height: number, depth: number, segments: number, edgeRadius: number) {
	let boxGeometry: THREE.BoxGeometry | BufferGeometry = new THREE.BoxGeometry(width, height, depth, segments, segments, segments)

	const positionAttr = boxGeometry.attributes.position
	const subCubeHalfSize = 0.5 - edgeRadius

	for (let i = 0; i < positionAttr.count; i++) {
		let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i)
		const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize)
		const addition = new THREE.Vector3().subVectors(position, subCube)

		// Corner rounding logic
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

function createDiceMesh(segments: number, radius: number, diceMaterial: Material, signMaterial: Material): THREE.Group {
	const diceGroup = new THREE.Group()

	const geometry = createRoundedBoxGeometry(1, 1, 1, segments, radius)
	const outerMesh = new THREE.Mesh(geometry, diceMaterial)
	outerMesh.castShadow = true
	outerMesh.receiveShadow = true
	diceGroup.add(outerMesh)

	const symbolParams = [
		{
			symbol: '+',
			position: [0.5001, 0, 0],
			rotation: [0, -Math.PI * 0.5, 0]
		},
		{
			symbol: '+',
			position: [-0.5001, 0, 0],
			rotation: [0, Math.PI * 0.5, 0]
		},
		{
			symbol: '-',
			position: [0, 0, 0.5],
			rotation: [0, 0, 0]
		},
		{
			symbol: '-',
			position: [0, 0, -0.5],
			rotation: [0, 0, 0]
		}
	]

	symbolParams.forEach(({ symbol, position, rotation }) => {
		const symbolMesh = createSymbolMesh(symbol as '+' | '-', signMaterial)
		symbolMesh.position.set(position[0], position[1], position[2])
		symbolMesh.rotation.set(rotation[0], rotation[1], rotation[2])
		diceGroup.add(symbolMesh)
	})

	return diceGroup
}

export default function useDiceScene(config: DiceSceneConfig, canvas: Ref<HTMLCanvasElement | null>) {
	const { hasMotionPermission } = usePermission()

	let CONFIG: DiceSceneConfig = {
		...DEFAULT_DICE_SCENE_CONFIG,
		...config,
		dice: {
			...DEFAULT_DICE_SCENE_CONFIG.dice,
			...config.dice
		}
	}

	const MAX_DICE_VELOCITY = 25
	const RESTITUTION = 0.3
	const DICE_SEGMENTS = 40
	const DICE_RADIUS = 0.07
	const DICE_MASS = 1
	const SCENE_HEIGHT = 20
	const COLLISION_VELOCITY_THRESHOLD = 1.5
	const collisionCooldown = 200
	let lastCollisionTime = 0

	// Reactive width/height
	const width = ref<number>(0)
	const height = ref<number>(0)

	// We’ll base camera bounds on config.scale * aspect
	const aspect = computed<number>(() => {
		if (height.value === 0) return 1
		return width.value / height.value
	})

	// "Half-size" depends on config.scale + aspect
	const halfSizeX = ref<number>((MAX_SCALE + MIN_SCALE - CONFIG.scale) * aspect.value)
	const halfSizeZ = ref<number>(MAX_SCALE + MIN_SCALE - CONFIG.scale)

	// Dice + Physics + Scene
	const diceArray = ref<Dice[]>([])
	let SCENE = new THREE.Scene()
	let renderer: THREE.WebGLRenderer | null = null
	let PHYSICS = new CANNON.World({
		allowSleep: false,
		gravity: new CANNON.Vec3(0, -CONFIG.gravity, 0)
	})
	PHYSICS.defaultContactMaterial.restitution = RESTITUTION
	// eslint-disable-next-line
	// @ts-ignore
	PHYSICS.solver.iterations = 10 // Increase solver iterations for stability
	// eslint-disable-next-line
	// @ts-ignore
	PHYSICS.solver.tolerance = 0.001 // Reduce tolerance for better accuracy
	PHYSICS.defaultContactMaterial.contactEquationStiffness = 1e7 // Make contacts stiffer
	PHYSICS.defaultContactMaterial.contactEquationRelaxation = 3 // Improve stability
	PHYSICS.allowSleep = false
	let CAMERA: THREE.OrthographicCamera | null = null

	// For motion-based shake
	const accelThreshold = 8
	const shakeCooldownTime = 300
	let shakeCooldown = false

	// For controlling overall freeze/unfreeze
	let isFrozen = false
	let animationFrameId: number | null = null
	let accelListenerHandle: { remove: () => void } | null = null

	function createScene() {
		if (!canvas.value) return

		// Create the renderer
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: canvas.value
		})
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		// Capture dimensions
		width.value = canvas.value.clientWidth
		height.value = canvas.value.clientHeight
		renderer.setSize(width.value, height.value)

		// Create camera
		CAMERA = new THREE.OrthographicCamera(-halfSizeX.value, halfSizeX.value, halfSizeZ.value, -halfSizeZ.value, 0.1, 100)
		CAMERA.position.set(0, SCENE_HEIGHT, 0)
		CAMERA.lookAt(new THREE.Vector3(0, 0, 0))
		CAMERA.updateProjectionMatrix()
		SCENE.add(CAMERA)

		// Lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
		SCENE.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
		directionalLight.position.set(0, SCENE_HEIGHT, 10)
		directionalLight.castShadow = true

		directionalLight.shadow.mapSize.width = 2048
		directionalLight.shadow.mapSize.height = 2048
		directionalLight.shadow.camera.near = 1
		directionalLight.shadow.camera.far = 50

		directionalLight.shadow.camera.left = -halfSizeX.value * 2
		directionalLight.shadow.camera.right = halfSizeX.value * 2
		directionalLight.shadow.camera.top = halfSizeX.value * 2
		directionalLight.shadow.camera.bottom = -halfSizeX.value * 2

		directionalLight.shadow.bias = -0.001
		SCENE.add(directionalLight)

		// Floor
		const floorGeo = new THREE.PlaneGeometry(200, 200)
		const floorMat = new THREE.ShadowMaterial({ opacity: 0.1 })
		const floor = new THREE.Mesh(floorGeo, floorMat)
		floor.rotation.x = -Math.PI * 0.5
		floor.receiveShadow = true
		SCENE.add(floor)

		const floorBody = new CANNON.Body({
			type: CANNON.Body.STATIC,
			shape: new CANNON.Plane()
		})
		floorBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
		PHYSICS.addBody(floorBody)

		// Walls
		const wallThickness = 10
		const wallHeight = 50

		const walls = [
			{
				// Left
				position: new CANNON.Vec3(-halfSizeX.value - wallThickness * 0.5, wallHeight * 0.5, 0),
				size: new CANNON.Vec3(wallThickness * 0.5, wallHeight * 0.5, halfSizeZ.value)
			},
			{
				// Right
				position: new CANNON.Vec3(halfSizeX.value + wallThickness * 0.5, wallHeight * 0.5, 0),
				size: new CANNON.Vec3(wallThickness * 0.5, wallHeight * 0.5, halfSizeZ.value)
			},
			{
				// Top
				position: new CANNON.Vec3(0, wallHeight * 0.5, -halfSizeZ.value - wallThickness * 0.5),
				size: new CANNON.Vec3(halfSizeX.value, wallHeight * 0.5, wallThickness * 0.5)
			},
			{
				// Bottom
				position: new CANNON.Vec3(0, wallHeight * 0.5, halfSizeZ.value + wallThickness * 0.5),
				size: new CANNON.Vec3(halfSizeX.value, wallHeight * 0.5, wallThickness * 0.5)
			}
		]

		walls.forEach(({ position, size }) => {
			const wallShape = new CANNON.Box(size)
			const wallBody = new CANNON.Body({
				type: CANNON.Body.STATIC,
				shape: wallShape
			})
			wallBody.position.copy(position)
			PHYSICS.addBody(wallBody)
		})

		// Ceiling
		const ceilingBody = new CANNON.Body({
			type: CANNON.Body.STATIC,
			shape: new CANNON.Plane()
		})
		ceilingBody.quaternion.setFromEuler(Math.PI * 0.5, 0, 0)
		ceilingBody.position.y = SCENE_HEIGHT
		PHYSICS.addBody(ceilingBody)

		// Create dice
		const amount = CONFIG.numberOfDice
		const diceMesh: Dice['mesh'] = createDiceMesh(DICE_SEGMENTS, DICE_RADIUS, MATERIALS[CONFIG.dice.diceMaterial], MATERIALS[CONFIG.dice.signMaterial])

		for (let i = 0; i < amount; i++) {
			const mesh = diceMesh.clone()
			SCENE.add(mesh)
			const body = new CANNON.Body({
				mass: DICE_MASS,
				shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
				sleepTimeLimit: 0.2
			})
			body.collisionResponse = true
			body.collisionFilterGroup = 1
			body.collisionFilterMask = 1
			body.angularDamping = 0.1
			body.linearDamping = 0.1
			body.addEventListener('collide', handleDiceCollision)
			PHYSICS.addBody(body)
			diceArray.value.push({ mesh, body })
		}

		placeDiceInCenter(diceArray.value as Dice[])
		renderLoop()
	}

	function destroyScene() {
		console.debug('[Destroy] Destroying dice scene')
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}

		diceArray.value.forEach(dice => {
			dice.body.removeEventListener('collide', handleDiceCollision)
			PHYSICS.removeBody(dice.body as CANNON.Body)
		})
		diceArray.value = []

		SCENE.traverse(object => {
			if (object instanceof THREE.Mesh) {
				object.geometry.dispose()
				if (Array.isArray(object.material)) {
					object.material.forEach(m => m.dispose())
				} else {
					object.material.dispose()
				}
			}
		})
		SCENE.clear()

		if (renderer) {
			renderer.dispose()
			renderer = null
		}

		SCENE = new THREE.Scene()
		PHYSICS = new CANNON.World({
			allowSleep: false,
			gravity: new CANNON.Vec3(0, -CONFIG.gravity, 0)
		})
		PHYSICS.defaultContactMaterial.restitution = RESTITUTION
		CAMERA = null
	}

	function renderLoop() {
		if (isFrozen || !renderer || !CAMERA) return
		PHYSICS.fixedStep()

		for (const dice of diceArray.value) {
			dice.mesh.position.copy(dice.body.position as unknown as THREE.Vector3)
			dice.mesh.quaternion.copy(dice.body.quaternion as unknown as THREE.Quaternion)
		}
		renderer.render(SCENE, CAMERA)
		animationFrameId = requestAnimationFrame(renderLoop)
	}

	function handleDiceCollision(event: ICollisionEvent) {
		if (!CONFIG.haptic) return
		// Some Cannon.js shapes do not have getImpactVelocityAlongNormal
		const impactVelocity = event.contact.getImpactVelocityAlongNormal ? event.contact.getImpactVelocityAlongNormal() : 2

		const now = Date.now()
		if (impactVelocity > COLLISION_VELOCITY_THRESHOLD && now - lastCollisionTime > collisionCooldown) {
			lastCollisionTime = now
			Haptics.impact({ style: ImpactStyle.Light })
		}
	}

	function handleResize() {
		if (!canvas.value || !renderer || !CAMERA) return

		// Re-measure
		width.value = canvas.value.clientWidth
		height.value = canvas.value.clientHeight
		renderer.setSize(width.value, height.value)

		// Re-compute camera bounds
		CAMERA.left = -halfSizeX.value
		CAMERA.right = halfSizeX.value
		CAMERA.top = halfSizeZ.value
		CAMERA.bottom = -halfSizeZ.value
		CAMERA.updateProjectionMatrix()
	}

	function onAcceleration(event: AccelListenerEvent) {
		if (!CONFIG.shake) return

		if (isFrozen || !event.acceleration.x || !event.acceleration.y || !event.acceleration.z) return

		const { x, y, z } = event.acceleration
		const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2)

		if (magnitude > accelThreshold && !shakeCooldown) {
			let sceneX = isIos ? -x : x
			const sceneY = 1 + Math.random()
			let sceneZ = isIos ? y : -y

			// Right = x
			// Left = -x
			// Up = -z
			// Down = z

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

			const forceScale = (CONFIG.force / MAX_FORCE) * 2 * magnitude
			const impulsePoint = new CANNON.Vec3(0, 0, 0)
			const accelVec = new CANNON.Vec3(sceneX, sceneY, sceneZ)
			accelVec.normalize()
			accelVec.scale(forceScale, accelVec)

			console.debug('[Acceleration] Shake detected. Applying impulse: ', { x: accelVec.x.toFixed(2), y: accelVec.y.toFixed(2), z: accelVec.z.toFixed(2) })

			for (const dice of diceArray.value) {
				dice.body.applyImpulse(accelVec, impulsePoint)
				dice.body.allowSleep = false

				const currentVelocity = dice.body.velocity.length()
				if (currentVelocity > MAX_DICE_VELOCITY) {
					const scale = MAX_DICE_VELOCITY / currentVelocity
					dice.body.velocity.scale(scale, dice.body.velocity)
				}
			}

			shakeCooldown = true
			setTimeout(() => {
				shakeCooldown = false
			}, shakeCooldownTime)
		}
	}

	async function addAccelListener() {
		if (!hasMotionPermission.value) {
			console.error('[Acceleration] No motion permission')
			return
		}

		console.debug('[Acceleration] Adding acceleration listener')

		accelListenerHandle = await Motion.addListener('accel', onAcceleration)
	}

	function repaint() {
		if (!canvas.value) return
		canvas.value.style.width = ''
		canvas.value.style.height = ''

		nextTick(() => {
			console.debug('[Repaint] Repainting dice scene')
			destroyScene()
			width.value = canvas.value?.clientWidth || 0
			height.value = canvas.value?.clientHeight || 0
			halfSizeX.value = (MAX_SCALE + MIN_SCALE - CONFIG.scale) * aspect.value
			halfSizeZ.value = MAX_SCALE + MIN_SCALE - CONFIG.scale
			createScene()
			handleResize()
			unfreeze()
		})
	}

	watch(hasMotionPermission, value => {
		if (value) {
			addAccelListener()
		}
	})

	watch(canvas, async value => {
		if (!value) return

		setTimeout(async () => {
			console.debug('[Repaint] Canvas got changed. Repainting dice scene')
			halfSizeX.value = (MAX_SCALE + MIN_SCALE - CONFIG.scale) * (value.clientWidth / value.clientHeight)
			halfSizeZ.value = MAX_SCALE + MIN_SCALE - CONFIG.scale
			createScene()
			await addAccelListener()
		}, 0)
	})

	watch(
		() => config,
		newVal => {
			console.debug('[Repaint] Config changed. Repainting dice scene')
			freeze()
			CONFIG = {
				...DEFAULT_DICE_SCENE_CONFIG,
				...newVal,
				dice: {
					...DEFAULT_DICE_SCENE_CONFIG.dice,
					...newVal.dice
				}
			}
			repaint()
		},
		{ deep: true }
	)

	const debouncedRepaint = debounce(repaint, 200)

	onMounted(() => {
		window.addEventListener('resize', debouncedRepaint)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', debouncedRepaint)
		Motion.removeAllListeners()
		if (animationFrameId) cancelAnimationFrame(animationFrameId)
	})

	function freeze() {
		if (isFrozen) return
		isFrozen = true

		console.debug('[Freeze] Dice scene frozen')

		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
			console.debug('[Freeze] Cancelled animation frame')
		}

		if (accelListenerHandle) {
			accelListenerHandle.remove()
			accelListenerHandle = null
			console.debug('[Freeze] Removed acceleration listener')
		}

		window.removeEventListener('resize', debouncedRepaint)
	}

	async function unfreeze() {
		if (!isFrozen) return

		console.debug('[Unfreeze] Dice scene unfrozen')

		isFrozen = false
		await addAccelListener()
		window.addEventListener('resize', debouncedRepaint)
		renderLoop()
	}

	function throwDice(): number {
		diceArray.value.forEach(dice => {
			const currentVelocity = dice.body.velocity.length()
			const maxImpulse = Math.max(0, MAX_DICE_VELOCITY - currentVelocity)

			const x = 2 * Math.random() * randomSign() * Math.min(CONFIG.force, maxImpulse)
			const y = Math.random()
			const z = 2 * Math.random() * randomSign() * Math.min(CONFIG.force, maxImpulse)

			const impulsePoint = new CANNON.Vec3(0, 0, 0)

			const impulse = new CANNON.Vec3(x, y, z)

			console.debug('[Throw] Manually throwing dice with impulse: ', { x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) })

			dice.body.applyImpulse(impulse, impulsePoint)
		})

		return getRandomDiceResult()
	}

	function getRandomDiceResult(): number {
		return diceArray.value.reduce((acc, _) => {
			const diceValue = [-1, 0, 1][Math.floor(Math.random() * 3)]
			return acc + diceValue
		}, 0)
	}

	return {
		freeze,
		unfreeze,
		throwDice
	}
}
