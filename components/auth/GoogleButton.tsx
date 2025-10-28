import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export default function GoogleButton({ onPress, loading }: Props) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={loading}
      style={styles.button}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Ionicons name="logo-google" size={20} color="#4285F4" />
        <Text style={styles.text}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
});
