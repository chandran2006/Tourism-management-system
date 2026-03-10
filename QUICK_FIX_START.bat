@echo off
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         YatraMate - Security Fixes Quick Start             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo [STEP 1] Installing Security Dependencies...
echo ────────────────────────────────────────────────────────────
cd backend
call npm install helmet express-rate-limit
if %errorlevel% neq 0 (
    color 0C
    echo ✗ Failed to install dependencies
    pause
    exit /b 1
)
color 0A
echo ✓ Dependencies installed
echo.

echo [STEP 2] Generating Secure Secrets...
echo ────────────────────────────────────────────────────────────
echo.
echo Your new JWT_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
echo.
echo Your new ADMIN_SECRET_KEY:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
echo.
echo ⚠️  IMPORTANT: Copy these secrets to your .env file!
echo.
pause

echo [STEP 3] Checking Configuration...
echo ────────────────────────────────────────────────────────────
if not exist .env (
    color 0E
    echo ⚠️  WARNING: .env file not found!
    echo.
    echo Creating .env from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo ✓ .env file created
        echo.
        echo ⚠️  Please update .env with:
        echo    1. Your MySQL password
        echo    2. The JWT_SECRET generated above
        echo    3. The ADMIN_SECRET_KEY generated above
        echo.
    ) else (
        echo ✗ .env.example not found
        echo Please create .env manually
    )
    pause
) else (
    color 0A
    echo ✓ .env file exists
    echo.
    echo Checking for weak secrets...
    findstr /C:"your_jwt_secret_key_here" .env >nul
    if %errorlevel% equ 0 (
        color 0E
        echo ⚠️  WARNING: Default JWT_SECRET detected!
        echo Please update with the generated secret above
        echo.
    ) else (
        color 0A
        echo ✓ JWT_SECRET appears to be customized
    )
    
    findstr /C:"Chandran@2006" .env >nul
    if %errorlevel% equ 0 (
        color 0C
        echo ✗ CRITICAL: Exposed password still in .env!
        echo Please update DB_PASSWORD immediately
        echo.
    ) else (
        color 0A
        echo ✓ No exposed passwords detected
    )
)
echo.

echo [STEP 4] Testing Database Connection...
echo ────────────────────────────────────────────────────────────
node -e "require('dotenv').config(); const db = require('./config/database'); db.query('SELECT 1').then(() => { console.log('✓ Database connection successful'); process.exit(0); }).catch(err => { console.error('✗ Database connection failed:', err.message); process.exit(1); });"
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ✗ Database connection failed
    echo.
    echo Troubleshooting:
    echo 1. Ensure MySQL is running
    echo 2. Check DB credentials in .env
    echo 3. Verify database exists
    echo.
    pause
    exit /b 1
)
echo.

color 0A
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    Setup Complete! ✓                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Security Features Enabled:
echo ✓ Helmet security headers
echo ✓ Rate limiting (100 req/15min general, 5 req/15min auth)
echo ✓ Input validation
echo ✓ SQL injection prevention
echo ✓ JWT validation (min 32 chars)
echo ✓ Strong password hashing (bcrypt 12 rounds)
echo ✓ CORS configuration
echo ✓ Error handling
echo.
echo ────────────────────────────────────────────────────────────
echo Next Steps:
echo ────────────────────────────────────────────────────────────
echo 1. Update .env with the generated secrets above
echo 2. Start backend:  npm start
echo 3. Start frontend: cd ..\frontend ^&^& npm run dev
echo.
echo ────────────────────────────────────────────────────────────
echo Documentation:
echo ────────────────────────────────────────────────────────────
echo • SECURITY_FIXES.md    - Detailed security documentation
echo • FIXES_APPLIED.md     - Complete list of fixes
echo • README.md            - Project documentation
echo.
echo ────────────────────────────────────────────────────────────
echo Testing:
echo ────────────────────────────────────────────────────────────
echo • Health check: http://localhost:5000/api/health
echo • Frontend:     http://localhost:5173
echo.

cd ..
pause
