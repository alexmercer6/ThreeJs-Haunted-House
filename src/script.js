import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

//Fog
const fog = new THREE.Fog('#262837', 1, 20);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

//Door
const doorTexture = textureLoader.load('textures/door/color.jpg');
const alphaTexture = textureLoader.load('textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load(
  'textures/door/ambientOcclusion.jpg'
);
const heightTexture = textureLoader.load('textures/door/height.jpg');
const metalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const normalTexture = textureLoader.load('textures/door/normal.jpg');
const roughnessTexture = textureLoader.load('textures/door/roughness.jpg');

//Bricks
const bricksAmbientOcclusionTexture = textureLoader.load(
  'textures/bricks/ambientOcclusion.jpg'
);
const brickTexture = textureLoader.load('textures/bricks/color.jpg');
const bricksNormalTexture = textureLoader.load('textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  'textures/bricks/roughness.jpg'
);

//Grass
const grassTexture = textureLoader.load('textures/grass/color.jpg');
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
  'textures/bricks/ambientOcclusion.jpg'
);
const grassRoughnessTexture = textureLoader.load(
  'textures/grass/roughness.jpg'
);

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

//Walls
const wallHeight = 2.5;
const houseWidth = 4;
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(houseWidth, wallHeight, 4),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: brickTexture,
    aoMap: bricksAmbientOcclusionTexture,
    aoMapIntensity: 5,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.position.y = wallHeight / 2;
house.add(walls);

//Door
const doorWidth = 2.2;
const doorHeight = 2.2;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorWidth, doorHeight, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorTexture,
    alphaMap: alphaTexture,
    aoMap: ambientOcclusionTexture,
    aoMapIntensity: 5,
    displacementMap: heightTexture,
    displacementScale: 0.1,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalnessMap: metalnessTexture,
  })
);

door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = houseWidth / 2 + 0.01;
door.position.y = doorHeight / 2;
house.add(door);

//Roof
const roofHeight = 2;
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.y = wallHeight + roofHeight / 2;
roof.rotation.y = Math.PI * 0.25;

house.add(roof);

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.1, 2.1);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.14, 0.14, 0.14);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = houseWidth + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;

  grave.position.set(x, 0.8 / 2, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: grassTexture,
    aoMap: grassAmbientOcclusionTexture,
    aoMapIntensity: 3,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

grassTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassTexture.wrapS = THREE.RepeatWrapping;

grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

//Point Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, doorHeight + 0.5, houseWidth / 2 + 1);
const doorLightHelper = new THREE.PointLightHelper(doorLight);
doorLightHelper.visible = false;
// doorLight.rotation.y = 1;

house.add(doorLight, doorLightHelper);

//Ghosts
const ghost1 = new THREE.PointLight('#ff0000', 1, 15);
const ghost2 = new THREE.PointLight('#ff00ff', 1, 15);
const ghost3 = new THREE.PointLight('#00ff00', 1, 15);

scene.add(ghost1, ghost2, ghost3);

//Shadows
walls.castShadow = true;
doorLight.castShadow = true;
moonLight.castShadow = true;
floor.receiveShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.maxDistance = 13;
controls.minDistance = 3;
controls.zoomSpeed = 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

controls.maxPolarAngle = 1.5;

controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
// renderer.castShadow = true;
// renderer.receiveShadow = true;
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.5;

  ghost1.position.x = Math.cos(ghost1Angle) * 3;
  ghost1.position.y = Math.sin(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(elapsedTime * 4);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
