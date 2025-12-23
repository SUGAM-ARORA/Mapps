# Quick Reference Guide

## Project Structure at a Glance

```
Mapp/
├── backend/
│   ├── src/
│   │   ├── server.ts          👈 Entry point
│   │   ├── setup.ts           👈 Express app factory
│   │   ├── middleware/        👈 Auth middleware
│   │   ├── models/            👈 Mongoose schemas (User, Task)
│   │   ├── routes/            👈 API endpoints
│   │   │   ├── auth.ts        (register, login)
│   │   │   └── tasks.ts       (CRUD, toggle, filtering)
│   │   └── utils/
│   │       ├── db.ts          (MongoDB connection)
│   │       ├── errors.ts      (Error handling)
│   │       └── validation.ts  (Zod schemas)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile             👈 Production image
│   └── .env.example           👈 Copy to .env
│
├── mobile/
│   ├── src/
│   │   ├── App.tsx            👈 Root wrapper
│   │   ├── api/
│   │   │   ├── client.ts      (Axios instance)
│   │   │   ├── auth.ts        (Login/register)
│   │   │   └── tasks.ts       (Task endpoints)
│   │   ├── components/        👈 UI primitives
│   │   │   ├── TaskCard.tsx
│   │   │   ├── AccentButton.tsx
│   │   │   ├── TextField.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── StatsDashboard.tsx
│   │   │   ├── TagSelector.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── SegmentedControl.tsx
│   │   │   └── LoadingStates.tsx
│   │   ├── screens/           👈 Full screens
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── TaskListScreen.tsx
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── store/             👈 Redux
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts
│   │   │   └── tasksSlice.ts
│   │   ├── hooks/             👈 Custom hooks
│   │   │   └── store.ts       (useAppDispatch, useAppSelector)
│   │   ├── navigation/
│   │   │   └── RootNavigator.tsx
│   │   ├── theme/
│   │   │   └── index.ts       (Colors, spacing, typography)
│   │   ├── types/
│   │   │   └── index.ts       (TypeScript definitions)
│   │   └── utils/
│   │       ├── date.ts        (Date formatting)
│   │       ├── taskHelpers.ts (Scoring, filtering)
│   │       └── validation.ts  (Zod schemas)
│   ├── babel.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml         👈 Full stack locally
├── .github/
│   └── workflows/             👈 CI/CD
│       ├── backend.yml
│       └── mobile.yml
├── README.md
├── SETUP.md
└── ARCHITECTURE.md
```

## Common Commands

### Backend

```bash
# Development
cd backend && npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Install new package
npm install package-name
```

### Mobile

```bash
# Start Metro
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Lint
npm run lint

# Install package
npm install package-name
```

### Docker

```bash
# Start all services
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Rebuild
docker-compose up --build
```

## API Quick Test

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"SecurePass1"}'

# Save token from response as TOKEN

# Create task
curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Buy milk",
    "priority":"high",
    "deadline":"2025-12-25T18:00:00Z",
    "tags":["shopping"],
    "category":"Personal"
  }'

# List tasks
curl -X GET http://localhost:4000/api/tasks \
  -H "Authorization: Bearer TOKEN"

# Toggle task
curl -X PATCH http://localhost:4000/api/tasks/{ID}/toggle \
  -H "Authorization: Bearer TOKEN"

# Delete task
curl -X DELETE http://localhost:4000/api/tasks/{ID} \
  -H "Authorization: Bearer TOKEN"
```

## Key Features

### Tasks
✅ Create with title, description, deadline, start time, priority, tags, category
✅ List (auto-sorted by urgency score)
✅ Mark complete/pending
✅ Delete
✅ Filter by status, category, tag
✅ Search by title/description

### UI
✅ Dark neon theme (obsidian + lilac + emerald)
✅ Responsive layout
✅ Smooth animations
✅ Loading skeletons
✅ Empty states
✅ Error messages

### Analytics
✅ Task count dashboard
✅ Completion rate %
✅ Category breakdown
✅ Priority distribution
✅ Overdue alerts

### Authentication
✅ Register with email + password
✅ Login
✅ JWT token (7 days)
✅ Persistent token (AsyncStorage)
✅ Auto sign-out on expired token

## Configuration Reference

### Backend `.env`
```bash
PORT=4000                                      # Server port
MONGO_URI=mongodb://localhost:27017/rn_todo    # Database
JWT_SECRET=change-me-in-production             # Token secret
NODE_ENV=development                           # dev/production
CORS_ORIGIN=*                                  # CORS allowed origins
```

### Mobile API Client (`src/api/client.ts`)
```typescript
// Local dev
baseURL: 'http://localhost:4000/api'

