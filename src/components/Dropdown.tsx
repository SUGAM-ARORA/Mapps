import React from 'react';
import { View, Text } from 'react-native';
import { palette } from '../theme';

export function Dropdown(props: any) {
  return (
    <View style={{ padding: 16, backgroundColor: palette.surface }}>
      <Text style={{ color: palette.text }}>Dropdown - Coming Soon</Text>
    </View>
  );
}

export const SkeletonLoader = () => (
  <View style={{ padding: 16 }}>
    <Text>Loading...</Text>
  </View>
);

export const EmptyState = () => (
  <View style={{ padding: 16, alignItems: 'center' }}>
    <Text>No items found</Text>
  </View>
);
