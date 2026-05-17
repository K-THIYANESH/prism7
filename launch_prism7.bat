@echo off
:: PRISM7 Unified Forensic Station Launcher
:: Integrates Backend, Frontend, and Blockchain Vault

echo ==========================================
echo PRISM7 // Global Forensic Station
echo ==========================================
echo STARTING SYSTEM PROTOCOLS...
echo.

:: 1. Check for 'venv'
if exist venv\Scripts\activate.bat (
    set VENV_PATH=venv
) else (
    echo [ERROR] Virtual environment 'venv' not found.
    pause
    exit /b 1
)

echo [OK] Forensic Environment: %VENV_PATH%

:: 2. Launch Blockchain Node (The Vault)
echo [OK] Initializing Blockchain Ledger...
if exist "blockchain\Blockchain-Based-Evidence-Management-System-main" (
    start "PRISM7_BLOCKCHAIN" cmd /k "cd blockchain\Blockchain-Based-Evidence-Management-System-main && npx hardhat node"
    start "PRISM7_DEPLOYER" cmd /c "deploy_ledger.bat"
) else (
    echo [WARNING] Blockchain system not found. Running in offline mode.
)

:: 3. Launch Backend & Hosted Frontend
echo [OK] Starting Unified Analysis Engine...
start "PRISM7_BACKEND" cmd /k "call venv\Scripts\activate.bat && python backend/app.py"

:: 4. Launch Browser automatically
echo [OK] Launching Forensic Dashboard...
timeout /t 3 >nul
start http://127.0.0.1:5000/

echo.
echo ==========================================
echo SUCCESS: All Systems Operational.
echo Unified App: http://127.0.0.1:5000/ (OPEN THIS IN BROWSER)
echo Blockchain: http://127.0.0.1:8545 (API Endpoint - Do Not Open)
echo ==========================================
echo.
exit
