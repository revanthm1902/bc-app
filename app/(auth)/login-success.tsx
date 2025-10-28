import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BackgroundScene from '@/components/3d/BackgroundScene';
import AuthButton from '@/components/auth/AuthButton';

export default function LoginSuccess() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));
  const [checkmarkAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Scale animation for the card
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Checkmark animation
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(checkmarkAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <BackgroundScene />
      <LinearGradient
        colors={['rgba(10,14,39,0.5)', 'rgba(10,14,39,0.9)']}
        style={styles.overlay}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.glassCard}>
          {/* Animated Checkmark */}
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [
                  { scale: checkmarkAnim },
                  {
                    rotate: checkmarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-180deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.checkmarkCircle}
            >
              <Ionicons name="checkmark" size={60} color="#ffffff" />
            </LinearGradient>
          </Animated.View>

          {/* Success Message */}
          <Text style={styles.title}>Email Verified!</Text>
          <Text style={styles.subtitle}>🎉 Account Successfully Confirmed</Text>

          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              Your BeingCosmic account is now active and ready to use.
            </Text>
            <Text style={styles.submessage}>
              Start your cosmic learning journey today!
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresList}>
            <FeatureItem icon="rocket-outline" text="Explore 3D Learning" />
            <FeatureItem icon="book-outline" text="Interactive Lessons" />
            <FeatureItem icon="trophy-outline" text="Track Your Progress" />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <AuthButton
              title="Continue to App"
              onPress={() => router.replace('/(tabs)')}
            />
            <AuthButton
              title="Back to Login"
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// Feature Item Component
function FeatureItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon} size={20} color="#6366f1" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#10b981',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  messageContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  submessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  buttonsContainer: {
    width: '100%',
  },
});
