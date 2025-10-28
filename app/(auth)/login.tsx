import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import BackgroundScene from '@/components/3d/BackgroundScene';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import GoogleButton from '@/components/auth/GoogleButton';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { control, handleSubmit } = useForm({ defaultValues: { email: '', password: '' } });

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert('Login Failed', error.message);
        setLoading(false);
        return;
      }

      console.log('✅ Login successful!');
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const redirectUrl = makeRedirectUri({
        scheme: 'beingcosmic',
        path: 'login-success',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        Alert.alert('Google Sign In Failed', error.message);
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success') {
          console.log('✅ Google sign in successful!');
          router.replace('/(tabs)');
        }
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred with Google sign in');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <BackgroundScene />
      <LinearGradient colors={['rgba(10,14,39,0.4)', 'rgba(10,14,39,0.8)']} style={styles.overlay} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
            
            <View style={styles.headerContainer}>
              <Text style={styles.title}>BeingCosmic</Text>
              <Text style={styles.subtitle}>✨ Journey Through Knowledge</Text>
            </View>

            <View style={styles.glassCard}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.descriptionText}>Sign in to continue your learning adventure</Text>

              <Controller
                control={control}
                rules={{ required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput icon="mail-outline" placeholder="Email" value={value} onChangeText={onChange} keyboardType="email-address" />
                )}
                name="email"
              />

              <Controller
                control={control}
                rules={{ required: true, minLength: 6 }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput icon="lock-closed-outline" placeholder="Password" value={value} onChangeText={onChange} isPassword />
                )}
                name="password"
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <AuthButton title="Sign In" onPress={handleSubmit(onSubmit)} loading={loading} />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <GoogleButton onPress={handleGoogleSignIn} loading={googleLoading} />

              <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupLink}>
                <Text style={styles.signupText}>
                  Don&apos;t have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  keyboardView: { flex: 1, zIndex: 2 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  formContainer: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 8, textShadowColor: 'rgba(99,102,241,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)' },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  descriptionText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#6366f1', fontSize: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerText: { color: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, fontSize: 14 },
  signupLink: { alignItems: 'center', marginTop: 8 },
  signupText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  signupTextBold: { color: '#8b5cf6', fontWeight: '600' },
});
