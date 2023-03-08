import * as THREE from 'three';
class Box {
  constructor(scene, world, position, dimensions, mass) {
    this.scene = scene;
    this.world = world;
    this.position = position;
    this.dimensions = dimensions;
    this.mass = mass;

    // Create a Three.js box geometry
    const boxGeometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);

    // Create a Three.js mesh with the box geometry and a material
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
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
    const rigidBody = new Ammo.btRigidBody(rbInfo);
    this.rigidBody = rigidBody;

    // Add the rigid body to the Ammo.js world
    this.world.addRigidBody(this.rigidBody);
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

export default Box;