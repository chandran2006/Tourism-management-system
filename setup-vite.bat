@echo off
echo ========================================
echo   YatraMate - Vite Migration Setup
echo ========================================
echo.

cd frontend

echo [1/3] Cleaning old dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo [2/3] Installing Vite dependencies...
call npm install

echo.
echo [3/3] Setup complete!
echo.
echo ========================================
echo   Ready to start!
echo ========================================
echo.
echo To start the project:
echo   1. Start backend:  cd backend ^&^& npm start
echo   2. Start frontend: cd frontend ^&^& npm run dev
echo.
echo Frontend will run on: http://localhost:5173
echo Backend will run on:  http://localhost:5000
echo.
pause
