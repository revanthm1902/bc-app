import * as THREE from 'three';

// Create simple geometric castles instead of loading GLB files
export async function loadCastlesGroup(scene: THREE.Scene): Promise<THREE.Group[]> {
  const castles: THREE.Group[] = [];

  try {
    const castleConfigs = [
      // Center castle (largest)
      { x: 0, z: -5, scale: 2.5, rotationY: 0, color: 0x8b5cf6 },
      
      // Left castles
      { x: -18, z: -8, scale: 1.8, rotationY: Math.PI / 6, color: 0x6366f1 },
      { x: -25, z: -12, scale: 1.5, rotationY: Math.PI / 4, color: 0x14b8a6 },
      
      // Right castles
      { x: 18, z: -8, scale: 1.8, rotationY: -Math.PI / 6, color: 0xf59e0b },
      { x: 25, z: -10, scale: 1.6, rotationY: -Math.PI / 5, color: 0xec4899 },
      { x: 30, z: -14, scale: 1.4, rotationY: -Math.PI / 4, color: 0x10b981 },
    ];

    castleConfigs.forEach((config) => {
      const castle = new THREE.Group();
      
      // Main tower (tall rectangle)
      const towerGeometry = new THREE.BoxGeometry(config.scale * 0.6, config.scale * 2, config.scale * 0.6);
      const towerMaterial = new THREE.MeshPhongMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.2,
        shininess: 80,
        flatShading: true,
      });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      tower.position.y = config.scale;
      tower.castShadow = true;
      tower.receiveShadow = true;
      castle.add(tower);

      // Roof (pyramid)
      const roofGeometry = new THREE.ConeGeometry(config.scale * 0.5, config.scale * 0.8, 4);
      const roofMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a5568,
        shininess: 60,
        flatShading: true,
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = config.scale * 2 + config.scale * 0.4;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      castle.add(roof);

      // Side towers (smaller)
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const x = Math.cos(angle) * config.scale * 0.8;
        const z = Math.sin(angle) * config.scale * 0.8;
        
        const sideTowerGeometry = new THREE.CylinderGeometry(config.scale * 0.2, config.scale * 0.2, config.scale * 1.2, 8);
        const sideTower = new THREE.Mesh(sideTowerGeometry, towerMaterial);
        sideTower.position.set(x, config.scale * 0.6, z);
        sideTower.castShadow = true;
        sideTower.receiveShadow = true;
        castle.add(sideTower);

        // Small roofs on side towers
        const smallRoofGeometry = new THREE.ConeGeometry(config.scale * 0.25, config.scale * 0.4, 8);
        const smallRoof = new THREE.Mesh(smallRoofGeometry, roofMaterial);
        smallRoof.position.set(x, config.scale * 1.2 + config.scale * 0.2, z);
        smallRoof.castShadow = true;
        castle.add(smallRoof);
      }

      // Windows (glowing yellow cubes)
      for (let y = 0; y < 3; y++) {
        const windowGeometry = new THREE.BoxGeometry(config.scale * 0.15, config.scale * 0.2, config.scale * 0.05);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffeb3b,
        });
        
        for (let side = 0; side < 4; side++) {
          const angle = (Math.PI / 2) * side;
          const window = new THREE.Mesh(windowGeometry, windowMaterial);
          window.position.set(
            Math.cos(angle) * config.scale * 0.35,
            config.scale * 0.5 + y * config.scale * 0.6,
            Math.sin(angle) * config.scale * 0.35
          );
          window.rotation.y = angle;
          castle.add(window);
        }
      }

      castle.position.set(config.x, 0, config.z);
      castle.rotation.y = config.rotationY;
      
      castles.push(castle);
      scene.add(castle);
    });

    console.log(`✅ Successfully created ${castles.length} geometric castles`);
  } catch (error: any) {
    console.error('❌ Error creating castles:', error.message || error);
  }

  return castles;
}

export function animateCastles(castles: THREE.Group[], time: number): void {
  castles.forEach((castle, index) => {
    // Auto-rotate each castle
    castle.rotation.y += 0.003 + (index * 0.001);
    
    // Gentle bobbing motion
    castle.position.y = Math.sin(time * 0.5 + index * 0.8) * 0.3;
    
    // Slight sway
    castle.rotation.z = Math.sin(time * 0.3 + index) * 0.02;
  });
}
