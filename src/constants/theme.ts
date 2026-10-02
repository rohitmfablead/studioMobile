/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    secondary: '#7C3AED',
    secondaryDark: '#6D28D9',
    accent: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    success: '#22C55E',
    warning: '#2563EB',
    error: '#EF4444',
    // Fallbacks for backward compatibility
    text: '#0F172A',
    backgroundElement: '#F8FAFC',
    backgroundSelected: '#E2E8F0',
  },
  dark: {
    primary: '#1D4ED8',
    primaryDark: '#2563EB',
    secondary: '#6D28D9',
    secondaryDark: '#7C3AED',
    accent: '#06B6D4',
    background: '#0F172A',
    surface: '#1E293B',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#22C55E',
    warning: '#2563EB',
    error: '#EF4444',
    // Fallbacks for backward compatibility
    text: '#FFFFFF',
    backgroundElement: '#1E293B',
    backgroundSelected: '#334155',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
