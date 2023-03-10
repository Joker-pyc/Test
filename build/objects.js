import * as THREE from 'three';



export class Box {
  constructor(scene, world, position, dimensions, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.dimensions = dimensions;
    this.mass = mass;

    // Create a Three.js box geometry
    const boxGeometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);

    // Create a Three.js mesh with the box geometry and a material
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // Set the position of the box mesh
    this.boxMesh.position.copy(position);

    // Add the box mesh to the Three.js scene
    this.scene.add(this.boxMesh);

    // Create a rigid body for the box with Ammo.js
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const origin = new Ammo.btVector3(position.x, position.y, position.z);
    transform.setOrigin(origin);
    mass = this.mass;
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    this.body = body;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.body);
  }

  update() {
    // Update the position of the box mesh to match the position of the rigid body
    const transform = new Ammo.btTransform();
    this.rigidBody.getMotionState().getWorldTransform(transform);
    const origin = transform.getOrigin();
    this.boxMesh.position.set(origin.x(), origin.y(), origin.z());

    // Update the rotation of the box mesh to match the rotation of the rigid body
    const rotation = transform.getRotation();
    this.boxMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
  }
  setFriction(friction) {
    // Set the friction of the rigid body
    this.body.setFriction(friction);
  }

  setBounciness(bounciness) {
    // Set the restitution (bounciness) of the rigid body
    this.body.setRestitution(bounciness);
  }

  applyForce(force) {
    // Apply a force to the rigid body
    const origin = this.rigidBody.getWorldTransform().getOrigin();
    const forceVector = new Ammo.btVector3(force.x, force.y, force.z);
    this.rigidBody.applyCentralForce(forceVector);
  }

  setMass(mass) {
    // Set the mass of the rigid body
    const localInertia = new Ammo.btVector3(0, 0, 0);
    this.rigidBody.getCollisionShape().calculateLocalInertia(mass, localInertia);
    this.rigidBody.setMassProps(mass, localInertia);
  }

  setLinearVelocity(velocity) {
    // Set the linear velocity of the rigid body
    const velocityVector = new Ammo.btVector3(velocity.x, velocity.y, velocity.z);
    this.rigidBody.setLinearVelocity(velocityVector);
  }

  setColor(color) {
    // Set the color of the box mesh
    this.color = color;
    this.boxMesh.material.color.copy(this.color);
  }
}

export class Sphere {
  constructor(scene, world, position, radius, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.radius = radius;
    this.mass = mass;

    // Create a Three.js sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);

    // Create a Three.js mesh with the sphere geometry and a material
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Set the position of the sphere mesh
    this.sphereMesh.position.copy(position);

    // Add the sphere mesh to the Three.js scene
    this.scene.add(this.sphereMesh);

    // Create a rigid body for the sphere with Ammo.js
    const shape = new Ammo.btSphereShape(radius);
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const origin = new Ammo.btVector3(position.x, position.y, position.z);
    transform.setOrigin(origin);
    mass = this.mass;
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    this.body = body;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.body);
  }

  update() {
    // Update the position of the sphere mesh to match the position of the rigid body
    const transform = new Ammo.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    const origin = transform.getOrigin();
    this.sphereMesh.position.set(origin.x(), origin.y(), origin.z());

    // Update the rotation of the sphere mesh to match the rotation of the rigid body
    const rotation = transform.getRotation();
    this.sphereMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
  }

  setFriction(friction) {
    // Set the friction of the rigid body
    this.body.setFriction(friction);
  }

  setBounciness(bounciness) {
    // Set the restitution (bounciness) of the rigid body
    this.body.setRestitution(bounciness);
  }

  applyForce(force) {
    // Apply a force to the rigid body
    const origin = this.body.getWorldTransform().getOrigin();
    const forceVector = new Ammo.btVector3(force.x, force.y, force.z);
    this.body.applyCentralForce(forceVector);
  }

  setMass(mass) {
    // Set the mass of the rigid body
    const localInertia = new Ammo.btVector3(0, 0, 0);
    this.body.getCollisionShape().calculateLocalInertia(mass, localInertia);
    this.body.setMassProps(mass, localInertia);
  }

  setLinearVelocity(velocity) {
    // Set the linear velocity of the rigid body
    const velocityVector = new Ammo.btVector3(velocity.x, velocity.y, velocity.z);
    this.body.setLinearVelocity(velocityVector);
  }

  setColor(color) {
    // Set the color of the sphere mesh
    this.color = color;
    this.sphereMesh.material.color.copy(this.color);
  }
}

