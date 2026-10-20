@echo off
title K2rty Website Server
echo ======================================================
echo Starting K2rty Website local server...
echo ======================================================
cd /d "%~dp0"
node server.cjs
pause
