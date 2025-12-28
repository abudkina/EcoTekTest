/**
 * Скрипт для отправки уведомлений в IndexNow
 * Использование: node indexnow-submit.js
 * 
 * IndexNow - это протокол для уведомления поисковых систем об изменениях на сайте
 * Поддерживается Яндексом, Bing и другими поисковыми системами
 */

const https = require('https');

// Конфигурация
const INDEXNOW_KEY = 'ecotek-as-2024-indexnow-key-abc123xyz789';
const SITE_URL = 'https://ecotek-as.ru';
const INDEXNOW_ENDPOINTS = [
    'https://yandex.com/indexnow',
    'https://www.bing.com/indexnow',
    'https://api.indexnow.org/indexnow'
];

// URL страниц для уведомления об обновлении
const URLs_TO_NOTIFY = [
    'https://ecotek-as.ru/',
    // Добавьте сюда другие URL при необходимости
];

/**
 * Отправка уведомления в IndexNow
 */
function submitToIndexNow(urls, key) {
    const data = JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    // Отправляем на все endpoints
    INDEXNOW_ENDPOINTS.forEach(endpoint => {
        const url = new URL(endpoint);
        
        const req = https.request({
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: options.headers
        }, (res) => {
            console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
            res.on('data', (d) => {
                // Обычно IndexNow возвращает 200 или 202 при успехе
            });
        });

        req.on('error', (error) => {
            console.error(`❌ ${endpoint}: ${error.message}`);
        });

        req.write(data);
        req.end();
    });
}

// Запуск
if (require.main === module) {
    console.log('🚀 Отправка уведомлений в IndexNow...');
    console.log(`📝 Ключ: ${INDEXNOW_KEY}`);
    console.log(`🔗 URL для уведомления: ${URLs_TO_NOTIFY.join(', ')}`);
    console.log('');
    
    submitToIndexNow(URLs_TO_NOTIFY, INDEXNOW_KEY);
    
    console.log('');
    console.log('✨ Готово! Уведомления отправлены.');
    console.log('');
    console.log('💡 Примечание: IndexNow не возвращает подтверждение,');
    console.log('   но поисковые системы получат уведомление в течение нескольких минут.');
}

module.exports = { submitToIndexNow, INDEXNOW_KEY, SITE_URL };
