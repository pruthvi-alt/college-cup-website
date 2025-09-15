@echo off
echo Starting College Cup Tournament Website...
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking MySQL connection...
mysql --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Warning: MySQL CLI not found in PATH
    echo Please ensure MySQL is installed and accessible
)

echo.
echo Installing backend dependencies...
cd backend
if not exist node_modules (
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting backend server...
echo Backend will be available at http://localhost:3000
echo Frontend will be available by opening index.html in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
