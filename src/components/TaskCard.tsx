import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { palette, spacing, typography } from '../theme';

interface Props {
  task: Task;
  onPress?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onPress, onToggle, onDelete }: Props) {
  const isCompleted = task.status === 'completed';
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[styles.description, isCompleted && styles.completedText]}>
            {task.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.priority}>{task.priority}</Text>
          <Text style={styles.status}>{task.status}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {onToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.actionButton}>
            <Text style={styles.actionText}>
              {isCompleted ? '↻' : '✓'}
            </Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.actionText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.surface,
    borderRadius: 8,
    padding: spacing.medium,
    marginVertical: spacing.small,
    borderWidth: 1,
    borderColor: palette.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semibold,
    color: palette.text,
  },
  description: {
    fontSize: typography.sizes.small,
    color: palette.textSecondary,
    marginTop: spacing.tiny,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.small,
  },
  priority: {
    fontSize: typography.sizes.small,
    color: palette.accent,
    textTransform: 'uppercase',
  },
  status: {
    fontSize: typography.sizes.small,
    color: palette.textSecondary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: palette.muted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.small,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.small,
  },
  actionText: {
    color: palette.surface,
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.bold,
  },
});
