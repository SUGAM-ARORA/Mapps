# Architecture & Design Patterns

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Mobile App                   │
│  (TypeScript, Redux Toolkit, React Navigation, Linear Grad) │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                          HTTP/REST with JWT Auth
                                      │
┌─────────────────────────────────────▼───────────────────────┐
│                      Express.js API Server                   │
│       (TypeScript, Zod Validation, Error Handling)           │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                                 Mongoose ODM
                                      │
┌─────────────────────────────────────▼───────────────────────┐
│                      MongoDB Database                        │
│             (Collections: users, tasks)                      │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Layered Design

```
Routes Layer (API Endpoints)
  ↓
Middleware Layer (Auth, Validation, Error Handling)
  ↓
Business Logic (Task scoring, filtering)
  ↓
Data Layer (Mongoose Models, DB Queries)
  ↓
Database (MongoDB)
```

### Key Components

#### 1. **Models** (`src/models/`)
- **User**: Email, password hash, timestamps
- **Task**: Title, description, dates, priority, tags, category, status

**Design Pattern**: Mongoose schema with TypeScript interfaces for type safety.

#### 2. **Routes** (`src/routes/`)

**Auth Router** (`auth.ts`)
```
POST /register
POST /login
```

Features:
- Input validation with Zod
- Password hashing (Bcrypt 12 rounds)
- JWT token generation (7 days expiry)
- Error handling with ApiError class

**Tasks Router** (`tasks.ts`)
```
POST   /                  - Create task
GET    /                  - List tasks (with filtering)
PATCH  /:id/toggle       - Toggle completion
PATCH  /:id              - Update task
DELETE /:id              - Delete task
```

Features:
- Authentication middleware on all routes
- Composite urgency scoring for sort order
- Query parameter filtering (status, category, tag)
- Proper HTTP status codes (201, 204, 400, 401, 404)

#### 3. **Middleware** (`src/middleware/`)

**Auth Middleware** (`auth.ts`)
```typescript
requireAuth(req, res, next)
  ├── Extract JWT from Authorization header
  ├── Verify signature and expiry
  ├── Attach userId and userEmail to request
  └── Catch invalid/expired tokens
```

#### 4. **Utilities** (`src/utils/`)

**Validation** (`validation.ts`)
- Zod schemas for register, login, task creation
- Automatic error message extraction
- Password strength requirements (uppercase, lowercase, number, min 8 chars)

**Error Handling** (`errors.ts`)
- ApiError class: `new ApiError(statusCode, message, errors?)`
- Global error handler middleware
- Async wrapper: `catchAsync(fn)` catches promise rejections
- Consistent JSON response format: `{ success, message, data?, errors? }`

**Database** (`db.ts`)
- MongoDB connection with retry logic
- Connection state tracking
- Error logging

### Request Flow Example

```
POST /api/tasks
  │
  ├─→ requireAuth Middleware
  │     ├─ Extract & verify JWT
  │     └─ Attach userId
  │
  ├─→ validateTask (Zod)
  │     ├─ Check title required
  │     ├─ Validate priority enum
  │     ├─ Validate date formats
  │     └─ Return { success, data } or { success, error }
  │
  ├─→ Create Task (MongoDB)
  │     ├─ Save to database
  │     └─ Return populated object
  │
  └─→ Response: 201 { success: true, data: { _id, title, ... } }

If Error → catchAsync catches → errorHandler → 400/401/500 response
```

## Mobile Architecture

### State Management (Redux Toolkit)

```
┌─────────────────────────────────────┐
│          Redux Store                │
├─────────────────────────────────────┤
│                                     │
│  ├─ authSlice                       │
│  │  ├─ user: User | undefined       │
│  │  ├─ token: string | undefined    │
│  │  ├─ loading: boolean             │
│  │  ├─ error: string | undefined    │
│  │  └─ async thunks:                │
│  │    ├─ login()                    │
│  │    ├─ register()                 │
│  │    ├─ loadToken()                │
│  │    └─ logout()                   │
│  │                                  │
│  └─ tasksSlice                      │
│     ├─ items: Task[]                │
│     ├─ loading: boolean             │
│     ├─ error: string | undefined    │
│     └─ async thunks:                │
│       ├─ loadTasks()                │
│       ├─ addTask()                  │
│       ├─ toggleTaskStatus()         │
│       └─ removeTask()               │
└─────────────────────────────────────┘
```

### Hooks Strategy

**Custom Hook**: `useAppDispatch()` & `useAppSelector()`
```typescript
// Typed versions of Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage in component
const dispatch = useAppDispatch();
const { items, loading } = useAppSelector((s) => s.tasks);
```

### Navigation Stack

```
RootNavigator
  ├─ AuthStack (no token)
  │  ├─ LoginScreen
  │  └─ RegisterScreen
  │
  └─ AppNavigator (with token)
     └─ BottomTabNavigator
        ├─ TasksTab → TaskListScreen
        ├─ AnalyticsTab → AnalyticsScreen
        └─ SettingsTab → SettingsScreen
```

