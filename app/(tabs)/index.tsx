import { StyleSheet, View, Text } from 'react-native';
import CloudyBackground from '@/components/3d/CloudyBackground';
import React from 'react';

export default function HomeScreen() {
  const [error] = React.useState(false);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load 3D scene</Text>
          <Text style={styles.errorSubtext}>Using fallback view</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CloudyBackground />
      <View style={styles.overlay}>
        <Text style={styles.title}>🏰 Being Cosmic</Text>
        <Text style={styles.subtitle}>Explore the magical world of learning</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
  },
  errorText: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#888',
  },
});

