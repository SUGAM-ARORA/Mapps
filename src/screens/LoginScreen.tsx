import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TextField } from '../components/TextField';
import { AccentButton } from '../components/AccentButton';
import { palette, spacing, typography } from '../theme';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { login } from '../store/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    dispatch(login({ email, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AccentButton title="Sign In" onPress={onSubmit} loading={loading} />
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
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
