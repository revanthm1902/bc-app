import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { loadCastlesGroup, animateCastles } from './CastlesGroup';

export default function ModelScene() {
  const { width, height } = useWindowDimensions();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl }) as any;
    renderer.setSize(width, height);
    // Make renderer transparent so underlying ImageBackground shows
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4, 20);
    camera.lookAt(0, 2, 0);

    // Basic lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    // For now, skip GLB loading and use procedural castles directly
    // (GLB models can be added later via static imports if needed)
    const castles = await loadCastlesGroup(scene);

    // Animation loop
    let frameId: number;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;

      // gentle camera motion
      camera.position.x = Math.sin(t * 0.12) * 3.5;
      camera.position.y = 6 + Math.sin(t * 0.18) * 1.5;
      camera.position.z = 20 + Math.cos(t * 0.12) * 1.5;
      camera.lookAt(0, 3, 0);

      // animate castles
      animateCastles(castles, t);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
    };
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <GLView style={[styles.gl, { width, height }]} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  gl: { flex: 1, backgroundColor: 'transparent' },
});
