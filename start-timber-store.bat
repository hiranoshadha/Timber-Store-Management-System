@echo off
title Timber Store Application

:: Password protection
:PASSWD
set /p password="Enter password: "
if NOT %password%==TS0507 (
    echo Invalid password!
    goto PASSWD
)

:: If password correct, start applications
echo Starting Timber Store Application...

:: Start backend and wait
start /min cmd /c "cd backend && mvn spring-boot:run"
timeout /t 10 /nobreak

:: Start frontend
start /min cmd /c "cd frontend && npm start"

:: Display info
echo Timber Store is starting...
echo Backend: http://localhost:8081
echo Frontend: http://localhost:3000

:: Exit after brief delay
timeout /t 5
exit
