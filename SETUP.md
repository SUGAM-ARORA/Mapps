# Installation & Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+
- **Git**: v2.30+
- **Android SDK** (for mobile): API level 24+
- **MongoDB** (local or Atlas): v6.0+

### Verify Installation
```bash
node --version     # v18.x or higher
npm --version      # v9.x or higher
git --version      # v2.30+
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env
nano .env
```

Set these variables:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/rn_todo
JWT_SECRET=your-super-secret-change-this-in-production
NODE_ENV=development
CORS_ORIGIN=*
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows (Docker)
docker run -d -p 27017:27017 --name mongo mongo:7.0-alpine

# Or use Docker Compose (see below)
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com](https://mongodb.com)
2. Create a project and cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

```
mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/rn_todo?retryWrites=true&w=majority
```

### 4. Start Development Server
```bash
npm run dev
```

Expected output:
```
API running on http://localhost:4000
```

### 5. Verify API
```bash
# Health check
curl http://localhost:4000/health

# Should return:
# {"status":"ok","timestamp":"2025-12-22T..."}
```

## Mobile Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Android Development Environment

#### Using Android Studio (Recommended)
1. Download [Android Studio](https://developer.android.com/studio)
2. Install
3. Open Android Studio → More Actions → SDK Manager
4. Install:
   - API Level 24 (minimum)
   - API Level 30+ (recommended)
   - Google Play system image
   - Android SDK Platform-tools

#### Environment Variables (macOS/Linux)
```bash
export ANDROID_HOME=$HOME/Library/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Add to `.bashrc` or `.zshrc` for persistence.

#### Environment Variables (Windows)
1. Open Settings → Environment Variables
2. Add `ANDROID_HOME`: `C:\Users\<YourUser>\AppData\Local\Android\Sdk`
3. Add to `PATH`: `%ANDROID_HOME%\platform-tools`

### 3. Configure API Base URL

Edit [mobile/src/api/client.ts](mobile/src/api/client.ts):

```typescript
const api = axios.create({
  baseURL: 'http://10.0.2.2:4000/api'  // For emulator
  // OR
  // baseURL: 'http://192.168.1.100:4000/api'  // For physical device (use your IP)
});
```

**Find your machine IP:**
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig | grep "IPv4"
```

### 4. Start Metro Bundler
```bash
npm start
```

You should see:
```
► Press a to open Android (or i for iOS)
► Press w to show dev menu
► Press q to quit
```

### 5. Run on Android

#### Emulator
1. Open Android Studio
2. Tools → AVD Manager → Create Virtual Device (choose Pixel 6, API 30+)
3. Start the emulator
4. In terminal: `npm run android` (or press `a` in Metro)

#### Physical Device
1. Enable Developer Mode: Settings → About → Build Number (tap 7 times)
2. Enable USB Debugging: Settings → Developer Options
3. Connect via USB
4. Run: `npm run android`

## Docker Compose (Full Stack)

### Quick Start
```bash
# From root directory
docker-compose up -d

# Verify services
docker-compose ps
```

### Access Services
- **API**: http://localhost:4000/health
- **Mongo Express UI**: http://localhost:8081
- **MongoDB**: `mongodb://root:password@localhost:27017`

### Stop Services
```bash
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just MongoDB
docker-compose logs -f mongo
```

## Troubleshooting

### Backend Issues

**Port 4000 already in use**
```bash
# Kill process on port 4000 (macOS/Linux)
lsof -ti:4000 | xargs kill -9

# Or change PORT in .env
```

**MongoDB connection error**
```bash
# Verify MongoDB is running
mongo --eval "db.adminCommand('ping')"

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/rn_todo
```

**CORS errors in mobile**
```bash
# Set CORS_ORIGIN in .env
CORS_ORIGIN=*  # Development only!
```

### Mobile Issues

**Metro not starting**
```bash
# Clear cache and restart
npm start --reset-cache
```

**Emulator won't connect**
```bash
# List devices
adb devices

# If not showing, restart adb
adb kill-server && adb start-server
```

**API not reachable from emulator**
- Emulator IP for localhost: `10.0.2.2` (not `127.0.0.1`)
- Make sure backend is running: `curl http://localhost:4000/health`
- Check firewall rules allow port 4000

**TypeError: Cannot read property 'token'**
- Clear app data and cache
- Re-login (token in AsyncStorage may be corrupted)
- Check backend is responding with `success: true` in auth response

### Database Issues

**MongoDB won't start (Docker)**
```bash
# Check image exists
docker images | grep mongo

# Pull latest
docker pull mongo:7.0-alpine

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

**Duplicate key error on register**
```bash
# User email exists, use different email or:
# Clear database (careful!)
docker-compose exec mongo mongo rn_todo --eval "db.users.deleteMany({})"
```

## Testing Workflow

### 1. Test Backend API
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass1"
  }'

# Copy token from response

# Create task
curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "priority": "high",
    "deadline": "2025-12-31T23:59:59Z"
  }'
```

### 2. Test Mobile App
1. Open app in emulator
2. Register new account
3. Create task
4. Add title, description, priority, deadline, tags
5. Toggle completion
6. Delete task
7. Navigate to Analytics (should show stats)
8. Navigate to Settings
9. Sign out

## Development Tips

### Hot Reload
- **Backend**: `npm run dev` watches TypeScript files
- **Mobile**: Metro auto-refreshes on save (press `r` twice for hard refresh)

### Debug Mobile App
```bash
# Open debugger menu in app
# Shake device or press Menu key (emulator)
# Select "Debug JS Remotely"
```

### Database Visualization (Mongo Express)
1. Open http://localhost:8081
2. Select `rn_todo` database
3. Browse collections (users, tasks)

### View API Logs
```bash
# Terminal running backend
npm run dev

# Will show all requests:
# POST /api/auth/register 201
# POST /api/tasks 201
# etc.
```

## Next Steps

1. ✅ Backend running on `localhost:4000`
2. ✅ MongoDB connected
3. ✅ Mobile app starts and connects to API
4. 📝 Create test account and tasks
5. 🧪 Explore features (filters, analytics, settings)
6. 🚀 Deploy to test device or emulator
7. 📦 Prepare for production (see [README.md](README.md#deployment))

## Getting Help

- **Backend errors**: Check `npm run dev` terminal
- **Mobile errors**: Check Metro terminal (press `m` for menu)
- **API issues**: Use Postman/Insomnia to test endpoints
- **Database**: Use Mongo Express UI (http://localhost:8081)