### Component Composition

**Dumb Components** (UI-only, no logic)
```
- TextField: Text input + label
- AccentButton: Gradient button
- Dropdown: Select menu
- SegmentedControl: Tab switcher
- TagSelector: Tag manager
- TaskCard: Task display
- SearchBar: Search with suggestions
- StatsDashboard: Metric cards
```

**Smart Components** (with logic)
```
- TaskListScreen: Task CRUD + filtering
- AnalyticsScreen: Stats calculation
- SettingsScreen: User preferences
- LoginScreen: Auth flow
- RegisterScreen: Registration flow
```

### Data Flow

```
User Action (e.g., "Add Task")
  │
  ├─→ Component Handler (onAddTask)
  │
  ├─→ Dispatch Redux Action (addTask())
  │     ├─ Async Thunk called
  │     ├─ API request (axios with auth header)
  │     └─ Response → reduce into state
  │
  ├─→ Component re-renders
  │     └─ Display updated task list
  │
  └─→ UI Update
```

### API Client Strategy

**Axios Instance** (`src/api/client.ts`)
```typescript
const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// Request interceptor: Auto-inject JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Thunk Usage** (`src/api/tasks.ts`)
```typescript
export async function fetchTasks() {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}

// In Redux thunk
export const loadTasks = createAsyncThunk('tasks/load', async () => {
  return await fetchTasks();
});
```

## Design Patterns Applied

### 1. **Composite Urgency Scoring**
**Where**: Backend (`tasks.ts` route), Mobile (`taskHelpers.ts` utility)

```typescript
score = deadline_proximity + priority_weight + scheduled_time_proximity

Benefits:
- Consistent ranking across clients
- Overdue tasks always surface
- Dead lineweight overrides priority
- Scheduled time creates focus windows
```

### 2. **Error Handling (Custom Error Class)**
**Where**: Backend (`errors.ts`)

```typescript
throw new ApiError(400, 'Validation failed', {
  email: ['Invalid email format'],
  password: ['Too short']
});

// Global handler catches and formats response
```

### 3. **Middleware Chain**
**Where**: Backend (`setup.ts`)

```
Helmet → CORS → JSON parser → Morgan → Routes → 404 → Error handler
```

### 4. **Dependency Injection via Async Thunks**
**Where**: Mobile Redux

```typescript
// Thunk receives dispatch/getState
export const addTask = createAsyncThunk(
  'tasks/add',
  async (payload, { dispatch, getState }) => {
    // Can access state if needed
    return await api.post('/tasks', payload);
  }
);
```

### 5. **Path Aliases for Clean Imports**
**Where**: Mobile `babel.config.js` + `tsconfig.json`

```typescript
// Instead of: ../../../api/tasks
// Use: @api/tasks
import { fetchTasks } from '@api/tasks';
```

### 6. **Lean Data Models**
**Where**: Everywhere

- Backend: Mongoose schemas with tight validation
- Mobile: TypeScript interfaces matching API contracts
- Redux: Minimal state (only what's needed globally)

## Performance Optimizations

### Backend
1. **Database Indexes**: Tasks indexed on (user, status, priority)
2. **Lean Queries**: Use `.lean()` for read-only operations
3. **Async Handlers**: All I/O wrapped in `catchAsync()`
4. **Input Size Limits**: JSON limit 10kb

### Mobile
1. **FlatList Optimization**: keyExtractor, removeClippedSubviews
2. **Memoization**: useMemo for filtered/sorted task lists
3. **Redux Selectors**: Reselect patterns to prevent unnecessary renders
4. **Lazy Navigation**: Screens loaded on-demand

## Testing Strategy

### Backend (jest + supertest)
```typescript
describe('POST /api/tasks', () => {
  it('creates task with valid input', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', priority: 'high' });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### Mobile (React Testing Library)
```typescript
describe('TaskListScreen', () => {
  it('renders task list', () => {
    const { getByText } = render(<TaskListScreen />);
    expect(getByText('Tasks')).toBeInTheDocument();
  });
});
```

## Security Considerations

1. **JWT**: Short-lived (7 days), verified on every protected request
2. **Password**: Bcrypt 12 rounds, never stored plaintext
3. **Validation**: Zod schemas on all inputs
4. **CORS**: Configurable origin (default '*' in dev)
5. **Headers**: Helmet provides CSP, X-Frame-Options, etc.
6. **AsyncStorage**: iOS Keychain, Android Keystore (encrypted by React Native)

## Scalability Notes

**Current Design Supports:**
- 1000+ tasks per user (pagination not yet implemented)
- 10k concurrent users (single MongoDB instance)

**For Production Scale:**
- Add pagination to task list endpoint
- Implement caching (Redis)
- Split read/write MongoDB replicas
- Add APM (New Relic, DataDog)
- Implement request rate limiting
- Use CDN for static assets

