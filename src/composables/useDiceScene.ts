import { computed, onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue'
import * as THREE from 'three'
import { BufferGeometry, type Material } from 'three'
import * as CANNON from 'cannon-es'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { AccelListenerEvent, Motion } from '@capacitor/motion'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { ICollisionEvent } from 'cannon'

type Dice = {
	mesh: THREE.Mesh | THREE.Group
	body: CANNON.Body
}

export type DiceSceneConfig = {
	diceCount: number
	gravity: number
	scale: number
	force: number
	dice: {
		diceMaterial: keyof typeof MATERIALS
		signMaterial: keyof typeof MATERIALS
	}
}

export const MIN_DICE_COUNT = 1
export const MAX_DICE_COUNT = 4 * 4
export const MIN_GRAVITY = 5
export const MAX_GRAVITY = 100
export const MIN_SCALE = 4
export const MAX_SCALE = 16
export const MIN_FORCE = 10
export const MAX_FORCE = 200

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
	diceCount: 4,
	gravity: 25,
	scale: 12,
	force: 80,
	dice: {
		diceMaterial: 'white',
		signMaterial: 'black'
	}
}

// eslint-disable-next-line
// @ts-ignore
async function requestMotionPermission(): Promise<boolean> {
	// eslint-disable-next-line
	// @ts-ignore
	if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
		try {
			// eslint-disable-next-line
			// @ts-ignore
			const result = await DeviceMotionEvent.requestPermission()
			return result === 'granted'
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return false
		}
	} else {
		return true
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
	/**
	 * Current config that we’ll re-assign every time `config` changes
	 */
	let CONFIG: DiceSceneConfig = {
		...DEFAULT_DICE_SCENE_CONFIG,
		...config,
		dice: {
			...DEFAULT_DICE_SCENE_CONFIG.dice,
			...config.dice
		}
	}

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
	// 	return MAX_SCALE + MIN_SCALE - CONFIG.scale
	// })
	// const halfSizeZ = computed<number>(() => {
	// 	console.log('halfZ', MAX_SCALE + MIN_SCALE - CONFIG.scale)
	// 	return MAX_SCALE + MIN_SCALE - CONFIG.scale
	// })

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
	PHYSICS.allowSleep = false // Ensure all bodies are always active
	let CAMERA: THREE.OrthographicCamera | null = null

	// For motion-based shake
	const accelThreshold = 8
	const shakeCooldownTime = 200
	const forceScale = 2
	let shakeCooldown = false

	// For controlling overall freeze/unfreeze
	let isFrozen = false
	let animationFrameId: number | null = null
	let accelListenerHandle: { remove: () => void } | null = null

	/***************************
	 * Scene (Re)Initialization
	 ***************************/
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
		const wallThickness = 1
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
		const amount = CONFIG.diceCount
		const diceMesh: Dice['mesh'] = createDiceMesh(DICE_SEGMENTS, DICE_RADIUS, MATERIALS[CONFIG.dice.diceMaterial], MATERIALS[CONFIG.dice.signMaterial])

		for (let i = 0; i < amount; i++) {
			const mesh = diceMesh.clone()
			SCENE.add(mesh)
			const body = new CANNON.Body({
				mass: DICE_MASS,
				shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
				sleepTimeLimit: 0.2
			})
			body.collisionResponse = true // Ensure it responds to collisions
			body.collisionFilterGroup = 1
			body.collisionFilterMask = 1
			body.angularDamping = 0.1 // Reduce rotational velocity gradually
			body.linearDamping = 0.1 // Reduce linear velocity gradually
			body.addEventListener('collide', handleDiceCollision)
			PHYSICS.addBody(body)
			diceArray.value.push({ mesh, body })
		}

		placeDiceInCenter(diceArray.value as Dice[])
		renderLoop()
	}

	/**************************
	 * Scene Teardown/Cleanup *
	 **************************/
	function destroyScene() {
		// 1. Stop the render loop
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}

		// 2. Remove dice bodies from the physics world
		diceArray.value.forEach(dice => {
			dice.body.removeEventListener('collide', handleDiceCollision)
			PHYSICS.removeBody(dice.body as CANNON.Body)
		})
		diceArray.value = []

		// 3. Dispose geometry/material of objects in the scene
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

		// 4. Dispose renderer
		if (renderer) {
			renderer.dispose()
			renderer = null
		}

		// 5. Reset references
		SCENE = new THREE.Scene()
		PHYSICS = new CANNON.World({
			allowSleep: false,
			gravity: new CANNON.Vec3(0, -CONFIG.gravity, 0)
		})
		PHYSICS.defaultContactMaterial.restitution = RESTITUTION
		CAMERA = null
	}

	/************************
	 * Rendering + Handlers
	 ************************/
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

	/****************************
	 * Motion / Shake Detection
	 ****************************/
	function onAcceleration(event: AccelListenerEvent) {
		if (isFrozen) return

		const { x, y, z } = event.acceleration ?? { x: 0, y: 0, z: 0 }
		const magnitude = Math.sqrt((x ?? 0) ** 2 + (y ?? 0) ** 2 + (z ?? 0) ** 2)

		if (magnitude > accelThreshold && !shakeCooldown) {
			const accelVec = new CANNON.Vec3(x ?? 0, y ?? 0, z ?? 0)
			accelVec.normalize()
			accelVec.scale(magnitude * forceScale, accelVec)

			for (const dice of diceArray.value) {
				dice.body.applyImpulse(accelVec, new CANNON.Vec3(0, 0, 0))
				dice.body.allowSleep = false
			}

			shakeCooldown = true
			setTimeout(() => {
				shakeCooldown = false
			}, shakeCooldownTime)
		}
	}

	async function addAccelListener() {
		const isPermited = await requestMotionPermission()
		if (!isPermited) return
		accelListenerHandle = await Motion.addListener('accel', onAcceleration)
	}

	/******************
	 * Lifecycle Hooks
	 ******************/
	// Whenever the canvas ref changes (first mount), create the scene
	watch(canvas, async value => {
		if (!value) return

		setTimeout(async () => {
			halfSizeX.value = (MAX_SCALE + MIN_SCALE - CONFIG.scale) * (value.clientWidth / value.clientHeight)
			halfSizeZ.value = MAX_SCALE + MIN_SCALE - CONFIG.scale
			createScene()
			await addAccelListener()
		}, 0)
	})

	// Watch the config deeply for changes → reset the scene
	watch(
		() => config,
		newVal => {
			freeze()
			// Update local CONFIG
			CONFIG = {
				...DEFAULT_DICE_SCENE_CONFIG,
				...newVal,
				dice: {
					...DEFAULT_DICE_SCENE_CONFIG.dice,
					...newVal.dice
				}
			}
			destroyScene()
			halfSizeX.value = (MAX_SCALE + MIN_SCALE - CONFIG.scale) * aspect.value
			halfSizeZ.value = MAX_SCALE + MIN_SCALE - CONFIG.scale
			createScene()
			// Make sure camera bounds get recalculated
			setTimeout(() => {
				handleResize()
			}, 0)
			unfreeze()
		},
		{ deep: true }
	)

	// Also watch aspect / scale changes specifically and re-run `handleResize`
	watch([aspect, () => CONFIG.scale], () => {
		// If the scene is initialized, re-sync camera
		if (CAMERA && renderer) {
			handleResize()
		}
	})

	onMounted(() => {
		window.addEventListener('resize', handleResize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize)
		Motion.removeAllListeners()
		if (animationFrameId) cancelAnimationFrame(animationFrameId)
	})

	/******************
	 * Public Methods
	 ******************/
	function freeze() {
		if (isFrozen) return
		isFrozen = true

		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}

		if (accelListenerHandle) {
			accelListenerHandle.remove()
			accelListenerHandle = null
		}
	}

	async function unfreeze() {
		if (!isFrozen) return
		isFrozen = false
		await addAccelListener()
		renderLoop()
	}

	function throwDice() {
		diceArray.value.forEach(dice => {
			const impulse = new CANNON.Vec3((Math.random() - 0.5) * CONFIG.force, 0, (Math.random() - 0.5) * CONFIG.force)
			dice.body.applyImpulse(impulse, new CANNON.Vec3(0, 0, 0))
		})
	}

	return {
		freeze,
		unfreeze,
		throwDice
	}
}