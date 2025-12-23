import api from './client';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    console.log('í´§ Sending registration request...', { email, name });
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      name 
    });
    
    console.log('âœ… Registration raw response:', response.data);
    console.log('âœ… Registration status:', response.status);
    
    // Check if it's the nested success structure
    const data = response.data.success ? response.data.data : response.data;
    
    if (data && data.token && data.user) {
      console.log('í¾¯ Extracted token and user successfully');
      return {
        token: data.token,
        user: {
          id: data.user.id,
          email: data.user.email,
        }
      };
    } else {
      console.error('âŒ Missing token or user in response:', data);
      throw new Error('Invalid response: missing token or user data');
    }
  } catch (error: any) {
    console.error('âŒ Registration error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle specific error messages
    if (error.response?.status === 409) {
      throw new Error('Email already registered. Please try a different email.');
    }
    if (error.response?.status === 400) {
      throw new Error('Validation failed. Please check your password requirements.');
    }
    
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('í´§ Sending login request...', { email });
    const response = await api.post('/auth/login', { 
      email, 
      password 
    });
    
    console.log('âœ… Login raw response:', response.data);
    console.log('âœ… Login status:', response.status);
    
    // Check if it's the nested success structure
    const data = response.data.success ? response.data.data : response.data;
    
    if (data && data.token && data.user) {
      console.log('í¾¯ Extracted token and user successfully');
      return {
        token: data.token,
        user: {
          id: data.user.id,
          email: data.user.email,
        }
      };
    } else {
      console.error('âŒ Missing token or user in response:', data);
      throw new Error('Invalid response: missing token or user data');
    }
  } catch (error: any) {
    console.error('âŒ Login error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}