export class Capsule {
  constructor(scene, world, position, radius, height, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.radius = radius;
    this.height = height;
    this.mass = mass;

    // Create a Three.js capsule geometry
    const capsuleGeometry = new THREE.CapsuleGeometry(radius, height, 32);

    // Create a Three.js mesh with the capsule geometry and a material
    const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);

    // Set the position of the capsule mesh
    this.capsuleMesh.position.copy(position);

    // Add the capsule mesh to the Three.js scene
    this.scene.add(this.capsuleMesh);

    // Create a rigid body for the capsule with Ammo.js
    const shape = new Ammo.btCapsuleShape(radius, height * 2 * radius);
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const origin = new Ammo.btVector3(position.x, position.y, position.z);
    transform.setOrigin(origin);
    mass = this.mass;
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    this.body = body;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.body);
  }

  update() {
    // Update the position of the capsule mesh to match the position of the rigid body
    const transform = new Ammo.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    const origin = transform.getOrigin();
    this.capsuleMesh.position.set(origin.x(), origin.y(), origin.z());

    // Update the rotation of the capsule mesh to match the rotation of the rigid body
    const rotation = transform.getRotation();
    this.capsuleMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
  }

  setFriction(friction) {
    // Set the friction of the rigid body
    this.body.setFriction(friction);
  }

  setBounciness(bounciness) {
    // Set the restitution (bounciness) of the rigid body
    this.body.setRestitution(bounciness);
  }

  applyForce(force) {
    // Apply a force to the rigid body
    const origin = this.body.getWorldTransform().getOrigin();
    const forceVector = new Ammo.btVector3(force.x, force.y, force.z);
    this.body.applyCentralForce(forceVector);
  }

  setMass(mass) {
    // Set the mass of the rigid body
    const localInertia = new Ammo.btVector3(0, 0, 0);
    this.body.getCollisionShape().calculateLocalInertia(mass, localInertia);
    this.body.setMassProps(mass, localInertia);
  }

  setLinearVelocity(velocity) {
    // Set the linear velocity of the rigid body
    const velocityVector = new Ammo.btVector3(velocity.x, velocity.y, velocity.z);
    this.body.setLinearVelocity(velocityVector);
  }

  setColor(color) {
    // Set the color of the sphere mesh
    this.color = color;
    this.capsuleMesh.material.color.copy(this.color);
  }
}

export class Cone {
  constructor(scene, world, position, radius, height, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.radius = radius;
    this.height = height;
    this.mass = mass;

    // Create a Three.js cone geometry
    const coneGeometry = new THREE.ConeGeometry(radius, height, 32);

    // Create a Three.js mesh with the cone geometry and a material
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);

    // Set the position of the cone mesh
    this.coneMesh.position.copy(position);

    // Add the cone mesh to the Three.js scene
    this.scene.add(this.coneMesh);

    // Create a rigid body for the cone with Ammo.js
    const shape = new Ammo.btConeShape(radius, height);
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const origin = new Ammo.btVector3(position.x, position.y, position.z);
    transform.setOrigin(origin);
    mass = this.mass;
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    this.body = body;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.body);
  }

  update() {
    // Update the position of the cone mesh to match the position of the rigid body
    const transform = new Ammo.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    const origin = transform.getOrigin();
    this.coneMesh.position.set(origin.x(), origin.y(), origin.z());

    // Update the rotation of the cone mesh to match the rotation of the rigid body
    const rotation = transform.getRotation();
    this.coneMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
  }

  setFriction(friction) {
    // Set the friction of the rigid body
    this.body.setFriction(friction);
  }

  setBounciness(bounciness) {
    // Set the restitution (bounciness) of the rigid body
    this.body.setRestitution(bounciness);
  }

  applyForce(force) {
    // Apply a force to the rigid body
    const origin = this.body.getWorldTransform().getOrigin();
    const forceVector = new Ammo.btVector3(force.x, force.y, force.z);
    this.body.applyCentralForce(forceVector);
  }

  setMass(mass) {
    // Set the mass of the rigid body
    const localInertia = new Ammo.btVector3(0, 0, 0);
    this.body.getCollisionShape().calculateLocalInertia(mass, localInertia);
    this.body.setMassProps(mass, localInertia);
  }

  setLinearVelocity(velocity) {
    // Set the linear velocity of the rigid body
    const velocityVector = new Ammo.btVector3(velocity.x, velocity.y, velocity.z);
    this.body.setLinearVelocity(velocityVector);
  }

  setColor(color) {
    // Set the color of the sphere mesh
    this.color = color;
    this.coneMesh.material.color.copy(this.color);
  }
}

