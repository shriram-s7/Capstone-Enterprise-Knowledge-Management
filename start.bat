@echo off
setlocal
title FinNova Launcher
cd /d "%~dp0"

echo ============================================
echo   Starting FinNova (Backend + Frontend)
echo ============================================

REM ---------- Find a system Python ----------
set "PYEXE="
where py >nul 2>nul && set "PYEXE=py -3"
if not defined PYEXE (
    where python >nul 2>nul && set "PYEXE=python"
)
if not defined PYEXE (
    echo Python not found. Install Python 3 and re-run.
    pause & exit /b 1
)

REM ---------- Backend venv (rebuild if missing or copied from another PC) ----------
set "VENV_PY=%~dp0backend\venv\Scripts\python.exe"
set "VENV_OK=0"
if exist "%VENV_PY%" (
    "%VENV_PY%" -c "import sys" >nul 2>nul && set "VENV_OK=1"
)
if "%VENV_OK%"=="0" (
    echo [Backend] Virtual environment missing or broken - recreating...
    if exist "backend\venv" rmdir /s /q "backend\venv"
    %PYEXE% -m venv backend\venv || (echo Failed to create venv. & pause & exit /b 1)
)

REM ---------- Install requirements if uvicorn is missing ----------
"%VENV_PY%" -c "import uvicorn, fastapi" >nul 2>nul
if errorlevel 1 (
    echo [Backend] Installing requirements...
    "%VENV_PY%" -m pip install -r backend\requirements.txt || (echo pip install failed. & pause & exit /b 1)
)

echo [Backend] Launching on http://127.0.0.1:8000 ...
start "FinNova Backend" /D "%~dp0." cmd /k ""%VENV_PY%" "%~dp0backend\run.py""

REM ---------- Frontend ----------
if not exist "node_modules" (
    echo [Frontend] Installing npm packages...
    call npm install || (pause & exit /b 1)
)

echo [Frontend] Launching on http://localhost:5173 ...
start "FinNova Frontend" /D "%~dp0." cmd /k npm run dev

REM ---------- Wait for the backend to answer before opening the browser ----------
echo Waiting for backend to come up...
set /a TRIES=0
:waitloop
powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/docs -TimeoutSec 2) | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
if not errorlevel 1 goto ready
set /a TRIES+=1
if %TRIES% GEQ 30 (
    echo Backend did not respond after 30s. Check the "FinNova Backend" window for errors.
    goto openbrowser
)
timeout /t 1 /nobreak >nul
goto waitloop

:ready
echo Backend is up.

:openbrowser
start "" http://localhost:5173

echo.
echo Both servers are running in separate windows.
echo Close those windows (or press Ctrl+C in them) to stop.
endlocal
