import * as THREE from 'three';
import Stats from '/jsm/libs/stats.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import VirtualJoystick from '/jsm/controls/Joystick.js';
import {Box,Sphere, Capsule} from '/build/objects.js'
import * as Objects from '/build/objects.js';

Ammo().then(function(Ammo) {

  // Detects webgl
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
  }
  const container = document.getElementById('joystick-container');

  // Create the renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Resize renderer when window is resized
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  // Create the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

const raycaster = new THREE.Raycaster();


const fogColor = new THREE.Color(0x000000);
const fogNear = 10;
const fogFar = 100;
const fog = new THREE.Fog(fogColor, fogNear, fogFar);

// Set the fog for the scene
scene.fog = fog;

// create a realistic directional light with soft shadows
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 100;
light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;
light.shadow.camera.bias = -0.0001; // reduce shadow acne
light.shadow.radius = 2; // soften shadows
scene.add(light);

// create a helper for the light
const helper = new THREE.DirectionalLightHelper(light, 5);
scene.add(helper);


  let  stats = new Stats();
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, true);


    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }


// create a point light at the same location as the sphere


class ThirdPersonCamera {
  constructor(camera, target, distance, height) {
    this.camera = camera;
    this.target = target;
    this.distance = distance;
    this.height = height;

    this.currentDistance = distance;
    this.currentHeight = height;
    this.targetDistance = distance;
    this.targetHeight = height;

    this.maxDistance = 100;
    this.minDistance = 0;
    this.maxHeight = 100;
    this.minHeight = 0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchMoveX = 0;
    this.touchMoveY = 0;

    this.updateCamera();
  }

  updateCamera() {
    const { camera, target, currentDistance, currentHeight } = this;

    // Calculate the camera position based on the target position and the current distance and height
    const cameraPosition = new THREE.Vector3();
    cameraPosition.x = target.position.x - currentDistance * Math.sin(target.rotation.y);
    cameraPosition.y = target.position.y + currentHeight;
    cameraPosition.z = target.position.z - currentDistance * Math.cos(target.rotation.y);

    // Set the camera position and look at the target
    camera.position.copy(cameraPosition);
    camera.lookAt(target.position);
  }

  handleTouchStart(event) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  handleTouchMove(event) {
    this.touchMoveX = event.touches[0].clientX;
    this.touchMoveY = event.touches[0].clientY;

    const dx = this.touchMoveX - this.touchStartX;
    const dy = this.touchMoveY - this.touchStartY;

    // Update the target distance and height based on the touch input
    this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.currentDistance - dy * 0.1));
    this.targetHeight = Math.max(this.minHeight, Math.min(this.maxHeight, this.currentHeight + dx * 0.1));

    this.touchStartX = this.touchMoveX;
    this.touchStartY = this.touchMoveY;
  }

  update(dt) {
    // Smoothly interpolate the current distance and height towards the target values
    this.currentDistance += (this.targetDistance - this.currentDistance) * dt * 10;
    this.currentHeight += (this.targetHeight - this.currentHeight) * dt * 10;

    this.updateCamera();
  }
}


  // Add orbit controls

  // Add physics components
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const overlappingPairCache = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();
  const world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  world.setGravity(new Ammo.btVector3(0, -9.8, 0));



class ThirdPersonCharacterControl {
  constructor(scene, camera, controls, target) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.target = target;

    // Create a child object to attach the camera to
    this.cameraTarget = new THREE.Object3D();
    this.cameraTarget.position.set(0, 2, 0);
    this.target.add(this.cameraTarget);

    // Set the camera position and look at the camera target
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(this.cameraTarget.position);

    // Create a virtual joystick and move the target based on its input
    const joystick = new VirtualJoystick(container, {
      width: 150,
      height: 150,
      color: 'grey',
      handleColor: 'black',
      handleRadius: 38,
    });

    // Define a function to update the target position based on joystick input
    const updateTargetPosition = () => {
      // Calculate target rotation based on camera azimuthal angle
      const playerRotation = new THREE.Vector3(0, this.controls.getAzimuthalAngle(), 0);

      // Calculate target direction and speed based on joystick input
      const speed = new THREE.Vector3(joystick.delta.x, 0, joystick.delta.y);
      speed.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRotation.y);
      const targetDirection = speed.clone();

      // Move the target based on the calculated direction and speed
      this.target.position.add(targetDirection.multiplyScalar(0.1));

      // Update the camera target position to match the target position
      this.cameraTarget.position.copy(this.target.position);

      // Call the updateTargetPosition function again on the next frame
      requestAnimationFrame(updateTargetPosition);
    }

    // Call the updateTargetPosition function to start the movement
    updateTargetPosition();
  }

  update() {
    this.controls.update();

    // Follow the target with the camera
    this.target.updateMatrixWorld();
    this.camera.position.sub(this.controls.target);
    this.controls.target.copy(this.target.position);
    this.camera.position.add(this.target.position);
  }
}

// Declare the renderer object outside the class

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add OrbitControls to the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 50;

// Create a sphere as the target for the camera to follow
const target = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
scene.add(target);

// Create an instance of ThirdPersonCharacterControl
const thirdPersonControl = new ThirdPersonCharacterControl(scene, camera, controls, target);

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  thirdPersonControl.update();
  renderer.render(scene, camera);
}

animate();


});