@echo off
:: PRISM7 // Ledger Deployment Utility
:: Decoupled from node to allow async startup

set BLOCKCHAIN_DIR=blockchain\Blockchain-Based-Evidence-Management-System-main

echo [LEDGER] WAITING_FOR_NODE_READY...
timeout /t 5 >nul

echo [LEDGER] INITIATING_DEPLOYMENT...
cd %BLOCKCHAIN_DIR%
call npx hardhat run scripts/deploy.js --network localhost

if %ERRORLEVEL% equ 0 (
    echo [LEDGER] DEPLOYMENT_SUCCESS: Forensic Authority Anchored.
) else (
    echo [LEDGER] DEPLOYMENT_FAILED: Potential Port Conflict or Config Error.
)
exit
