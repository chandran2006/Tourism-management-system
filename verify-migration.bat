@echo off
echo ========================================
echo   YatraMate - Vite Migration Verification
echo ========================================
echo.

cd frontend

echo Checking migration files...
echo.

set "ERRORS=0"

if exist "vite.config.js" (
    echo [OK] vite.config.js found
) else (
    echo [ERROR] vite.config.js missing
    set /a ERRORS+=1
)

if exist "index.html" (
    echo [OK] index.html found in root
) else (
    echo [ERROR] index.html missing in root
    set /a ERRORS+=1
)

if exist "src\main.jsx" (
    echo [OK] src\main.jsx found
) else (
    echo [ERROR] src\main.jsx missing
    set /a ERRORS+=1
)

if exist ".env" (
    echo [OK] .env found
) else (
    echo [ERROR] .env missing
    set /a ERRORS+=1
)

if exist ".env.example" (
    echo [OK] .env.example found
) else (
    echo [ERROR] .env.example missing
    set /a ERRORS+=1
)

echo.
echo Checking package.json...
findstr /C:"\"type\": \"module\"" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] package.json has "type": "module"
) else (
    echo [ERROR] package.json missing "type": "module"
    set /a ERRORS+=1
)

findstr /C:"\"dev\": \"vite\"" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] package.json has "dev" script
) else (
    echo [ERROR] package.json missing "dev" script
    set /a ERRORS+=1
)

findstr /C:"vite" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] package.json has vite dependency
) else (
    echo [ERROR] package.json missing vite dependency
    set /a ERRORS+=1
)

echo.
echo Checking documentation...
cd ..

if exist "VITE_MIGRATION_GUIDE.md" (
    echo [OK] VITE_MIGRATION_GUIDE.md found
) else (
    echo [ERROR] VITE_MIGRATION_GUIDE.md missing
    set /a ERRORS+=1
)

if exist "VITE_QUICK_REFERENCE.md" (
    echo [OK] VITE_QUICK_REFERENCE.md found
) else (
    echo [ERROR] VITE_QUICK_REFERENCE.md missing
    set /a ERRORS+=1
)

if exist "VITE_MIGRATION_CHECKLIST.md" (
    echo [OK] VITE_MIGRATION_CHECKLIST.md found
) else (
    echo [ERROR] VITE_MIGRATION_CHECKLIST.md missing
    set /a ERRORS+=1
)

echo.
echo ========================================
if %ERRORS% EQU 0 (
    echo   VERIFICATION PASSED!
    echo   All migration files are in place.
    echo.
    echo   Next steps:
    echo   1. Run: cd frontend ^&^& npm install
    echo   2. Run: npm run dev
    echo   3. Access: http://localhost:5173
) else (
    echo   VERIFICATION FAILED!
    echo   %ERRORS% error(s) found.
    echo   Please check the migration guide.
)
echo ========================================
echo.
pause
