@echo off
REM Скрипт для отправки уведомлений в IndexNow через curl
REM Использование: indexnow-submit.bat

set INDEXNOW_KEY=ecotek-as-2024-indexnow-key-abc123xyz789
set SITE_URL=https://ecotek-as.ru
set HOSTNAME=ecotek-as.ru
set TEMP_JSON=%TEMP%\indexnow_data.json

echo Отправка уведомлений в IndexNow...
echo.

REM Создаем временный JSON файл
echo {> "%TEMP_JSON%"
echo   "host": "%HOSTNAME%",>> "%TEMP_JSON%"
echo   "key": "%INDEXNOW_KEY%",>> "%TEMP_JSON%"
echo   "keyLocation": "%SITE_URL%/%INDEXNOW_KEY%.txt",>> "%TEMP_JSON%"
echo   "urlList": ["%SITE_URL%/"]>> "%TEMP_JSON%"
echo }>> "%TEMP_JSON%"

echo Отправка в Яндекс IndexNow...
curl -X POST "https://yandex.com/indexnow" -H "Content-Type: application/json" --data-binary "@%TEMP_JSON%"
echo.
echo.

echo Отправка в Bing IndexNow...
curl -X POST "https://www.bing.com/indexnow" -H "Content-Type: application/json" --data-binary "@%TEMP_JSON%"
echo.
echo.

echo Отправка в IndexNow.org...
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" --data-binary "@%TEMP_JSON%"
echo.
echo.

REM Удаляем временный файл
del "%TEMP_JSON%" 2>nul

echo Готово! Уведомления отправлены.
pause
