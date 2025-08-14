@echo off
echo Starting Be-Filler Development Environment...
echo.

echo Starting Backend Server...
cd Be-filler-server
start cmd /k "npm start"
cd ..

echo.
echo Starting Frontend Server...
cd be-filler
start cmd /k "npm run dev"
cd ..

echo.
echo Development servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script...
pause > nul 