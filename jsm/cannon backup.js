import * as THREE from 'three';

import * as CANNON from '/modules/cannon-es.js'
//import * as THREE from '/modules/Sky.js'
//import Stats from '/modules/stats.module.js'
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import CannonDebugRenderer from '/modules/cannon-es-debugger.js';



const scene = new THREE.Scene()
    var light = new THREE.DirectionalLight()
    light.position.set(25, 50, 25)
    light.castShadow = true
    light.shadow.mapSize.width = 8192
    light.shadow.mapSize.height = 8192
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 100
    light.shadow.camera.top = 100
    light.shadow.camera.bottom = -100
    light.shadow.camera.left = -100
    light.shadow.camera.right = 100
    scene.add(light)
    const helper = new THREE.CameraHelper(light.shadow.camera)
    scene.add(helper)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000)
    const chaseCam = new THREE.Object3D()
    chaseCam.position.set(0, 0, 0)
    const chaseCamPivot = new THREE.Object3D()
    chaseCamPivot.position.set(0, 2, 6)
    chaseCam.add(chaseCamPivot)
    scene.add(chaseCam)
    const renderer = new THREE.WebGLRenderer({antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.setClearColor( 0xfffff)
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)
    
      let controls = new THREE.OrbitControls(camera, renderer.domElement)



    //create fppCamera 
 let   fppCamera = new THREE.PerspectiveCamera(45, window.innerWidth /
      window.innerHeight, 0.2, 1000000);
    fppCamera.position.y = 5;
    fppCamera.position.x = 0;
    fppCamera.position.z = 0;
    // fppCamera.lookAt(0, 10, 0)
    controls = new THREE.OrbitControls(fppCamera, renderer.domElement);
    controls.enabled = true;

    controls.dampingFactor = 4; // friction
    controls.rotateSpeed = 0.6; // mouse sensitivity
    controls.enableZoom = true;



    const phongMaterial = new THREE.MeshPhongMaterial()
    const world = new CANNON.World()
    world.gravity.set(0, -9.82, 0)
    const groundMaterial = new CANNON.Material('groundMaterial')
    groundMaterial.friction = 0.25
    groundMaterial.restitution = 0.25
    var wheelMaterial = new CANNON.Material('wheelMaterial')
    wheelMaterial.friction = 0.25
    wheelMaterial.restitution = 0.25
    //ground
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000)
    const groundMesh = new THREE.Mesh(groundGeometry, new THREE.MeshPhongMaterial({color: 0xf35f0}))
    groundMesh.rotateX(-Math.PI / 2)
    groundMesh.receiveShadow = true
    scene.add(groundMesh)
    const groundShape = new CANNON.Box(new CANNON.Vec3(5000, 1, 5000))
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial })
    groundBody.addShape(groundShape)
    groundBody.position.set(0, -1, 0)
    world.addBody(groundBody)
  
  // Create the water plane geometry
  
