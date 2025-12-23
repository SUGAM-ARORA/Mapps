import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTasks as fetchTasksApi, createTask as createTaskApi, deleteTask as deleteTaskApi, toggleTask as toggleTaskApi } from '../api/tasks';
import { Task, Priority, TasksState } from '../types';

const initialState: TasksState = {
  items: [],
  loading: false
};

export const loadTasks = createAsyncThunk(
  'tasks/loadTasks',
  async (params?: { status?: string; category?: string; tag?: string }, { rejectWithValue }) => {
    try {
      return await fetchTasksApi(params);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (payload: {
    title: string;
    description?: string;
    priority?: Priority;
    deadline?: string;
    tags?: string[];
    category?: string;
    estimatedDuration?: number;
  }, { rejectWithValue }) => {
    try {
      return await createTaskApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      return await toggleTaskApi(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTaskApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load tasks
      .addCase(loadTasks.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle task
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Remove task
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task._id !== action.payload);
      });
  }
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
