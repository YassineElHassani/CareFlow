@echo off
REM Start CareFlow Mock Backend
REM This script will start the mock backend server on port 3000

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         CareFlow Mock Backend Launcher                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo Installing dependencies if needed...
npm install express cors body-parser --save-dev >nul 2>&1

echo.
echo Starting mock backend server...
echo.

node mock-backend.cjs

pause
