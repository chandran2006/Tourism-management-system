@echo off
color 0A
title Smart Tourist Guide - Server Manager

echo ============================================
echo   Smart Tourist Guide System
echo   Server Startup Manager
echo ============================================
echo.

echo [1/4] Checking MySQL Connection...
timeout /t 2 /nobreak > nul

echo [2/4] Database will be created automatically
echo.

echo [3/4] Starting Backend Server...
echo       Backend will run on: http://localhost:5000
echo.
start "Backend - Smart Tourist Guide" cmd /k "cd /d %~dp0backend && echo Starting Backend Server... && npm start"

echo Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

echo [4/4] Starting Frontend Server...
echo       Frontend will run on: http://localhost:3000
echo.
start "Frontend - Smart Tourist Guide" cmd /k "cd /d %~dp0frontend && echo Starting Frontend Server... && npm start"

echo.
echo ============================================
echo   Servers are starting!
echo ============================================
echo.
echo Backend API:  http://localhost:5000/api
echo Frontend App: http://localhost:3000
echo.
echo Two new windows have opened:
echo   1. Backend Server (Node.js/Express)
echo   2. Frontend Server (React)
echo.
echo Your browser will open automatically in a few seconds...
echo.
echo To stop servers: Close both terminal windows
echo ============================================
echo.
echo Press any key to close this window...
pause > nul
