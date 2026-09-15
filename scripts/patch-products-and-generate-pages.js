const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const productsPath = path.join(root, 'public', 'static', 'js', 'products-data.js');

const SLUG_MAP = [
    [1, 'Темное печное топливо', 'temnoe-pechnoe-toplivo'],
    [2, 'Утилизация промышленных отходов', 'promyshlennye-othody'],
    [3, 'Утилизация лакокрасочных отходов', 'lakokrasochnye-othody'],
    [4, 'Утилизация отработанных масел', 'otrabotannye-masla'],
    [5, 'Обезвреживание медицинских отходов', 'medicinskie-othody'],
    [7, 'Утилизация воды, загрязненной нефтепродуктами', 'voda-nefteprodukty'],
    [8, 'Утилизация грунта, загрязненного нефтепродуктами', 'grunt-nefteprodukty'],
    [9, 'Утилизация резины', 'rezina'],
    [10, 'Утилизация дизельного топлива', 'dizelnoe-toplivo'],
    [11, 'Утилизация песка', 'pesok'],
    [12, 'Утилизация спецодежды', 'specodezhda'],
    [13, 'Утилизация шлама', 'shlam'],
    [14, 'Утилизация масляных фильтров', 'maslyanye-filtry'],
    [15, 'Утилизация нефтепродуктов', 'nefteprodukty'],
    [16, 'Утилизация трансформаторного масла', 'transformatornoe-maslo'],
    [17, 'Утилизация моторного масла', 'motornoe-maslo']
];

function patchProductsData() {
    let s = fs.readFileSync(productsPath, 'utf8');

    for (const [id, name, slug] of SLUG_MAP) {
        if (s.includes('slug: "' + slug + '"')) continue;
        const needle = 'id: ' + id + ',\n                        name: "' + name + '",';
        if (!s.includes(needle)) {
            throw new Error('Product not found: ' + id + ' ' + name);
        }
        s = s.replace(needle, needle + '\n                        slug: "' + slug + '",');
    }

    if (!s.includes('legkoe-pechnoe-toplivo')) {
        const lightFuel = `,
                    {
                        id: 18,
                        name: "Легкое печное топливо ЭКОТЭК Лайт",
                        slug: "legkoe-pechnoe-toplivo",
                        category: "fuel",
                        price: "45 ₽/л",
                        image: "static/images/fuel-light-brown.png",
                        pdfFile: "docs/Паспорт_темное_печное_топливо_2026.pdf",
                        fullDescription: "<p style='font-size: 1.1em; font-weight: 600; color: #2c3e50; margin-bottom: 20px;'>Дизельное печное топливо — тепло без переплат</p><div style='background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;'><p style='margin: 0;'><strong>ЭКОТЭК Лайт</strong> — качественный аналог ДТ для котлов с дизельными горелками.</p><p style='margin: 10px 0 0 0;'>Высокая теплоотдача, минимум серы. Цена 45 ₽/л без НДС. Самовывоз в Старой Купавне. Паспорт качества по запросу.</p></div><h4 style='color: #2c3e50; margin: 25px 0 15px 0; font-size: 1.2em; border-bottom: 2px solid #3498db; padding-bottom: 8px;'>Характеристики:</h4><ul style='list-style: none; padding: 0; margin: 0 0 25px 0;'><li style='padding: 10px 0; border-bottom: 1px solid #ecf0f1;'><strong>Цена:</strong> 45 ₽/л без НДС</li><li style='padding: 10px 0; border-bottom: 1px solid #ecf0f1;'><strong>Применение:</strong> котлы с дизельными горелками</li><li style='padding: 10px 0; border-bottom: 1px solid #ecf0f1;'><strong>Теплоотдача:</strong> высокая — эффективное отопление</li><li style='padding: 10px 0; border-bottom: 1px solid #ecf0f1;'><strong>Состав:</strong> стабильный, минимальное содержание серы, без примесей</li><li style='padding: 10px 0;'><strong>Выгода:</strong> дешевле дизельного топлива без потери качества</li></ul><h4 style='color: #2c3e50; margin: 25px 0 15px 0; font-size: 1.2em; border-bottom: 2px solid #3498db; padding-bottom: 8px;'>Условия продажи:</h4><div style='background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;'><ul style='list-style: none; padding: 0; margin: 0;'><li style='padding: 8px 0;'><strong>Оптовые поставки</strong> от 1 тонны</li><li style='padding: 8px 0;'><strong>Доставка</strong> собственным транспортом / самовывоз в Старой Купавне</li><li style='padding: 8px 0;'><strong>Форма оплаты:</strong> наличный и безналичный расчет</li><li style='padding: 8px 0;'><strong>Документы:</strong> паспорт качества по запросу</li></ul></div>",
                        shortDescription: "ЭКОТЭК Лайт — легкое печное топливо для котлов с дизельными горелками. Цена 45 ₽/л без НДС, высокая теплоотдача, минимум серы..."
                    }`;
        s = s.replace(/\];\s*$/, lightFuel + '\n];\n');
    }

    fs.writeFileSync(productsPath, s);
    console.log('Patched products-data.js');
}

