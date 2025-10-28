import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import BackgroundScene from '@/components/3d/BackgroundScene';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { control, handleSubmit, watch } = useForm({ 
    defaultValues: { 
      fullName: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      class: '',
      contactNumber: '',
      organization: ''
    } 
  });
  const password = watch('password');

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            class: data.class,
            contact_number: data.contactNumber,
            organization: data.organization,
          },
          emailRedirectTo: 'beingcosmic://login-success',
        }
      });

      if (error) {
        Alert.alert('Signup Failed', error.message);
        setLoading(false);
        return;
      }

      console.log('✅ Signup successful!', authData);
      Alert.alert(
        'Success!',
        'Account created successfully. Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
      setLoading(false);
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
              <Text style={styles.subtitle}>🚀 Start Your Learning Journey</Text>
            </View>

            <View style={styles.glassCard}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.descriptionText}>Join thousands of learners exploring the cosmos</Text>

              <Controller
                control={control}
                rules={{ required: true, minLength: 2 }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput icon="person-outline" placeholder="Full Name" value={value} onChangeText={onChange} />
                )}
                name="fullName"
              />

              <Controller
                control={control}
                rules={{ required: true, minLength: 1 }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput icon="school-outline" placeholder="Class (e.g., 10th Grade)" value={value} onChangeText={onChange} />
                )}
                name="class"
              />

              <Controller
                control={control}
                rules={{ 
                  required: true, 
                  pattern: /^[0-9]{10}$/
                }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput 
                    icon="call-outline" 
                    placeholder="Contact Number" 
                    value={value} 
                    onChangeText={onChange} 
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                )}
                name="contactNumber"
              />

              <Controller
                control={control}
                rules={{ required: true, minLength: 2 }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput icon="business-outline" placeholder="Organization/School" value={value} onChangeText={onChange} />
                )}
                name="organization"
              />

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

              <Controller
                control={control}
                rules={{ required: true, validate: (value) => value === password || 'Passwords do not match' }}
                render={({ field: { onChange, value } }) => (
                  <AuthInput icon="lock-closed-outline" placeholder="Confirm Password" value={value} onChangeText={onChange} isPassword />
                )}
                name="confirmPassword"
              />

              <Text style={styles.termsText}>
                By signing up, you agree to our <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>

              <AuthButton title="Create Account" onPress={handleSubmit(onSubmit)} loading={loading} />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
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
  termsText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 16 },
  termsLink: { color: '#6366f1', textDecorationLine: 'underline' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerText: { color: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, fontSize: 14 },
  loginLink: { alignItems: 'center', marginTop: 8 },
  loginText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  loginTextBold: { color: '#8b5cf6', fontWeight: '600' },
});
