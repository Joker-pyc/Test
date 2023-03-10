import * as THREE from 'three';
import Stats from '/jsm/libs/stats.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import VirtualJoystick from '/jsm/controls/Joystick.js';
import {Box,Sphere, Capsule} from '/build/objects.js'
import * as Objects from '/build/objects.js';



Ammo().then(function(Ammo) {
let renderer, scene, camera, world, stats, container, raycaster, fog, groundBox, leftWallBox, rightWallBox, frontWallBox, backWallBox;
  // Detects webgl
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
  }
   container = document.getElementById('joystick-container');

  // Create the renderer
   renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);


  // Create the scene
   scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

 raycaster = new THREE.Raycaster();


const fogColor = new THREE.Color(0x000000);
const fogNear = 10;
const fogFar = 100;
 fog = new THREE.Fog(fogColor, fogNear, fogFar);

// Set the fog for the scene
scene.fog = fog;


    stats = new Stats();
    document.body.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, true);


    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }


  // Add orbit controls

  // Add physics components
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const overlappingPairCache = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();
   world = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  world.setGravity(new Ammo.btVector3(0, -9.8, 0));


let gdx = 500
let gdz = 500
// Define the dimensions of the ground and the walls
const groundDimensions = new THREE.Vector3(gdx, 1, gdz);
const wallThickness = 2;
const wallHeight = 20;

// Create the ground box
const groundPosition = new THREE.Vector3(0, -0.5, 0);
 groundBox = new Box(scene, world, groundPosition, groundDimensions, 0);

// Create the four walls
const leftWallPosition = new THREE.Vector3(-groundDimensions.x / 2 - wallThickness / 2, wallHeight / 2, 0);
 leftWallBox = new Box(scene, world, leftWallPosition, new THREE.Vector3(wallThickness, wallHeight, groundDimensions.z), 0);

const rightWallPosition = new THREE.Vector3(groundDimensions.x / 2 + wallThickness / 2, wallHeight / 2, 0);
 rightWallBox = new Box(scene, world, rightWallPosition, new THREE.Vector3(wallThickness, wallHeight, groundDimensions.z), 0);

const frontWallPosition = new THREE.Vector3(0, wallHeight / 2, -groundDimensions.z / 2 - wallThickness / 2);
 frontWallBox = new Box(scene, world, frontWallPosition, new THREE.Vector3(groundDimensions.x, wallHeight, wallThickness), 0);

const backWallPosition = new THREE.Vector3(0, wallHeight / 2, groundDimensions.z / 2 + wallThickness / 2);
backWallBox = new Box(scene, world, backWallPosition, new THREE.Vector3(groundDimensions.x, wallHeight, wallThickness), 0);

// Set the color of the walls
const wallColor = new THREE.Color(0xffffff);
// Set the color of the left wall
groundBox.setFriction(10);
groundBox.setBounciness(0.2);

leftWallBox.setColor(wallColor);
rightWallBox.setColor(wallColor);
frontWallBox.setColor(wallColor);
backWallBox.setColor(wallColor);

const blor = new THREE.Color(0xCCCCCC);
// Define the maze dimensions and cell size
const mazeWidth = gdx/20;
const mazeHeight = gdz/20;
const cellSize = 20;

// Create the maze grid
const maze = [];
for (let i = 0; i < mazeWidth; i++) {
  maze[i] = [];
  for (let j = 0; j < mazeHeight; j++) {
    maze[i][j] = {
      x: i,
      y: j,
      visited: false,
      walls: {
        top: true,
        right: true,
        bottom: true,
        left: true
      }
    };
  }
}

// Recursive backtracking algorithm
const stack = [];
let currentCell = maze[0][0];
currentCell.visited = true;
stack.push(currentCell);

while (stack.length > 0) {
  currentCell = stack.pop();
  const neighbors = getUnvisitedNeighbors(currentCell);
  if (neighbors.length > 0) {
    stack.push(currentCell);
    const chosenNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    removeWall(currentCell, chosenNeighbor);
    chosenNeighbor.visited = true;
    stack.push(chosenNeighbor);
  }
}

