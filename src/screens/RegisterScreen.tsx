import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TextField } from '../components/TextField';
import { AccentButton } from '../components/AccentButton';
import { palette, spacing, typography } from '../theme';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { register } from '../store/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from './LoginScreen';

export default function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    dispatch(register({ name, email, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextField label="Name" value={name} onChangeText={setName} placeholder="Your name" />
      <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AccentButton title="Sign Up" onPress={onSubmit} loading={loading} />
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.large,
    justifyContent: 'center',
    backgroundColor: palette.background,
  },
  title: {
    fontSize: typography.sizes.xlarge,
    fontWeight: typography.weights.bold,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  error: {
    color: palette.error,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  link: {
    color: palette.accent,
    textAlign: 'center',
    marginTop: spacing.medium,
  },
});
