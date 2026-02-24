@echo off
title YatraMate - Restart Dev Server
color 0E

echo.
echo ========================================
echo   Restarting YatraMate Dev Server
echo ========================================
echo.

cd frontend

echo [1/3] Clearing Vite cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
echo Cache cleared!

echo.
echo [2/3] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [3/3] Starting fresh dev server...
echo.
npm run dev

pause
