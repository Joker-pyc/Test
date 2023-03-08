import * as THREE from 'three';
import Stats from '/jsm/libs/stats.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import VirtualJoystick from '/jsm/controls/Joystick.js';
import Box from '/build/objects.js'


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

// create a fog that is dark gray and extends from 5 to 25 units
const fogColor = 0x111111;
const fogNear = 5;
const fogFar = 30;
const fog = new THREE.Fog(fogColor, fogNear, fogFar);


scene.fog = new THREE.FogExp2(0x999999, 0.03);

  // Add a camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
  camera.position.set(0, 6, 30);


  scene.add(camera);

  // Add orbit controls

  // Add physics components
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const overlappingPairCache = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();
  const world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  world.setGravity(new Ammo.btVector3(0, -9.8, 0));




let bullets = [];


let groundGeometry = new THREE.BoxGeometry(200, 1, 200);
let groundMaterial = new THREE.MeshPhongMaterial({color: 0xffffff,wireframe: false });

let ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.castShadow = false; 
scene.add(ground);

// Create the ground physics body
let groundShape = new Ammo.btBoxShape(new Ammo.btVector3(100, 0.5, 100));
let groundTransform = new Ammo.btTransform();
groundTransform.setIdentity();
groundTransform.setOrigin(new Ammo.btVector3(ground.position.x, ground.position.y, ground.position.z));
let groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
let groundMass = 0;
let localInertia = new Ammo.btVector3(0, 0, 0);
let groundRBInfo = new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, localInertia);
let groundBody = new Ammo.btRigidBody(groundRBInfo);
groundBody.setRestitution(0.3);
groundBody.setFriction(10);
world.addRigidBody(groundBody);

  // Create the sphere mesh
  let sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  let sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, 10, 0)
  sphere.castShadow = true;
  scene.add(sphere);

  // Create the sphere physics body
  let sphereShape = new Ammo.btSphereShape(1);
  let sphereTransform = new Ammo.btTransform();
  sphereTransform.setIdentity();
  sphereTransform.setOrigin(new Ammo.btVector3(sphere.position.x, sphere.position.y, sphere.position.z));
  let sphereMotionState = new Ammo.btDefaultMotionState(sphereTransform);
  let sphereMass = 10;
  let sphereInertia = new Ammo.btVector3(0, 0, 0);
  sphereShape.calculateLocalInertia(sphereMass, sphereInertia);
  let sphereRBInfo = new Ammo.btRigidBodyConstructionInfo(sphereMass, sphereMotionState, sphereShape, sphereInertia);
  let sphereBody = new Ammo.btRigidBody(sphereRBInfo);
  sphereBody.setRestitution(2);
  sphereBody.setFriction(0);
  sphereBody.setActivationState(4);
  world.addRigidBody(sphereBody);



const cameraDistance = 20;
  const cameraHeight = 6;
  const cameraOffset = new THREE.Vector3(0, cameraHeight, -cameraDistance);

 
 
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.rotateSpeed = 0.5;


  let sphereBodyy, sphereSpeed = 0,
    sphereDirection = new THREE.Vector3(0, 0, 0);
  const ammoVec = new Ammo.btVector3();


