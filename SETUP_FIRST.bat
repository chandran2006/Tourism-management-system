@echo off
title YatraMate - First Time Setup
color 0B

echo.
echo ========================================
echo   YatraMate - First Time Setup
echo ========================================
echo.

cd frontend

echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo.
    echo [SETUP] Installing frontend dependencies...
    echo This will take 2-3 minutes...
    echo.
    call npm install
    echo.
    echo [SUCCESS] Frontend dependencies installed!
) else (
    echo [OK] Frontend dependencies already installed.
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Now run: START_ALL.bat
echo.
pause
