@echo off
echo ========================================
echo   Smart Tourist Guide - Starting...
echo ========================================
echo.

echo [1/3] Checking MySQL Service...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo [WARNING] MySQL80 service not found or not running
    echo Starting MySQL service...
    net start MySQL80 >nul 2>&1
)
echo [OK] MySQL service is running
echo.

echo [2/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"
timeout /t 5 /nobreak >nul
echo [OK] Backend started on http://localhost:5000
echo.

echo [3/3] Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"
echo [OK] Frontend starting on http://localhost:3000
echo.

echo ========================================
echo   All Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
echo (Servers will continue running in separate windows)
pause >nul
