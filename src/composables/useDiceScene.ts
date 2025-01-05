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

interface DiceSceneConfig {
	diceCount?: number
	gravity?: number
	scale?: number
	force?: number
	dice?: {
		diceMaterial?: Material
		signMaterial?: Material
	}
}

const DEFAULT_CONFIG: Required<DiceSceneConfig> = {
	diceCount: 4,
	gravity: 25,
	scale: 1,
	force: 80,
	dice: {
		diceMaterial: new THREE.MeshStandardMaterial({
			color: 0xffffff,
			side: THREE.FrontSide
		}),
		signMaterial: new THREE.MeshStandardMaterial({
			color: 0x000000,
			side: THREE.FrontSide
		})
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
	const rowSize = Math.ceil(Math.sqrt(diceArray.length)) // e.g., 2 if we have 4 dice
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
	const RESTITUTION = 0.3
	const DICE_SEGMENTS = 40
	const DICE_RADIUS = 0.07
	const DICE_MASS = 1
	const SCENE_HEIGHT: number = 20
	const COLLISION_VELOCITY_THRESHOLD = 1.5
	const collisionCooldown = 200
	let lastCollisionTime = 0

	const CONFIG: Required<DiceSceneConfig> = {
		...DEFAULT_CONFIG,
		...config,
		dice: {
			...DEFAULT_CONFIG.dice,
			...config.dice
		}
	}

	const width = ref<number>(0)
	const height = ref<number>(0)

	const aspect = computed<number>(() => width.value / height.value)
	const halfSizeX = computed<number>(() => CONFIG.scale * aspect.value)
	const halfSizeZ = computed<number>(() => CONFIG.scale)

	const diceArray = ref<Dice[]>([])
	const SCENE = new THREE.Scene()
	const renderer = ref<THREE.WebGLRenderer | null>(null)
	const PHYSICS = new CANNON.World({
		allowSleep: false,
		gravity: new CANNON.Vec3(0, -CONFIG.gravity, 0)
	})
	PHYSICS.defaultContactMaterial.restitution = RESTITUTION

	let CAMERA: THREE.OrthographicCamera | null = null

	// Variables for acceleration-based shake detection
	const accelThreshold = 8
	const shakeCooldownTime = 200
	const forceScale = 2
	let shakeCooldown = false

	// Track if scene is "frozen"
	let isFrozen = false
	// Track current requestAnimationFrame so we can cancel
	let animationFrameId: number | null = null
	// For removing single motion listener instead of removeAllListeners
	let accelListenerHandle: { remove: () => void } | null = null

	function createScene() {
		if (!canvas.value) return

		renderer.value = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: canvas.value
		})
		renderer.value.shadowMap.enabled = true
		renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		width.value = canvas.value.clientWidth
		height.value = canvas.value.clientHeight

		renderer.value.setSize(width.value, height.value)

		// CAMERA creation
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
		const diceMesh: Dice['mesh'] = createDiceMesh(DICE_SEGMENTS, DICE_RADIUS, CONFIG.dice.diceMaterial as Material, CONFIG.dice.signMaterial as Material)
		for (let i = 0; i < amount; i++) {
			const mesh = diceMesh.clone()
			SCENE.add(mesh)
			const body = new CANNON.Body({
				mass: DICE_MASS,
				shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
				sleepTimeLimit: 0.2
			})
			body.addEventListener('collide', handleDiceCollision)
			PHYSICS.addBody(body)
			diceArray.value.push({ mesh, body })
		}

		placeDiceInCenter(diceArray.value as Dice[])

		renderLoop()
	}

	function renderLoop() {
		if (isFrozen || !renderer.value || !CAMERA) return
		PHYSICS.fixedStep()

		for (const dice of diceArray.value) {
			dice.mesh.position.copy(dice.body.position as unknown as THREE.Vector3)
			dice.mesh.quaternion.copy(dice.body.quaternion as unknown as THREE.Quaternion)
		}
		renderer.value.render(SCENE, CAMERA)
		animationFrameId = requestAnimationFrame(renderLoop)
	}

	function handleResize() {
		if (!canvas.value || !renderer.value || !CAMERA) return

		width.value = canvas.value.clientWidth
		height.value = canvas.value.clientHeight

		renderer.value.setSize(width.value, height.value)

		CAMERA.left = -halfSizeX.value
		CAMERA.right = halfSizeX.value
		CAMERA.top = halfSizeZ.value
		CAMERA.bottom = -halfSizeZ.value
		CAMERA.updateProjectionMatrix()
	}

	function handleDiceCollision(event: ICollisionEvent) {
		const impactVelocity = event.contact.getImpactVelocityAlongNormal ? event.contact.getImpactVelocityAlongNormal() : 2

		const now = Date.now()
		if (impactVelocity > COLLISION_VELOCITY_THRESHOLD && now - lastCollisionTime > collisionCooldown) {
			lastCollisionTime = now
			Haptics.impact({ style: ImpactStyle.Light })
		}
	}

	function onAcceleration(event: AccelListenerEvent) {
		if (isFrozen) return

		const { x, y, z } = event.acceleration ?? { x: 0, y: 0, z: 0 }
		const magnitude = Math.sqrt((x ?? 0) * (x ?? 0) + (y ?? 0) * (y ?? 0) + (z ?? 0) * (z ?? 0))

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

	watch(canvas, async value => {
		setTimeout(async () => {
			if (!value) return
			createScene()
			await addAccelListener()
		}, 0)
	})

	onMounted(async () => {
		window.addEventListener('resize', handleResize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize)
		Motion.removeAllListeners()
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
		}
	})

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
