import { computed, onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue'
import * as THREE from 'three'
import { type Material } from 'three'
import * as CANNON from 'cannon-es'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

interface Dice {
	mesh: THREE.Mesh
	body: CANNON.Body
}

interface DiceSceneConfig {
	diceCount?: number
	throwForce?: number
	gravity?: number
	scale?: number
	dice?: {
		diceMaterial?: Material
		signMaterial?: Material
	}
}

const DEFAULT_CONFIG: Required<DiceSceneConfig> = {
	diceCount: 4,
	throwForce: 10,
	gravity: 9.8,
	scale: 1,
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

function placeDiceIn4x4Layers(diceArray: Dice[]) {
	const rowSize = 4 // 4 columns
	const layerRowCount = 4 // 4 rows per layer => 16 dice per layer
	const spacing = 1 // gap between dice in x/z
	const layerHeight = 1 // vertical gap between layers
	const baseY = 0.5 // so bottom of the die rests on y=0 floor
	const startZ = 0 // start at z=0
	const startX = -1.5 // start at x=0

	diceArray.forEach((dice, i) => {
		// Reset velocities and forces
		dice.body.velocity.setZero()
		dice.body.angularVelocity.setZero()
		dice.body.force.setZero()
		dice.body.torque.setZero()

		// Figure out which row/layer this die belongs to
		const rowIndexAll = Math.floor(i / rowSize) // e.g. 0,1,2,3... row # within an infinite single-layer
		const layerIndex = Math.floor(rowIndexAll / layerRowCount) // every 4 rows, go up one layer
		const rowIndexInLayer = rowIndexAll % layerRowCount // 0..3 row within the layer
		const colIndex = i % rowSize // 0..3 column within that row

		// Compute positions:
		//  - x: left->right
		//  - z: row-based "back" (larger z -> further back if your +z goes "inward")
		//  - y: stacked layer
		const x = startX + colIndex * spacing
		const z = startZ + rowIndexInLayer * spacing
		const y = baseY + layerIndex * layerHeight

		dice.body.position.set(x, y, z)
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
	let boxGeometry = new THREE.BoxGeometry(width, height, depth, segments, segments, segments)

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

	const CONFIG: Required<DiceSceneConfig> = {
		...DEFAULT_CONFIG,
		...config,
		dice: {
			...DEFAULT_CONFIG.dice,
			...config.dice
		}
	}

	// Reactive width/height for the renderer
	const width = ref<number>(0)
	const height = ref<number>(0)

	// aspect, halfSizeX, halfSizeZ re-computed based on width & height
	const aspect = computed<number>(() => width.value / height.value)
	const halfSizeX = computed<number>(() => CONFIG.scale * aspect.value)
	const halfSizeZ = computed<number>(() => CONFIG.scale)

	// Three.js & Cannon.js references
	const diceArray = ref<Dice[]>([])
	const SCENE = new THREE.Scene()
	const renderer = ref<THREE.WebGLRenderer | null>(null)
	const PHYSICS = new CANNON.World({
		allowSleep: true,
		gravity: new CANNON.Vec3(0, -CONFIG.gravity, 0)
	})
	PHYSICS.defaultContactMaterial.restitution = RESTITUTION

	// We keep a reference to the camera so we can reconfigure it on resize.
	let CAMERA: THREE.OrthographicCamera | null = null

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

		// Initial size
		renderer.value.setSize(width.value, height.value)

		// CAMERA creation (Orthographic)
		CAMERA = new THREE.OrthographicCamera(-halfSizeX.value, halfSizeX.value, halfSizeZ.value, -halfSizeZ.value, 0.1, 100)
		CAMERA.position.set(0, SCENE_HEIGHT, 0)
		CAMERA.lookAt(new THREE.Vector3(0, 0, 0))
		CAMERA.updateProjectionMatrix()
		SCENE.add(CAMERA)

		// Light configuration
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
		const wallHeight = 20

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

		// Create dice
		const amount = CONFIG.diceCount
		const diceMesh = createDiceMesh(DICE_SEGMENTS, DICE_RADIUS, CONFIG.dice.diceMaterial as Material, CONFIG.dice.signMaterial as Material)
		for (let i = 0; i < amount; i++) {
			const mesh = diceMesh.clone()
			SCENE.add(mesh)
			const body = new CANNON.Body({
				mass: DICE_MASS,
				shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
				sleepTimeLimit: 0.2
			})
			PHYSICS.addBody(body)
			diceArray.value.push({ mesh, body })
		}
		placeDiceIn4x4Layers(diceArray.value, 4)

		// Start render loop
		function renderLoop() {
			if (!renderer.value || !CAMERA) return
			// Step the physics
			PHYSICS.fixedStep()

			// Sync Three.js meshes with Cannon bodies
			for (const dice of diceArray.value) {
				dice.mesh.position.copy(dice.body.position as unknown as THREE.Vector3)
				dice.mesh.quaternion.copy(dice.body.quaternion as unknown as THREE.Quaternion)
			}

			renderer.value.render(SCENE, CAMERA)
			requestAnimationFrame(renderLoop)
		}
		renderLoop()
	}

	function handleResize() {
		if (!canvas.value || !renderer.value || !CAMERA) return

		width.value = canvas.value.clientWidth
		height.value = canvas.value.clientHeight

		renderer.value.setSize(width.value, height.value)

		// Update orthographic boundaries
		CAMERA.left = -halfSizeX.value
		CAMERA.right = halfSizeX.value
		CAMERA.top = halfSizeZ.value
		CAMERA.bottom = -halfSizeZ.value
		CAMERA.updateProjectionMatrix()
	}

	function throwDice() {
		placeDiceIn4x4Layers(diceArray.value, 4)
		diceArray.value.forEach((d, idx) => {
			d.body.velocity.setZero()
			d.body.angularVelocity.setZero()

			const startX = -halfSizeX.value + idx * 2
			const startZ = halfSizeZ.value - 3
			d.body.position.set(startX, 2, startZ)

			d.body.quaternion.setFromEuler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI)

			const forceZ = CONFIG.throwForce * Math.random() * 2
			const forceX = ((Math.random() < 0.5 ? 1 : -1) * CONFIG.throwForce) / 2
			d.body.applyImpulse(new CANNON.Vec3(forceX, 0, -forceZ), new CANNON.Vec3(0, 0, 0))
			d.body.allowSleep = true
		})
	}

	watch(canvas, value => {
		setTimeout(() => {
			if (!value) return
			createScene()
		}, 0)
	})

	onMounted(() => {
		window.addEventListener('resize', handleResize)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize)
	})

	return {
		throwDice
	}
}
