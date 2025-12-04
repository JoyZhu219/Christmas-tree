@echo off
echo.
echo 🎄 Grand Luxury Christmas Tree - Setup Script
echo ==============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo    Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected
node -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
echo    This may take a few minutes...
echo.
call npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Installation complete!
    echo.
    echo 🎯 Next Steps:
    echo    1. Add your photos to public\photos\ (see PHOTO-GUIDE.md^)
    echo    2. Run: npm run dev
    echo    3. Open: http://localhost:3000
    echo.
    echo 🚀 To deploy to web:
    echo    See DEPLOYMENT.md for detailed instructions
    echo.
    echo 📚 Need help?
    echo    Read README.md for full documentation
    echo.
    
    set /p START="🎄 Start development server now? (y/n): "
    if /i "%START%"=="y" (
        echo.
        echo 🚀 Starting development server...
        echo    Press Ctrl+C to stop
        echo.
        call npm run dev
    )
) else (
    echo.
    echo ❌ Installation failed!
    echo    Try: rmdir /s /q node_modules ^&^& npm install
    pause
    exit /b 1
)

pause
