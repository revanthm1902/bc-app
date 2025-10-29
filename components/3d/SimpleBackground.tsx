import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, useWindowDimensions, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import ModelScene from './ModelScene';

export default function SimpleBackground() {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (e) {
        // avoid uncaught errors from orientation
        console.warn('Orientation lock failed in SimpleBackground:', e);
      }
    })();

    return () => {
      (async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (e) {
          console.warn('Orientation unlock failed in SimpleBackground:', e);
        }
      })();
    };
  }, []);

  // Background image - bg.jpg for landscape mode
  const bg = require('../../assets/images/bg.jpg');

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={bg} 
        style={[styles.bg, { width, height }]} 
        resizeMode="cover"
        imageStyle={styles.bgImage}>
        {/* Render the ModelScene (transparent GLView) on top of the static background image */}
        <ModelScene />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bg: { 
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
});