function loadProducts() {
    const code = fs.readFileSync(productsPath, 'utf8');
    const ctx = { window: {} };
    vm.runInNewContext(code, ctx);
    return ctx.window.ecotekCatalogProducts;
}

function absUrl(rel) {
    if (!rel) return '';
    return rel.startsWith('/') ? rel : '/' + rel;
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDescription(fullDescription) {
    if (!fullDescription) return '';
    if (fullDescription.indexOf('<') >= 0) return fullDescription;
    return escapeHtml(fullDescription).replace(/\n/g, '<br>\n');
}

function plainDescription(product) {
    const raw = product.shortDescription || product.fullDescription || '';
    return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
}

function pagePath(product) {
    const base = product.category === 'fuel' ? 'toplivo' : 'utilizaciya';
    return '/' + base + '/' + product.slug + '/';
}

function parentMeta(product) {
    if (product.category === 'fuel') {
        return { name: 'Печное топливо', url: '/toplivo/', schemaName: 'Печное топливо' };
    }
    return { name: 'Утилизация отходов', url: '/utilizaciya/', schemaName: 'Утилизация отходов' };
}

function schemaType(product) {
    return product.category === 'fuel' ? 'Product' : 'Service';
}

function buildPage(product) {
    const parent = parentMeta(product);
    const url = 'https://ecotek-as.ru' + pagePath(product);
    const image = 'https://ecotek-as.ru' + absUrl(product.image);
    const desc = plainDescription(product);
    const title = product.name + ' | ЭКОТЭК АС Москва и МО';
    const descHtml = formatDescription(product.fullDescription);
    const pdf = product.pdfFile ? absUrl(product.pdfFile) : '';
    const pdfBlock = pdf
        ? `<a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Открыть подробный файл (PDF)</a>`
        : '';

    const schema = product.category === 'fuel'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: desc,
            image: image,
            brand: { '@type': 'Brand', name: 'ЭКОТЭК АС' },
            offers: {
                '@type': 'Offer',
                priceCurrency: 'RUB',
                availability: 'https://schema.org/InStock',
                url: url
            },
            category: 'Печное топливо'
        }
        : {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: product.name,
            description: desc,
            image: image,
            provider: { '@type': 'LocalBusiness', name: 'ЭКОТЭК АС', url: 'https://ecotek-as.ru' },
            areaServed: [
                { '@type': 'City', name: 'Москва' },
                { '@type': 'State', name: 'Московская область' }
            ],
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                url: url
            }
        };

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(desc)}">
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="ru" href="${url}">
    <link rel="alternate" hreflang="x-default" href="${url}">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">

    <meta property="og:title" content="${escapeHtml(product.name)} | ЭКОТЭК АС">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:site_name" content="ЭКОТЭК АС">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(product.name)} | ЭКОТЭК АС">
    <meta name="twitter:description" content="${escapeHtml(desc)}">
    <meta name="twitter:image" content="${image}">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://ecotek-as.ru/' },
            { '@type': 'ListItem', position: 2, name: parent.schemaName, item: 'https://ecotek-as.ru' + parent.url },
            { '@type': 'ListItem', position: 3, name: product.name, item: url }
        ]
    })}</script>

    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/png" href="/static/images/Screenshot_1-Photoroom.png">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/static/images/Screenshot_1-Photoroom.png">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="/static/css/styles.css">

    <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105952677', 'ym');
    ym(105952677, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/105952677" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
</head>
<body>
<div id="site-header"></div>

<main>
    <section class="product-page page-top">
        <div class="container">
            <nav class="product-page__breadcrumbs" aria-label="Хлебные крошки">
                <a href="/">Главная</a>
                <span aria-hidden="true">/</span>
                <a href="${parent.url}">${escapeHtml(parent.name)}</a>
                <span aria-hidden="true">/</span>
                <span>${escapeHtml(product.name)}</span>
            </nav>

            <div class="product-page__layout">
                <div class="product-page__media">
                    <img src="${escapeHtml(absUrl(product.image))}" alt="${escapeHtml(product.name)}" width="640" height="480" loading="eager" decoding="async">
                    ${pdfBlock}
                </div>
                <div class="product-page__info">
                    <p class="product-page__category">${escapeHtml(parent.name)}</p>
                    <h1 class="product-page__title">${escapeHtml(product.name)}</h1>
                    <p class="product-page__price">${escapeHtml(product.price)}</p>
                    <div class="product-page__description">
                        <h2>Описание</h2>
                        <div class="product-page__description-body">${descHtml}</div>
                    </div>
                    <div class="product-page__actions">
                        <button type="button" class="btn" id="btn-open-request" aria-label="Оставить заявку">
                            <i class="fas fa-pen" aria-hidden="true"></i> Оставить заявку
                        </button>
                        <a href="tel:+79266150077" class="btn btn-outline" aria-label="Позвонить">
                            <i class="fas fa-phone" aria-hidden="true"></i> +7 (926) 615-00-77
                        </a>
                    </div>
                    <p class="product-page__back">
                        <a href="${parent.url}">← Все ${escapeHtml(parent.name.toLowerCase())}</a>
                        <a href="/catalog.html">Каталог</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
</main>

<div id="request-modal-overlay" class="modal-overlay request-modal-overlay" aria-hidden="true">
    <div class="request-modal-content modal-content">
        <button type="button" class="modal-close" id="request-modal-close" aria-label="Закрыть">×</button>
        <div class="request-modal-body">
            <h2>Оставить заявку</h2>
            <p>Оставьте контакты — перезвоним и обсудим задачу.</p>
            <form id="request-form" novalidate>
                <label for="request-name">Имя *</label>
                <input type="text" id="request-name" name="name" required autocomplete="name">
                <label for="request-phone">Телефон *</label>
                <input type="tel" id="request-phone" name="phone" required autocomplete="tel">
                <label for="request-message">Сообщение</label>
                <textarea id="request-message" name="message" rows="4" placeholder="Кратко опишите задачу или вопрос"></textarea>
                <div id="request-form-status"></div>
                <button type="submit" class="btn" id="request-submit">Отправить заявку</button>
            </form>
        </div>
    </div>
</div>

<div id="site-footer"></div>
<script src="/static/js/include-partials.js"></script>
<script src="/static/js/request-form.js"></script>
</body>
</html>
`;
}

function generatePages(products) {
    const targets = products.filter(function (p) {
        return (p.category === 'fuel' || p.category === 'utilization') && p.slug;
    });

    let count = 0;
    for (const product of targets) {
        const base = product.category === 'fuel' ? 'toplivo' : 'utilizaciya';
        const dir = path.join(root, 'public', base, product.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), buildPage(product), 'utf8');
        count++;
        console.log('Generated', pagePath(product));
    }
    return { targets, count };
}

function updateSitemap(targets) {
    const sitemapPath = path.join(root, 'public', 'sitemap.xml');
    let xml = fs.readFileSync(sitemapPath, 'utf8');
    const today = new Date().toISOString().slice(0, 10);

    // Remove previously generated product URLs (between markers or by pattern)
    xml = xml.replace(/\n\s*<!-- product-pages-start -->[\s\S]*?<!-- product-pages-end -->\s*/g, '\n');

    const entries = targets.map(function (p) {
        const loc = 'https://ecotek-as.ru' + pagePath(p);
        const img = 'https://ecotek-as.ru' + absUrl(p.image);
        return `    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
        <image:image>
            <image:loc>${img}</image:loc>
            <image:title>${escapeHtml(p.name)}</image:title>
        </image:image>
    </url>`;
    }).join('\n\n');

    const block = `\n    <!-- product-pages-start -->\n${entries}\n    <!-- product-pages-end -->\n`;
    xml = xml.replace('</urlset>', block + '</urlset>');
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log('Updated sitemap.xml with', targets.length, 'product pages');
}

patchProductsData();
const products = loadProducts();
const { targets, count } = generatePages(products);
updateSitemap(targets);
console.log('Done:', count, 'pages');
