import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { AccentButton } from '../components/AccentButton';
import { TextField } from '../components/TextField';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { logout } from '../store/authSlice';
import { loadTasks, addTask } from '../store/tasksSlice';
import { TaskCard } from '../components/TaskCard';
import { palette, spacing, typography } from '../theme';

export default function TaskListScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items: tasks, loading } = useAppSelector((s) => s.tasks);
  
  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Load tasks when component mounts
  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await dispatch(addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority: 'medium',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      })).unwrap();
      
      // Clear form and hide it
      setTitle('');
      setDescription('');
      setShowForm(false);
      
      Alert.alert('Success', 'Task created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => dispatch(logout()) }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>Welcome, {user?.email}!</Text>
      </View>

      {/* Add Task Form */}
      {showForm ? (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Create New Task</Text>
          <TextField 
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need to do?"
          />
          <TextField 
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details..."
            multiline
          />
          <View style={styles.formActions}>
            <AccentButton 
              title="Create Task" 
              onPress={handleAddTask}
              loading={loading}
              style={styles.createButton}
            />
            <AccentButton 
              title="Cancel" 
              onPress={() => setShowForm(false)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      ) : (
        <AccentButton 
          title="+ Add New Task" 
          onPress={() => setShowForm(true)}
          style={styles.addButton}
        />
      )}

      {/* Tasks List */}
      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>
          Your Tasks ({tasks.length})
        </Text>
        
        {loading && <Text style={styles.loadingText}>Loading tasks...</Text>}
        
        {tasks.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>Create your first task to get started</Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard 
              key={task._id}
              task={task}
              onPress={() => console.log('Task pressed:', task.title)}
              onToggle={() => console.log('Toggle task:', task._id)}
              onDelete={() => console.log('Delete task:', task._id)}
            />
          ))
        )}
      </View>

      {/* Logout */}
      <AccentButton 
        title="Logout" 
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    padding: spacing.large,
    backgroundColor: palette.primary,
  },
  title: {
    fontSize: typography.sizes.xlarge,
    fontWeight: typography.weights.bold,
    color: palette.surface,
    marginBottom: spacing.tiny,
  },
  subtitle: {
    fontSize: typography.sizes.medium,
    color: palette.surface,
    opacity: 0.9,
  },
  form: {
    backgroundColor: palette.surface,
    margin: spacing.medium,
    padding: spacing.large,
    borderRadius: 12,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.bold,
    color: palette.text,
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.medium,
  },
  createButton: {
    flex: 1,
    backgroundColor: palette.success,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: palette.muted,
  },
  addButton: {
    margin: spacing.medium,
    backgroundColor: palette.success,
  },
  tasksContainer: {
    padding: spacing.medium,
  },
  sectionTitle: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.bold,
    color: palette.text,
    marginBottom: spacing.medium,
  },
  loadingText: {
    textAlign: 'center',
    color: palette.textSecondary,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.large,
  },
  emptyText: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.semibold,
    color: palette.textSecondary,
    marginBottom: spacing.small,
  },
  emptySubtext: {
    fontSize: typography.sizes.medium,
    color: palette.muted,
    textAlign: 'center',
  },
  logoutButton: {
    margin: spacing.medium,
    backgroundColor: palette.error,
  },
});
