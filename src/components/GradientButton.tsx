import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

interface GradientButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export default function GradientButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  containerStyle,
  textStyle,
  ...rest
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, containerStyle]}
      {...rest}
    >
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, (disabled || loading) && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : typeof children === 'string' ? (
          <Text style={[styles.text, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