// Emulator
baseURL: 'http://10.0.2.2:4000/api'

// Physical device (replace with your IP)
baseURL: 'http://192.168.1.100:4000/api'
```

## Theme Colors

```typescript
palette = {
  background: '#0B1221',     // Dark navy
  surface: '#111A2C',        // Slightly lighter
  card: '#18263E',           // Card background
  primary: '#7C5DFA',        // Purple/lilac
  accent: '#3ED598',         // Emerald green
  warning: '#F5A524',        // Orange
  danger: '#F65858',         // Red
  text: '#E7ECF5',           // Light text
  muted: '#9AA4BF',          // Muted text
  border: '#1F2C44'          // Borders
}
```

## Validation Rules

### Password
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

Example: `SecurePass1` ✅

### Task Title
- Required (minimum 1 char)
- Maximum 100 characters

### Task Description
- Optional
- Maximum 500 characters

### Priority
- `low` | `medium` | `high` | `urgent`

### Task Status
- `pending` | `completed`

## Redux State Shape

```typescript
{
  auth: {
    user?: { id: string, email: string },
    token?: string,
    loading: boolean,
    error?: string
  },
  tasks: {
    items: Task[],
    loading: boolean,
    error?: string
  }
}
```

## Task Sorting Algorithm (Composite Score)

```
score = deadline_score + priority_weight + scheduled_score - completion_penalty

deadline_score:
  Overdue: 10,000
  Due today: 8,000
  Due within 7 days: 5,000 * (days_remaining / 7)
  Later: 100

priority_weight:
  urgent: 1,000
  high: 500
  medium: 100
  low: 10

scheduled_score:
  If scheduled within 24h: +2,000

completion_penalty:
  If completed: multiply all by 0.1
```

Higher score = higher priority in list.

## Development Workflows

### Add New Task Feature
1. Update `Task` interface in [mobile/src/types/index.ts](mobile/src/types/index.ts)
2. Update MongoDB schema in [backend/src/models/Task.ts](backend/src/models/Task.ts)
3. Update Zod schema in [backend/src/utils/validation.ts](backend/src/utils/validation.ts)
4. Update task API in [backend/src/routes/tasks.ts](backend/src/routes/tasks.ts)
5. Update mobile API client in [mobile/src/api/tasks.ts](mobile/src/api/tasks.ts)
6. Update Redux slice in [mobile/src/store/tasksSlice.ts](mobile/src/store/tasksSlice.ts)
7. Update component in [mobile/src/components/TaskCard.tsx](mobile/src/components/TaskCard.tsx)
8. Test with API curl + mobile app

### Add New Component
1. Create in [mobile/src/components/](mobile/src/components/)
2. Export from component file
3. Import and use in screen
4. Style with `palette` and `spacing` tokens

### Add New Screen
1. Create in [mobile/src/screens/](mobile/src/screens/)
2. Add to navigation in [mobile/src/navigation/RootNavigator.tsx](mobile/src/navigation/RootNavigator.tsx)
3. Hook into Redux via `useAppSelector` / `useAppDispatch`
4. Connect to API if needed

## Debugging Tips

### Backend Debug
```bash
# Enable debug logs (set in setup.ts)
export DEBUG=* npm run dev

# Check database
docker-compose exec mongo mongosh -u root -p password

# View API logs
tail -f backend/.log
```

### Mobile Debug
```bash
# Metro dev menu: Shake device or press Menu
# Select "Debug JS Remotely" → Opens Chrome DevTools

# Clear cache
npm start --reset-cache

# View console logs
npm start -- --verbose
```

### Network Debug
```bash
# Check API is responding
curl -v http://localhost:4000/health

# Emulator can reach host
adb shell ping 10.0.2.2

# Check firewall allows port 4000
sudo lsof -i :4000
```

## Production Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Configure MONGO_URI (MongoDB Atlas)
- [ ] Set CORS_ORIGIN to app domain
- [ ] Enable HTTPS (not http://)
- [ ] Update mobile API baseURL
- [ ] Build Android APK: `npm run build`
- [ ] Test on physical device
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Deploy backend (Docker/K8s/Vercel)
- [ ] Deploy mobile (Play Store/App Store)

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [Zod Validation](https://zod.dev/)

