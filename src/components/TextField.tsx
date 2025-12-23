import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { palette, spacing, typography } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextField({ label, error, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={palette.muted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.medium,
  },
  label: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semibold,
    color: palette.text,
    marginBottom: spacing.small,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    padding: spacing.medium,
    fontSize: typography.sizes.medium,
    backgroundColor: palette.surface,
    color: palette.text,
  },
  inputError: {
    borderColor: palette.error,
  },
  error: {
    fontSize: typography.sizes.small,
    color: palette.error,
    marginTop: spacing.tiny,
  },
});
