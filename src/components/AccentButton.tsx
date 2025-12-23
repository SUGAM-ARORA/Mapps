import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { palette, spacing, typography } from '../theme';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export function AccentButton({ title, loading, style, ...props }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={loading}
      {...props}
    >
      <Text style={styles.text}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.accent,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: palette.surface,
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semibold,
  },
});
