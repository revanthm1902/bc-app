import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function BackgroundScene() {
  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl }) as any;
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x0a0e27, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.z = 15;

    scene.add(new THREE.AmbientLight(0x404040, 1.5));
    const light1 = new THREE.PointLight(0x6366f1, 2, 50);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const planetsGroup = new THREE.Group();
    
    // Planet 1 - Large Purple
    const planet1 = new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, emissive: 0x4c1d95, shininess: 120, transparent: true, opacity: 0.9 })
    );
    planet1.position.set(-6, 2, -3);
    planetsGroup.add(planet1);

    // Planet 2 - Large Blue
    const planet2 = new THREE.Mesh(
      new THREE.SphereGeometry(3.8, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x6366f1, emissive: 0x312e81, shininess: 120, transparent: true, opacity: 0.85 })
    );
    planet2.position.set(8, -3, -6);
    planetsGroup.add(planet2);

    // Planet 3 - Medium Teal
    const planet3 = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 48, 48),
      new THREE.MeshPhongMaterial({ color: 0x14b8a6, emissive: 0x0f766e, shininess: 100, transparent: true, opacity: 0.8 })
    );
    planet3.position.set(-3, -5, -8);
    planetsGroup.add(planet3);

    // Stars
    for (let i = 0; i < 50; i++) {
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0xffffff })
      );
      star.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
      scene.add(star);
    }

    scene.add(planetsGroup);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      // Faster rotation
      planet1.rotation.y += 0.008;
      planet1.rotation.x += 0.004;
      planet2.rotation.y -= 0.01;
      planet2.rotation.x += 0.005;
      planet3.rotation.y += 0.012;
      planet3.rotation.x -= 0.003;

      // More dynamic floating movement
      planet1.position.y = 2 + Math.sin(time * 0.8) * 1.2;
      planet1.position.x = -6 + Math.cos(time * 0.6) * 0.8;
      
      planet2.position.y = -3 + Math.cos(time * 1.0) * 1.5;
      planet2.position.x = 8 + Math.sin(time * 0.5) * 1.0;
      
      planet3.position.y = -5 + Math.sin(time * 1.2) * 1.0;
      planet3.position.x = -3 + Math.cos(time * 0.9) * 0.6;

      // Dynamic camera movement
      camera.position.x = Math.sin(time * 0.3) * 1.5;
      camera.position.y = Math.cos(time * 0.25) * 0.8;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return (
    <View style={styles.container}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gl: { flex: 1 },
});
