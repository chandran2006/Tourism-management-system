@echo off
echo ========================================
echo   Starting YatraMate (Vite Version)
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Starting servers...
echo.

start "YatraMate Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
start "YatraMate Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Close this window when done.
pause