// Helper functions
function getUnvisitedNeighbors(cell) {
  const neighbors = [];
  const x = cell.x;
  const y = cell.y;
  if (y > 0 && !maze[x][y - 1].visited) {
    neighbors.push(maze[x][y - 1]);
  }
  if (x < mazeWidth - 1 && !maze[x + 1][y].visited) {
    neighbors.push(maze[x + 1][y]);
  }
  if (y < mazeHeight - 1 && !maze[x][y + 1].visited) {
    neighbors.push(maze[x][y + 1]);
  }
  if (x > 0 && !maze[x - 1][y].visited) {
    neighbors.push(maze[x - 1][y]);
  }
  return neighbors;
}

function removeWall(cell1, cell2) {
  const xDiff = cell1.x - cell2.x;
  const yDiff = cell1.y - cell2.y;
  if (xDiff === 1) {
    cell1.walls.left = false;
    cell2.walls.right = false;
  } else if (xDiff === -1) {
    cell1.walls.right = false;
    cell2.walls.left = false;
  }
  if (yDiff === 1) {
    cell1.walls.top = false;
    cell2.walls.bottom = false;
  } else if (yDiff === -1) {
    cell1.walls.bottom = false;
    cell2.walls.top = false;
    }
    }
    
    // Create the maze walls
    for (let i = 0; i < mazeWidth; i++) {
      for (let j = 0; j < mazeHeight; j++) {
        const cell = maze[i][j];
        const x = i * cellSize - mazeWidth * cellSize / 2 + cellSize / 2;
        const y = j * cellSize - mazeHeight * cellSize / 2 + cellSize / 2;
    
      
        if (cell.walls.top) {
          const position = new THREE.Vector3(x, wallHeight / 2, y - cellSize / 2 - wallThickness / 2);
          const size = new THREE.Vector3(cellSize, wallHeight, wallThickness);
          const box = new Box(scene, world, position, size, 0);
          box.setColor(wallColor);
        }
    
        if (cell.walls.right) {
          const position = new THREE.Vector3(x + cellSize / 2 + wallThickness / 2, wallHeight / 2, y);
          const size = new THREE.Vector3(wallThickness, wallHeight, cellSize);
          const box = new Box(scene, world, position, size, 0);
          box.setColor(wallColor);
        }
    
        if (cell.walls.bottom) {
          const position = new THREE.Vector3(x, wallHeight / 2, y + cellSize / 2 + wallThickness / 2);
          const size = new THREE.Vector3(cellSize, wallHeight, wallThickness);
          const box = new Box(scene, world, position, size, 0);
          box.setColor(wallColor);
        }
    
        if (cell.walls.left) {
          const position = new THREE.Vector3(x - cellSize / 2 - wallThickness / 2, wallHeight / 2, y);
          const size = new THREE.Vector3(wallThickness, wallHeight, cellSize);
          const box = new Box(scene, world, position, size, 0);
          box.setColor(wallColor);
        }
      }
    }
    

  // Add a camera
   camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
  camera.position.set(0, 30, 30);


  scene.add(camera);

const cameraDistance = 20;
  const cameraHeight = 6;
  const cameraOffset = new THREE.Vector3(0, cameraHeight, -cameraDistance);
 
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.rotateSpeed = 0.5;


// Define a variable to store the previous camera position
let previousCameraPosition = new THREE.Vector3();



// Create the sphere mesh
let sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 10, 0)
scene.add(sphere);

// Create the sphere physics body
let sphereShape = new Ammo.btSphereShape(1);
let sphereTransform = new Ammo.btTransform();
sphereTransform.setIdentity();
sphereTransform.setOrigin(new Ammo.btVector3(sphere.position.x, sphere.position.y, sphere.position.z));
let sphereMotionState = new Ammo.btDefaultMotionState(sphereTransform);
let sphereMass = 1;
let sphereInertia = new Ammo.btVector3(0, 0, 0);
sphereShape.calculateLocalInertia(sphereMass, sphereInertia);
let sphereRBInfo = new Ammo.btRigidBodyConstructionInfo(sphereMass, sphereMotionState, sphereShape, sphereInertia);
let sphereBody = new Ammo.btRigidBody(sphereRBInfo);
sphereBody.setRestitution(0.9);
sphereBody.setFriction(0);
world.addRigidBody(sphereBody);
const physicsBody = sphereBody;
  let sphereBodyy, sphereSpeed = 0,
    sphereDirection = new THREE.Vector3(0, -10, 0);
  const ammoVec = new Ammo.btVector3();