// Create joystick object
/*const joystick = new VirtualJoystick(container, {
  width: 150,
  height: 150,
  color: 'grey',
  handleColor: 'black',
  handleRadius: 38,
  onChange: function(delta) {
    // Calculate sphere rotation based on camera azimuthal angle
    const sphereRotation = new THREE.Vector3(0, controls.getAzimuthalAngle(), 0);

    // Calculate sphere direction and speed based on joystick input
    const speed = new THREE.Vector3(delta.x, 0, delta.y);
    speed.applyAxisAngle(new THREE.Vector3(0, 1, 0), sphereRotation.y);
    sphereDirection.copy(speed);

    // Apply acceleration and deceleration to sphere movement
    const acceleration = new THREE.Vector3(0, 0, 0);
    const maxSpeed = 10;
    if (Math.sqrt(delta.x * delta.x + delta.y * delta.y) > 0) {
      acceleration.copy(sphereDirection.normalize());
      acceleration.multiplyScalar(0.1);
      sphereSpeed = Math.min(sphereSpeed + acceleration.length(), maxSpeed);
    } else {
      sphereSpeed = Math.max(sphereSpeed - 0.1, 0);
    }
    sphereDirection.multiplyScalar(sphereSpeed);

    // Apply sphere movement to sphere physics body
    const physicsBody = sphereBody;
    const velocity = new Ammo.btVector3(sphereDirection.x, sphereDirection.y, sphereDirection.z);
    physicsBody.setLinearVelocity(velocity);
    physicsBody.setActivationState(1);
  }
});
*/
const joystick = new VirtualJoystick(container, {
  width: 150,
  height: 150,
  color: 'grey',
  handleColor: 'black',
  handleRadius: 38,
  onChange: function(delta) {
    // Calculate sphere rotation based on camera azimuthal angle
    const sphereRotation = new THREE.Vector3(0, controls.getAzimuthalAngle(), 0);

    // Calculate sphere direction and speed based on joystick input
    const speed = new THREE.Vector3(delta.x, 0, delta.y);
    speed.applyAxisAngle(new THREE.Vector3(0, 1, 0), sphereRotation.y);
    sphereDirection.copy(speed);

    // Apply acceleration and deceleration to sphere movement
    const acceleration = new THREE.Vector3(0, 0, 0);
    const maxSpeed = 10;
    if (Math.sqrt(delta.x * delta.x + delta.y * delta.y) > 0) {
      acceleration.copy(sphereDirection.normalize());
      acceleration.multiplyScalar(0.1);
      sphereSpeed = Math.min(sphereSpeed + acceleration.length(), maxSpeed);
    } else {
      sphereSpeed = Math.max(sphereSpeed - 0.1, 0);
    }
    sphereDirection.multiplyScalar(sphereSpeed);

    // Apply sphere movement to sphere physics body
    const physicsBody = sphereBody;
    const velocity = new Ammo.btVector3(sphereDirection.x, sphereDirection.y, sphereDirection.z);
    physicsBody.setLinearVelocity(velocity);
    physicsBody.setActivationState(1);

    // Add friction to the sphere movement
    const friction = new THREE.Vector3();
    friction.copy(physicsBody.getLinearVelocity());
    friction.negate();
    friction.multiplyScalar(0.01);
    physicsBody.applyCentralImpulse(friction);

    // Add gravity to the sphere movement
    const gravity = new THREE.Vector3(0, -0.1, 0);
    physicsBody.applyCentralImpulse(new Ammo.btVector3(gravity.x, gravity.y, gravity.z));

    // Add bouncing to the sphere movement
    const restitution = 0.5;
    const groundHeight = -10;
    const spherePosition = sphereBody.getWorldTransform().getOrigin();
    if (spherePosition.y() < groundHeight) {
      const velocity = physicsBody.getLinearVelocity();
      const speed = velocity.length();
      if (speed > 1) {
        velocity.normalize();
        velocity.multiplyScalar(speed * restitution);
        physicsBody.setLinearVelocity(velocity);
      }
      spherePosition.setY(groundHeight);
      sphereBody.getWorldTransform().setOrigin(spherePosition);
    }
  }
});




  function followCam() {
    sphere.updateMatrixWorld()
    camera.position.sub(controls.target)
    controls.target.copy(sphere.position)
    camera.position.add(sphere.position)
  };




 window.addEventListener('click', click);

  function click() {
    // body...
    let physicsBody = sphereBody
    let resultantImpulse = new Ammo.btVector3(0, 10, 0)
    resultantImpulse.op_mul(1);
    
    physicsBody.setLinearVelocity(resultantImpulse);
  }

// Create a box instance with dimensions of 10m x 10m x 10m and a mass of 0





  function animate() {
    requestAnimationFrame(animate);

    // Step the physics world
    world.stepSimulation(1 / 60, 10);

    // Update the position of the sphere mesh based on its physics body
    let sphereTransform = new Ammo.btTransform();
    sphereBody.getMotionState().getWorldTransform(sphereTransform);
    let sphereOrigin = sphereTransform.getOrigin();
    sphere.position.set(sphereOrigin.x(), sphereOrigin.y(), sphereOrigin.z());

    // Check for collisions between the sphere and the ground
    let dispatcher = world.getDispatcher();
    let numManifolds = dispatcher.getNumManifolds();
    for (let i = 0; i < numManifolds; i++) {
      let contactManifold = dispatcher.getManifoldByIndexInternal(i);
      let rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
      let rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);

      if ((rb0 === sphereBody && rb1 === groundBody) || (rb0 === groundBody && rb1 === sphereBody)) {
        let numContacts = contactManifold.getNumContacts();
        for (let j = 0; j < numContacts; j++) {
          let contactPoint = contactManifold.getContactPoint(j);
          let distance = contactPoint.getDistance();
          if (distance < 0) {
            console.log("Sphere collided with ground!");
          }
        }
      }
    }
    

    // Update the position of the camera to follow the sphere
    followCam();
// Update the positions and rotations of the platform boxes
stats.update();
    // Render the scene
    renderer.render(scene, camera);
  }

  animate();
});