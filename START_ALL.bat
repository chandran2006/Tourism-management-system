@echo off
title YatraMate - Starting All Services
color 0A

echo.
echo ========================================
echo   YatraMate - Starting All Services
echo ========================================
echo.
echo [1/3] Starting MySQL Database...
echo Please ensure MySQL is running manually
echo.

timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend Server (Port 5000)...
start "YatraMate Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend (Port 5173)...
start "YatraMate Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo (Backend and Frontend will keep running)
pause >nul
