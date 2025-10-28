import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Animated, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  isPassword?: boolean;
}

export default function AuthInput({ icon, placeholder, isPassword, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusAnim] = useState(new Animated.Value(0));

  const handleFocus = () => {
    Animated.spring(focusAnim, { toValue: 1, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    Animated.spring(focusAnim, { toValue: 0, useNativeDriver: false }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.2)', 'rgba(99,102,241,0.8)'],
  });

  return (
    <Animated.View style={[styles.container, { borderColor, borderWidth: 2 }]}>
      <Ionicons name={icon} size={20} color="rgba(255,255,255,0.6)" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 16, fontWeight: '500' },
});