export class Cylinder {
  constructor(scene, world, position, dimensions, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.dimensions = dimensions;
    this.mass = mass;

    // Create a Three.js cylinder geometry
    const cylinderGeometry = new THREE.CylinderGeometry(dimensions.radiusTop, dimensions.radiusBottom, dimensions.height, dimensions.radialSegments);

    // Create a Three.js mesh with the cylinder geometry and a material
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // Set the position of the cylinder mesh
    this.cylinderMesh.position.copy(position);

    // Add the cylinder mesh to the Three.js scene
    this.scene.add(this.cylinderMesh);

    // Create a rigid body for the cylinder with Ammo.js
    const shape = new Ammo.btCylinderShape(new Ammo.btVector3(dimensions.radiusTop, dimensions.height / 2, dimensions.radiusBottom));
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const origin = new Ammo.btVector3(position.x, position.y, position.z);
    transform.setOrigin(origin);
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    this.body = body;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.body);
  }

  update() {
    // Update the position of the cylinder mesh to match the position of the rigid body
    const transform = new Ammo.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    const origin = transform.getOrigin();
    this.cylinderMesh.position.set(origin.x(), origin.y(), origin.z());

    // Update the rotation of the cylinder mesh to match the rotation of the rigid body
    const rotation = transform.getRotation();
    this.cylinderMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
  }

  setFriction(friction) {
    // Set the friction of the rigid body
    this.body.setFriction(friction);
  }

  setBounciness(bounciness) {
    // Set the restitution (bounciness) of the rigid body
    this.body.setRestitution(bounciness);
  }

  applyForce(force) {
    // Apply a force to the rigid body
    const origin = this.body.getWorldTransform().getOrigin();
    const forceVector = new Ammo.btVector3(force.x, force.y, force.z);
    this.body.applyCentralForce(forceVector);
  }

  setMass(mass) {
    // Set the mass of the rigid body
    const localInertia = new Ammo.btVector3(0, 0, 0);
    this.body.getCollisionShape().calculateLocalInertia(mass, localInertia);
    this.body.setMassProps(mass, localInertia);
  }

  setLinearVelocity(velocity) {
    // Set the linear velocity of the rigid body
    const velocityVector = new Ammo.btVector3(velocity.x, velocity.y, velocity.z);
    this.body.setLinearVelocity(velocityVector);
  }


  setColor(color) {
    // Set the color of the sphere mesh
    this.color = color;
    this.cylinderMesh.material.color.copy(this.color);
  }
}

export class Plain {
  constructor(scene, world, position, dimensions, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.dimensions = dimensions;
    this.mass = mass;

    // Create a Three.js plane geometry
    const planeGeometry = new THREE.PlaneGeometry(dimensions.x, dimensions.y);

    // Create a Three.js mesh with the plane geometry and a material
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // Set the position of the plane mesh
    this.planeMesh.position.copy(position);

    // Add the plane mesh to the Three.js scene
    this.scene.add(this.planeMesh);

    // Create a rigid body for the plane with Ammo.js
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(dimensions.x / 2, 0.1, dimensions.y / 2));
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    const origin = new Ammo.btVector3(position.x, position.y, position.z);
    transform.setOrigin(origin);
    mass = this.mass;
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);
    this.body = body;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.body);
  }

  update() {
    // Update the position of the plane mesh to match the position of the rigid body
    const transform = new Ammo.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    const origin = transform.getOrigin();
    this.planeMesh.position.set(origin.x(), origin.y(), origin.z());

    // Update the rotation of the plane mesh to match the rotation of the rigid body
    const rotation = transform.getRotation();
    this.planeMesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
  }

  setFriction(friction) {
    // Set the friction of the rigid body
    this.body.setFriction(friction);
  }

  setBounciness(bounciness) {
    // Set the restitution (bounciness) of the rigid body
    this.body.setRestitution(bounciness);
  }

  applyForce(force) {
    // Apply a force to the rigid body
    const origin = this.body.getWorldTransform().getOrigin();
    const forceVector = new Ammo.btVector3(force.x, force.y, force.z);
    this.body.applyCentralForce(forceVector);
  }

  setMass(mass) {
    // Set the mass of the rigid body
    const localInertia = new Ammo.btVector3(0, 0, 0);
    this.body.getCollisionShape().calculateLocalInertia(mass, localInertia);
    this.body.setMassProps(mass, localInertia);
  }

  setColor(color) {
    // Set the color of the plane mesh
    this.color = color;
    this.planeMesh.material.color.copy(this.color);
  }
}
