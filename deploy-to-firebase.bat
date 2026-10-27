@echo off
title Deploy Smart Grocery ke Firebase Hosting
color 0A
echo ================================================================
echo   SMART GROCERY TRACKER - PELUNCURAN KE FIREBASE HOSTING
echo ================================================================
echo.

set "PATH=C:\Users\allen\AppData\Local\Programs\node-bin\node-v20.18.0-win-x64;%PATH%"

echo [LANGKAH 1/2] Mengautentikasi Akun Google Firebase...
echo Jendela browser akan terbuka otomatis. Silakan pilih akun Google Anda.
echo.
call firebase login

echo.
echo [LANGKAH 2/2] Mengunggah file ke Firebase Hosting (groceryapp-cb4b9)...
call firebase deploy --only hosting --project groceryapp-cb4b9

echo.
echo ================================================================
echo   SUKSES! Website Anda sudah online dan aktif di:
echo   --^> https://groceryapp-cb4b9.web.app
echo   --^> https://groceryapp-cb4b9.firebaseapp.com
echo ================================================================
echo.
pause