/*  
    //jumps
   for (var i = 0; i < 100; i++) {
      const jump = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 0.5, 5), phongMaterial)
      jump.position.x = Math.random() * 100 - 50
      jump.position.y = 0.5
      jump.position.z = Math.random() * 100 - 50
      scene.add(jump)
      const cylinderShape = new CANNON.Cylinder(0.01, 1, 0.5, 5)
      const cylinderBody = new CANNON.Body({ mass: 0 })
      cylinderBody.addShape(cylinderShape, new CANNON.Vec3())
      cylinderBody.position.x = jump.position.x
      cylinderBody.position.y = jump.position.y
      cylinderBody.position.z = jump.position.z
      world.addBody(cylinderBody)
    }
  */
    
    const carBodyGeometry = new THREE.BoxGeometry(1, 1, 2)
    const carBodyMesh = new THREE.Mesh(carBodyGeometry, phongMaterial)
    carBodyMesh.position.y = 3
    carBodyMesh.castShadow = true
    scene.add(carBodyMesh)
    carBodyMesh.add(chaseCam)
    const carBodyShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1))
    const carBody = new CANNON.Body({ mass: 1 })
    carBody.addShape(carBodyShape)
    carBody.position.x = carBodyMesh.position.x
    carBody.position.y = carBodyMesh.position.y
    carBody.position.z = carBodyMesh.position.z
    world.addBody(carBody)
    //front left wheel
    const wheelLFGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2)
    wheelLFGeometry.rotateZ(Math.PI / 2)
    const wheelLFMesh = new THREE.Mesh(wheelLFGeometry, phongMaterial)
    wheelLFMesh.position.x = -1
    wheelLFMesh.position.y = 3
    wheelLFMesh.position.z = -1
    wheelLFMesh.castShadow = true
    scene.add(wheelLFMesh)
    const wheelLFShape = new CANNON.Sphere(0.33)
    const wheelLFBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
    wheelLFBody.addShape(wheelLFShape)
    wheelLFBody.position.x = wheelLFMesh.position.x
    wheelLFBody.position.y = wheelLFMesh.position.y
    wheelLFBody.position.z = wheelLFMesh.position.z
    world.addBody(wheelLFBody)
    //front right wheel
    const wheelRFGeometry = new THREE.CylinderGeometry(0.33, 0.33, 0.2)
    wheelRFGeometry.rotateZ(Math.PI / 2)
    const wheelRFMesh = new THREE.Mesh(wheelRFGeometry, phongMaterial)
    wheelRFMesh.position.y = 3
    wheelRFMesh.position.x = 1
    wheelRFMesh.position.z = -1
    wheelRFMesh.castShadow = true
    scene.add(wheelRFMesh)
    const wheelRFShape = new CANNON.Sphere(0.33)
    const wheelRFBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
    wheelRFBody.addShape(wheelRFShape)
    wheelRFBody.position.x = wheelRFMesh.position.x
    wheelRFBody.position.y = wheelRFMesh.position.y
    wheelRFBody.position.z = wheelRFMesh.position.z
    world.addBody(wheelRFBody)
    //back left wheel
    const wheelLBGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.33)
    wheelLBGeometry.rotateZ(Math.PI / 2)
    const wheelLBMesh = new THREE.Mesh(wheelLBGeometry, phongMaterial)
    wheelLBMesh.position.y = 3
    wheelLBMesh.position.x = -1
    wheelLBMesh.position.z = 1
    wheelLBMesh.castShadow = true
    scene.add(wheelLBMesh)
    const wheelLBShape = new CANNON.Sphere(0.4)
    const wheelLBBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
    wheelLBBody.addShape(wheelLBShape)
    wheelLBBody.position.x = wheelLBMesh.position.x
    wheelLBBody.position.y = wheelLBMesh.position.y
    wheelLBBody.position.z = wheelLBMesh.position.z
    world.addBody(wheelLBBody)
    //back right wheel
    const wheelRBGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.33)
    wheelRBGeometry.rotateZ(Math.PI / 2)
    const wheelRBMesh = new THREE.Mesh(wheelRBGeometry, phongMaterial)
    wheelRBMesh.position.y = 3
    wheelRBMesh.position.x = 1
    wheelRBMesh.position.z = 1
    wheelRBMesh.castShadow = true
    scene.add(wheelRBMesh)
    const wheelRBShape = new CANNON.Sphere(0.4)
    const wheelRBBody = new CANNON.Body({ mass: 1, material: wheelMaterial })
    wheelRBBody.addShape(wheelRBShape)
    wheelRBBody.position.x = wheelRBMesh.position.x
    wheelRBBody.position.y = wheelRBMesh.position.y
    wheelRBBody.position.z = wheelRBMesh.position.z
    world.addBody(wheelRBBody)
    const leftFrontAxis = new CANNON.Vec3(1, 0, 0)
    const rightFrontAxis = new CANNON.Vec3(1, 0, 0)
    const leftBackAxis = new CANNON.Vec3(1, 0, 0)
    const rightBackAxis = new CANNON.Vec3(1, 0, 0)
    const constraintLF = new CANNON.HingeConstraint(carBody, wheelLFBody, {
      pivotA: new CANNON.Vec3(-1, -0.5, -1),
      axisA: leftFrontAxis,
      maxForce: 0.99,
    })
    world.addConstraint(constraintLF)
    const constraintRF = new CANNON.HingeConstraint(carBody, wheelRFBody, {
      pivotA: new CANNON.Vec3(1, -0.5, -1),
      axisA: rightFrontAxis,
      maxForce: 0.99,
    })
    world.addConstraint(constraintRF)
    const constraintLB = new CANNON.HingeConstraint(carBody, wheelLBBody, {
      pivotA: new CANNON.Vec3(-1, -0.5, 1),
      axisA: leftBackAxis,
      maxForce: 0.99,
    })
    world.addConstraint(constraintLB)
    const constraintRB = new CANNON.HingeConstraint(carBody, wheelRBBody, {
      pivotA: new CANNON.Vec3(1, -0.5, 1),
      axisA: rightBackAxis,
      maxForce: 0.99,
    })
    world.addConstraint(constraintRB)
    //rear wheel drive
    constraintLB.enableMotor()
    constraintRB.enableMotor()
    const keyMap = {}
    const onDocumentKey = (e) => {
      keyMap[e.code] = e.type === 'keydown'
      return false
    }
    let forwardVelocity = 0
    let rightVelocity = 0
    document.addEventListener('keydown', onDocumentKey)
    document.addEventListener('keyup', onDocumentKey)
    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      render()
    }
    const stats = Stats()
    document.body.appendChild(stats.dom)

    const clock = new THREE.Clock()
    let delta
   const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
    const v = new THREE.Vector3()
    let thrusting = false
    
    // Create a falling cube
  let  cmat = new CANNON.Material("slipperyMaterial");
    const cubeBody = new CANNON.Body({
      
      mass: 0.00001, // Give the cube a mass of 1
      cmat, 
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), // Set the size of the cube to be 0.5 x 0.5 x 0.5
    });
    cubeBody.position.set(0, 5, 0); // Set the initial position of the cube to be 5 units above the origin
    world.addBody(cubeBody);
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000 });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cubeMesh);
    
    
    
    var animate = function() {
      
      requestAnimationFrame(animate)
      
      
      
      delta = Math.min(clock.getDelta(), 0.1)
      world.step(delta)
      
      cubeMesh.position.copy(cubeBody.position);
      cubeMesh.quaternion.copy(cubeBody.quaternion);
      
      
      
      cannonDebugRenderer.update()
      // Copy coordinates from Cannon.js to Three.js
      carBodyMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z)
      carBodyMesh.quaternion.set(
        carBody.quaternion.x,
        carBody.quaternion.y,
        carBody.quaternion.z,
        carBody.quaternion.w
      )
      wheelLFMesh.position.set(
        wheelLFBody.position.x,
        wheelLFBody.position.y,
        wheelLFBody.position.z
      )
      wheelLFMesh.quaternion.set(
        wheelLFBody.quaternion.x,
        wheelLFBody.quaternion.y,
        wheelLFBody.quaternion.z,
        wheelLFBody.quaternion.w
      )
      wheelRFMesh.position.set(
        wheelRFBody.position.x,
        wheelRFBody.position.y,
        wheelRFBody.position.z
      )
      wheelRFMesh.quaternion.set(
        wheelRFBody.quaternion.x,
        wheelRFBody.quaternion.y,
        wheelRFBody.quaternion.z,
        wheelRFBody.quaternion.w
      )
      wheelLBMesh.position.set(
        wheelLBBody.position.x,
        wheelLBBody.position.y,
        wheelLBBody.position.z
      )
      wheelLBMesh.quaternion.set(
        wheelLBBody.quaternion.x,
        wheelLBBody.quaternion.y,
        wheelLBBody.quaternion.z,
        wheelLBBody.quaternion.w
      )
      wheelRBMesh.position.set(
        wheelRBBody.position.x,
        wheelRBBody.position.y,
        wheelRBBody.position.z
      )
      wheelRBMesh.quaternion.set(
        wheelRBBody.quaternion.x,
        wheelRBBody.quaternion.y,
        wheelRBBody.quaternion.z,
        wheelRBBody.quaternion.w
      )
      thrusting = false
      if (keyMap['KeyW'] || keyMap['ArrowUp'] || fwdValue>0 ) {
        if (forwardVelocity < 10.0) forwardVelocity += 1
        thrusting = true
      }
      if (keyMap['KeyS'] || keyMap['ArrowDown'] || bkdValue>0 ) {
        if (forwardVelocity > -10.0) forwardVelocity -= 1
        thrusting = true
      }
      if (keyMap['KeyA'] || keyMap['ArrowLeft'] || lftValue>0) {
        if (rightVelocity > -1.0) rightVelocity -= 0.1
      }
      if (keyMap['KeyD'] || keyMap['ArrowRight'] || rgtValue>0) {
        if (rightVelocity < 1.0) rightVelocity += 0.1
      }
      
      
      if (keyMap['Space']) {
        if (forwardVelocity > 0) {
          forwardVelocity -= 1
        }
        if (forwardVelocity < 0) {
          forwardVelocity += 1
        }
      }
          
          
      if (!thrusting) {
        //not going forward or backwards so gradually slow down
        if (forwardVelocity > 0) {
          forwardVelocity -= 0.25
        }
        if (forwardVelocity < 0) {
          forwardVelocity += 0.25 
        }
      if (rightVelocity > 0) {
          rightVelocity -= 0.50
        }
        if (rightVelocity < 0) {
           rightVelocity +=0.50
        }
       
        
      }
      constraintLB.setMotorSpeed(forwardVelocity)
      constraintRB.setMotorSpeed(forwardVelocity)
      constraintLF.axisA.z = rightVelocity
      constraintRF.axisA.z = rightVelocity
      camera.lookAt(carBodyMesh.position)
      chaseCamPivot.getWorldPosition(v)
      if (v.y < 1) {
        v.y = 1
      }
      camera.position.lerpVectors(camera.position, v, 0.05)
      render()
      
      stats.update()
 //   console.log(fwdValue);
    }

    function render() {
      renderer.render(scene, camera)
    }
    animate()
    
    window.focus()
    
    
    
    
    