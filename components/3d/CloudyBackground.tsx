import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, ActivityIndicator, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import * as ScreenOrientation from 'expo-screen-orientation';
import { loadCastlesGroup, animateCastles } from './CastlesGroup';

export default function CloudyBackground() {
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [error] = useState(false);

  useEffect(() => {
    // Lock to landscape mode when component mounts
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Unlock orientation when component unmounts
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl }) as any;
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 🕒 Dynamic sky color based on time
    const hour = new Date().getHours();
    let skyColor = 0x87ceeb; // day
    if (hour >= 18 || hour < 6) skyColor = 0x0a0e27; // night
    else if (hour >= 16 && hour < 18) skyColor = 0xffcc70; // sunset
    renderer.setClearColor(skyColor, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 3, 0);

    // 🌫️ Enhanced fog for atmospheric depth
    scene.fog = new THREE.FogExp2(skyColor, 0.012);

    // 🌤 Enhanced lighting system
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    // Main sun light with enhanced shadows
    const sunLight = new THREE.DirectionalLight(0xffd700, 1.3);
    sunLight.position.set(30, 50, 30);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Colorful accent lights for magical atmosphere
    const purpleLight = new THREE.PointLight(0x9333ea, 1.6, 45);
    purpleLight.position.set(-18, 12, -8);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 1.6, 45);
    blueLight.position.set(18, 12, -8);
    scene.add(blueLight);

    const orangeLight = new THREE.PointLight(0xf59e0b, 1.3, 40);
    orangeLight.position.set(0, 18, 8);
    scene.add(orangeLight);

    // Rim light for depth
    const rimLight = new THREE.PointLight(0xffffff, 0.8, 35);
    rimLight.position.set(0, 5, 25);
    scene.add(rimLight);

    // ===== ENHANCED VOLUMETRIC CLOUDS =====
    const cloudLayers: THREE.Group[] = [];
    const cloudColors = [0xffffff, 0xe0e7ff, 0xfef3c7, 0xf0f9ff];
    
    // Create multiple layers of clouds
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 12; i++) {
        const cloudGroup = new THREE.Group();
        
        // Each cloud is made of multiple puffs
        const numPuffs = 6 + Math.floor(Math.random() * 6);
        for (let j = 0; j < numPuffs; j++) {
          const puffSize = 1.8 + Math.random() * 3;
          const puffGeometry = new THREE.SphereGeometry(puffSize, 16, 16);
          const puffMaterial = new THREE.MeshPhongMaterial({
            color: cloudColors[Math.floor(Math.random() * cloudColors.length)],
            transparent: true,
            opacity: 0.5 + Math.random() * 0.4,
            shininess: 15,
            flatShading: true,
          });
          const puff = new THREE.Mesh(puffGeometry, puffMaterial);
          puff.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 5
          );
          cloudGroup.add(puff);
        }
        
        cloudGroup.position.set(
          (Math.random() - 0.5) * 120,
          14 + layer * 8 + Math.random() * 12,
          -25 - Math.random() * 40
        );
        
        cloudLayers.push(cloudGroup);
        scene.add(cloudGroup);
      }
    }

    // ===== MAGICAL PARTICLE SYSTEM =====
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: number[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 120;
      particlePositions[i * 3 + 1] = Math.random() * 35;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      particleVelocities.push(
        (Math.random() - 0.5) * 0.025,
        Math.random() * 0.025 + 0.015,
        (Math.random() - 0.5) * 0.025
      );
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ===== SPARKLES (smaller brighter particles) =====
    const sparkleCount = 150;
    const sparkleGeometry = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    
    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 100;
      sparklePositions[i * 3 + 1] = 5 + Math.random() * 25;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    
    const sparkleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.2,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    
    const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkles);

    // ===== ATMOSPHERIC STARS =====
    const starCount = 400;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 250;
      starPositions[i * 3 + 1] = 35 + Math.random() * 60;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 250;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 🏰 Load Castle Models (with error handling)
    let castles: THREE.Group[] = [];
    try {
      castles = await loadCastlesGroup(scene);
      console.log('✅ Castles loaded successfully:', castles.length);
    } catch (error) {
      console.warn('⚠️ Could not load castles, continuing without them:', error);
    }

    // 🌍 Enhanced ground with terrain variation
    const groundGeometry = new THREE.PlaneGeometry(220, 220, 60, 60);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x2d5016,
      flatShading: true,
      shininess: 8,
    });
    
    // Add realistic terrain variation
    const groundVertices = groundGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < groundVertices.length; i += 3) {
      groundVertices[i + 2] = Math.random() * 0.6 - 0.1;
    }
    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation variables
    let time = 0;

    // 🎬 Enhanced animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Cinematic camera movement
      camera.position.x = Math.sin(time * 0.12) * 3.5;
      camera.position.y = 8 + Math.sin(time * 0.18) * 2.5;
      camera.position.z = 22 + Math.cos(time * 0.12) * 2.5;
      camera.lookAt(0, 5, 0);

      // Animate cloud layers with varied speeds
      cloudLayers.forEach((cloud, index) => {
        const layerSpeed = 1 + (index % 3) * 0.3;
        cloud.position.x += Math.sin(time * 0.15 + index) * 0.018 * layerSpeed;
        cloud.position.y += Math.sin(time * 0.25 + index) * 0.01;
        cloud.rotation.y += 0.0008;
        
        // Wrap clouds around
        if (cloud.position.x > 60) cloud.position.x = -60;
        if (cloud.position.x < -60) cloud.position.x = 60;
      });

      // Animate floating particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i * 3];
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3 + 2] += particleVelocities[i * 3 + 2];
        
        // Reset particles that drift too far
        if (positions[i * 3 + 1] > 45) {
          positions[i * 3 + 1] = 0;
        }
        if (Math.abs(positions[i * 3]) > 60) {
          positions[i * 3] *= -1;
        }
        if (Math.abs(positions[i * 3 + 2]) > 30) {
          positions[i * 3 + 2] *= -1;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Twinkle sparkles
      const sparklePos = sparkleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkleCount; i++) {
        sparklePos[i * 3 + 1] += Math.sin(time * 3 + i) * 0.015;
      }
      sparkleGeometry.attributes.position.needsUpdate = true;
      sparkleMaterial.opacity = 0.7 + Math.sin(time * 2) * 0.3;

      // Rotate stars slowly
      stars.rotation.y += 0.0003;

      // Pulse lights for dynamic atmosphere
      purpleLight.intensity = 1.6 + Math.sin(time * 2.2) * 0.4;
      blueLight.intensity = 1.6 + Math.cos(time * 2.7) * 0.4;
      orangeLight.intensity = 1.3 + Math.sin(time * 2) * 0.3;

      // Animate castles if they loaded
      if (castles.length > 0) {
        animateCastles(castles, time);
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
    
    // Mark as loaded
    setLoading(false);
    console.log('✅ CloudyBackground fully initialized with enhanced effects');
  };

  return (
    <View style={styles.container}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading 3D Scene...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>⚠️ Unable to load 3D scene</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gl: { flex: 1 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 39, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