const joystick = new VirtualJoystick(container, {
  width: 150,
  height: 150,
  color: 'grey',
  handleColor: 'black',
  handleRadius: 38
});

function updateJoystick() {
  // Get the joystick delta value

// Calculate sphere rotation based on camera azimuthal angle
  const sphereRotation = new THREE.Vector3(0, controls.getAzimuthalAngle(), 0);

  // Calculate sphere direction and speed based on joystick input
  const speed = new THREE.Vector3(joystick.delta.x, 0, joystick.delta.y);
  speed.applyAxisAngle(new THREE.Vector3(0, 1, 0), sphereRotation.y);
  sphereDirection.copy(speed);

  // Apply acceleration and deceleration to sphere movement
  const acceleration = new THREE.Vector3(0, 0, 0);
  const maxSpeed = 10;
  if (Math.sqrt(joystick.delta.x * joystick.delta.x + joystick.delta.y * joystick.delta.y) > 0) {
    acceleration.copy(sphereDirection.normalize());
    acceleration.multiplyScalar(0.1);
    sphereSpeed = Math.min(sphereSpeed + acceleration.length(), maxSpeed);
  } else {
    sphereSpeed = Math.max(sphereSpeed - 0.1, 0);
  }
  sphereDirection.multiplyScalar(sphereSpeed);

  // Apply sphere movement to sphere physics body
  
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
    const gravity = new THREE.Vector3(0, -0.5, 0);
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

  // Update the joystick value continuously
  requestAnimationFrame(updateJoystick);
}

// Start updating the joystick
updateJoystick();



  function followCam() {
    sphere.updateMatrixWorld()
    camera.position.sub(controls.target)
    controls.target.copy(sphere.position)
    camera.position.add(sphere.position)
    previousCameraPosition.copy(camera.position);
  };

const position = new THREE.Vector3(0, 10, 0);
const radius = 1;
const mass = 1;
const spheree = new Sphere(scene, world, position, radius, mass);



 window.addEventListener('click', click);

  let canJump = true;

window.addEventListener('click', click);

function click() {
  if (!canJump) {
    return; // Don't jump if not allowed
  }

  
  let resultantImpulse = new Ammo.btVector3(0, 10, 0);
  resultantImpulse.op_mul(1);

  physicsBody.setLinearVelocity(resultantImpulse);

  canJump = false; // Set flag to disallow jumping again until collision with ground
}







  let sphereOrigin = new Ammo.btVector3();
sphereOrigin = sphereTransform.getOrigin();

  function animate() {
    requestAnimationFrame(animate);

    // Step the physics world
    world.stepSimulation(1 / 60, 10);

    // Update the position of the sphere mesh based on its physics body
     
    sphereBody.getMotionState().getWorldTransform(sphereTransform);
    
    sphere.position.set(sphereOrigin.x(), sphereOrigin.y(), sphereOrigin.z());

 // Update the position of the camera to follow the sphere
 
 let dispatcher = world.getDispatcher();
 let numManifolds = dispatcher.getNumManifolds();
 for (let i = 0; i < numManifolds; i++) {
   let contactManifold = dispatcher.getManifoldByIndexInternal(i);
   let rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
   let rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);
 
   if ((rb0 === sphereBody && rb1 === groundBox.body) || (rb0 === groundBox.body && rb1 === sphereBody)) {
     let numContacts = contactManifold.getNumContacts();
     for (let j = 0; j < numContacts; j++) {
       let contactPoint = contactManifold.getContactPoint(j);
       let distance = contactPoint.getDistance();
       if (distance < 0) {
         console.log("Sphere collided with ground!");
         canJump = true; // Reset flag to allow jumping again
       }
     }
   }
 }
    followCam();
// Update the positions and rotations of the platform boxes
stats.update();
spheree.update();
    // Render the scene
   const spherePositionElement = document.getElementById('sphere-position');
spherePositionElement.textContent = `position: x=${sphere.position.x.toFixed(2)}, y=${sphere.position.y.toFixed(2)}, z=${sphere.position.z.toFixed(2)}`;


    renderer.render(scene, camera);
  }

  animate();
});