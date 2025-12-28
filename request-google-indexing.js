/**
 * Скрипт для запроса индексации в Google через IndexNow
 * 
 * Использование: node request-google-indexing.js
 * 
 * Примечание: Для полной функциональности рекомендуется использовать
 * Google Search Console API, но для базовой отправки можно использовать IndexNow
 */

const https = require('https');

// Конфигурация
const INDEXNOW_KEY = 'ecotek-as-2024-indexnow-key-abc123xyz789';
const SITE_URL = 'https://ecotek-as.ru';
const HOSTNAME = 'ecotek-as.ru';

// URL страниц для индексации
const URLs_TO_INDEX = [
    'https://ecotek-as.ru/',
];

/**
 * Отправка уведомления в Google через IndexNow
 * 
 * Примечание: Google поддерживает IndexNow, но для гарантированной индексации
 * лучше использовать Google Search Console API или ручной запрос через веб-интерфейс
 */
function requestGoogleIndexing(urls, key) {
    const data = JSON.stringify({
        host: HOSTNAME,
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

    // Google IndexNow endpoint (если доступен)
    // Примечание: Google может использовать другие методы для индексации
    const endpoints = [
        'https://www.google.com/ping?sitemap=https://ecotek-as.ru/sitemap.xml',
        // IndexNow для Google (если поддерживается)
    ];

    console.log('📤 Отправка запроса на индексацию в Google...');
    console.log(`🔗 URL: ${urls.join(', ')}`);
    console.log('');

    // Отправка ping для sitemap
    const sitemapUrl = new URL('https://www.google.com/ping');
    sitemapUrl.searchParams.set('sitemap', 'https://ecotek-as.ru/sitemap.xml');

    const req = https.get(sitemapUrl.toString(), (res) => {
        console.log(`✅ Google Sitemap Ping: Status ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log('✅ Sitemap успешно отправлен в Google');
        }
    });

    req.on('error', (error) => {
        console.error(`❌ Ошибка: ${error.message}`);
    });

    console.log('');
    console.log('💡 Рекомендация:');
    console.log('   Для гарантированной индексации используйте Google Search Console:');
    console.log('   1. Войдите в https://search.google.com/search-console');
    console.log('   2. Перейдите в раздел "Проверка URL"');
    console.log('   3. Введите URL: https://ecotek-as.ru/');
    console.log('   4. Нажмите "Запросить индексацию"');
    console.log('');
}

// Запуск
if (require.main === module) {
    console.log('🚀 Запрос индексации в Google');
    console.log(`📝 Ключ IndexNow: ${INDEXNOW_KEY}`);
    console.log(`🌐 Сайт: ${SITE_URL}`);
    console.log('');
    
    requestGoogleIndexing(URLs_TO_INDEX, INDEXNOW_KEY);
    
    console.log('✨ Готово!');
    console.log('');
    console.log('📋 Следующие шаги:');
    console.log('   1. Загрузите обновленный index.html на сервер');
    console.log('   2. Убедитесь, что sitemap.xml доступен');
    console.log('   3. Используйте Google Search Console для запроса индексации');
    console.log('   4. Подождите 1-7 дней для индексации');
}

module.exports = { requestGoogleIndexing, INDEXNOW_KEY, SITE_URL };
