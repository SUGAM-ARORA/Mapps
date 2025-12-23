import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, register as registerApi } from '../api/auth';
import { User, AuthState } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginApi(payload.email, payload.password);
      await AsyncStorage.setItem('token', res.token);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const res = await registerApi(payload.email, payload.password, payload.name);
      await AsyncStorage.setItem('token', res.token);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadToken = createAsyncThunk('auth/loadToken', async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load token
      .addCase(loadToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload;
          state.isAuthenticated = true;
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = undefined;
        state.token = undefined;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
