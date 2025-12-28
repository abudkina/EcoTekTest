@echo off
REM Скрипт для отправки уведомлений в IndexNow через curl
REM Использование: indexnow-submit.bat

set INDEXNOW_KEY=ecotek-as-2024-indexnow-key-abc123xyz789
set SITE_URL=https://ecotek-as.ru
set HOSTNAME=ecotek-as.ru

echo Отправка уведомлений в IndexNow...
echo.

REM Создаем JSON данные
set JSON_DATA={"host":"%HOSTNAME%","key":"%INDEXNOW_KEY%","keyLocation":"%SITE_URL%/%INDEXNOW_KEY%.txt","urlList":["%SITE_URL%/"]}

echo Отправка в Яндекс IndexNow...
curl -X POST "https://yandex.com/indexnow" -H "Content-Type: application/json" -d "%JSON_DATA%"
echo.
echo.

echo Отправка в Bing IndexNow...
curl -X POST "https://www.bing.com/indexnow" -H "Content-Type: application/json" -d "%JSON_DATA%"
echo.
echo.

echo Отправка в IndexNow.org...
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" -d "%JSON_DATA%"
echo.
echo.

echo Готово! Уведомления отправлены.
pause
