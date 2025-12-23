import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing, typography } from '../theme';

export function StatsDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Stats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    backgroundColor: palette.surface,
    borderRadius: 8,
    marginBottom: spacing.medium,
  },
  title: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semibold,
    color: palette.text,
  },
});
