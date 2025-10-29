import * as THREE from 'three';

export function createCloudLayer(): THREE.Group {
  const cloudGroup = new THREE.Group();

  for (let i = 0; i < 15; i++) {
    const cloudGeometry = new THREE.SphereGeometry(
      Math.random() * 2 + 1.5,
      16,
      16
    );
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      flatShading: true,
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    
    cloud.position.set(
      (Math.random() - 0.5) * 100,
      Math.random() * 15 + 5,
      (Math.random() - 0.5) * 60 - 20
    );
    
    cloud.scale.set(
      Math.random() * 0.5 + 0.8,
      Math.random() * 0.3 + 0.4,
      Math.random() * 0.5 + 0.8
    );
    
    cloudGroup.add(cloud);
  }

  return cloudGroup;
}

export function animateClouds(cloudGroup: THREE.Group, time: number): void {
  cloudGroup.children.forEach((cloud, index) => {
    cloud.position.x += Math.sin(time * 0.3 + index) * 0.02;
    cloud.position.y += Math.cos(time * 0.2 + index) * 0.01;
  });
}
