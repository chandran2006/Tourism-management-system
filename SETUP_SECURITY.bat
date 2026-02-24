@echo off
echo ========================================
echo YatraMate Security Fixes Setup
echo ========================================
echo.

echo [1/4] Installing backend security dependencies...
cd backend
call npm install helmet express-rate-limit
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully
echo.

echo [2/4] Checking environment configuration...
if not exist .env (
    echo WARNING: .env file not found!
    echo Please create .env file with secure credentials
    echo See .env.example for reference
) else (
    echo ✓ .env file exists
)
echo.

echo [3/4] Testing database connection...
node -e "require('dotenv').config(); const db = require('./config/database'); db.query('SELECT 1').then(() => console.log('✓ Database connection successful')).catch(err => console.error('✗ Database connection failed:', err.message));"
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo IMPORTANT: Update your .env file with:
echo ========================================
echo 1. Strong DB_PASSWORD
echo 2. JWT_SECRET (min 32 characters)
echo 3. ADMIN_SECRET_KEY (min 32 characters)
echo.
echo Generate strong secrets with:
echo   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
echo.
echo ========================================
echo Start the server with: npm start
echo ========================================
echo.

cd ..
pause
