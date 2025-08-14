@echo off
echo 🚀 Setting up PakFiller for deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install Vercel CLI globally
echo 📦 Installing Vercel CLI...
npm install -g vercel

REM Install all dependencies
echo 📦 Installing project dependencies...
call npm run install:all

REM Create environment files if they don't exist
echo 📝 Setting up environment files...

if not exist "be-filler\.env.local" (
    copy "be-filler\env.example" "be-filler\.env.local"
    echo ✅ Created be-filler\.env.local (please update with your values)
)

if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo ✅ Created backend\.env (please update with your values)
)

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Update environment variables in be-filler\.env.local
echo 2. Update environment variables in backend\.env
echo 3. Set up MongoDB database
echo 4. Run 'npm run deploy' to deploy both applications
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
pause
