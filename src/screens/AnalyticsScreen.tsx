import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing, typography } from '../theme';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AnalyticsScreen</Text>
      <Text>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  title: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.bold,
    color: palette.text,
    marginBottom: spacing.medium,
  },
});
