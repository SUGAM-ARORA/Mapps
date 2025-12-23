@echo off
echo Starting Todo App Backend and Mobile...

echo.
echo 1. Starting MongoDB...
docker start rn_todo_mongo

echo.
echo 2. Starting Backend API...
start cmd /k "cd /d backend && npm run dev"

echo.
echo 3. Starting Mobile App...
start cmd /k "cd /d todo-expo && npx expo start"

echo.
echo Todo App is starting up!
echo - Backend: http://localhost:4000
echo - Mobile: Scan QR code with Expo Go
echo.
pause
