const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const productsPath = path.join(root, 'public', 'static', 'js', 'products-data.js');

const COMPANY = {
    name: 'ЭКОТЭК АС',
    legalName: 'ООО ЭКОТЭК АС',
    phone: '+7 (926) 615-00-77',
    phoneTel: '+79266150077',
    email: 'eco-tec-jsc@yandex.ru',
    site: 'https://ecotek-as.ru',
    address: 'Московская область, Богородский городской округ, Старая Купавна, Дорожная улица, 21Б',
    locality: 'Старая Купавна',
    region: 'Московская область',
    postalCode: '142450',
    street: 'Дорожная улица, 21Б',
    lat: 55.8077,
    lng: 38.1707,
    hours: 'пн–пт 9:00–18:00',
    yandexMaps: 'https://yandex.ru/maps/org/ekotek_as/107232674994/'
};

const AREA_CITIES = [
    'Москва',
    'Московская область',
    'Старая Купавна',
    'Богородский городской округ',
    'Ногинск',
    'Электросталь',
    'Балашиха',
    'Люберцы',
    'Подольск',
    'Химки',
    'Мытищи',
    'Королёв'
];

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

function stripHtml(raw) {
    return String(raw || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function clip(str, max) {
    const s = String(str || '');
    if (s.length <= max) return s;
    return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
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

function parsePrice(product) {
    if (product.category !== 'fuel') return null;
    const m = String(product.price || '').match(/(\d+[.,]?\d*)\s*₽/);
    if (!m) return null;
    return parseFloat(m[1].replace(',', '.'));
}

function keywordBase(product) {
    const name = product.name;
    const geo = 'Москва, Московская область, Старая Купавна, ЭКОТЭК АС';
    if (product.category === 'fuel') {
        return [
            name,
            name + ' Москва',
            name + ' купить',
            name + ' цена',
            name + ' оптом',
            'печное топливо Москва',
            'печное топливо Московская область',
            'купить печное топливо',
            'доставка печного топлива',
            geo
        ].join(', ');
    }
    return [
        name,
        name + ' Москва',
        name + ' Московская область',
        name + ' цена',
        name + ' вывоз',
        'утилизация отходов Москва',
        'лицензированная утилизация',
        'вывоз отходов МО',
        geo
    ].join(', ');
}

function seoTitle(product) {
    if (product.category === 'fuel') {
        return product.name + ' в Москве и МО | ЭКОТЭК АС';
    }
    // Shorten long names for title length
    const short = product.name
        .replace(/^Утилизация\s+/i, 'Утилизация ')
        .replace(/^Обезвреживание\s+/i, 'Обезвреживание ');
    return short + ' — Москва и МО | ЭКОТЭК АС';
}

function seoDescription(product) {
    if (product.category === 'fuel') {
        return product.name + ' от ЭКОТЭК АС. Цена ' + product.price +
            '. Доставка Москва и МО, от 1 т, без НДС. Старая Купавна. ☎ ' + COMPANY.phone;
    }
    return product.name + ' в Москве и МО: лицензии, вывоз, договор и акты. ЭКОТЭК АС, Старая Купавна. ☎ ' + COMPANY.phone;
}

function h1Text(product) {
    if (product.category === 'fuel') {
        return product.name + ' в Москве и Московской области';
    }
    return product.name + ' в Москве и МО';
}

function buildFaqs(product) {
    if (product.category === 'fuel') {
        return [
            {
                q: 'Где купить ' + product.name.toLowerCase() + ' в Москве?',
                a: product.name + ' продаёт ЭКОТЭК АС — производитель в Московской области (Старая Купавна). Доставка по Москве и МО, самовывоз со склада. Цена: ' + product.price + '. Телефон: ' + COMPANY.phone + '.'
            },
            {
                q: 'Какая цена на ' + product.name.toLowerCase() + '?',
                a: 'Актуальная цена — ' + product.price + ' без НДС. Минимальный заказ от 1 тонны. Точный расчёт зависит от объёма и адреса доставки — уточните по телефону ' + COMPANY.phone + '.'
            },
            {
                q: 'Доставляете ли печное топливо по Московской области?',
                a: 'Да. ЭКОТЭК АС доставляет печное топливо собственным транспортом по Москве и Московской области обычно за 1–2 дня. Также возможен самовывоз в Старой Купавне.'
            },
            {
                q: 'Какие документы выдаёте при покупке топлива?',
                a: 'Предоставляем полный пакет документов и паспорт качества по запросу. Работаем без НДС, наличный и безналичный расчёт.'
            },
            {
                q: 'Где находится склад ЭКОТЭК АС?',
                a: 'Адрес: ' + COMPANY.address + '. Режим работы: ' + COMPANY.hours + '. Email: ' + COMPANY.email + '.'
            }
        ];
    }
    return [
        {
            q: 'Как заказать услугу «' + product.name + '» в Москве?',
            a: 'Позвоните ' + COMPANY.phone + ' или оставьте заявку на сайте ecotek-as.ru. Опишите тип отходов, объём и адрес — рассчитаем стоимость и согласуем вывоз по Москве или Московской области.'
        },
        {
            q: 'Есть ли лицензия на ' + product.name.toLowerCase() + '?',
            a: 'Да. ЭКОТЭК АС работает по лицензиям на сбор, транспортировку, обработку и утилизацию отходов. Предоставляем договор, акты и полный пакет отчётных документов.'
        },
        {
            q: 'Вывозите ли отходы своим транспортом по МО?',
            a: 'Да, вывоз собственным транспортом по Москве и Московской области. Для ряда отходов возможен приём на нашей площадке в Старой Купавне.'
        },
        {
            q: 'Сколько стоит ' + product.name.toLowerCase() + '?',
            a: 'Стоимость договорная и зависит от объёма, класса опасности и адреса. Для расчёта свяжитесь с нами: ' + COMPANY.phone + ', ' + COMPANY.email + '.'
        },
        {
            q: 'В каких районах принимаете заявки?',
            a: 'Работаем по Москве и Московской области, в том числе: Старая Купавна, Ногинск, Электросталь, Балашиха, Люберцы, Подольск, Химки, Мытищи, Королёв и другие населённые пункты МО.'
        }
    ];
}

function localBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': COMPANY.site + '/#organization',
        name: COMPANY.name,
        alternateName: ['ЭкоТэк', 'Экотэк', 'EcoTek', 'ЭКОТЭК'],
        legalName: COMPANY.legalName,
        url: COMPANY.site,
        telephone: COMPANY.phoneTel,
        email: COMPANY.email,
        foundingDate: '2021',
        image: COMPANY.site + '/static/images/Screenshot_1.jpg',
        logo: COMPANY.site + '/static/images/Screenshot_1.jpg',
        address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY.street,
            addressLocality: COMPANY.locality,
            addressRegion: COMPANY.region,
            postalCode: COMPANY.postalCode,
            addressCountry: 'RU'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: COMPANY.lat,
            longitude: COMPANY.lng
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
        },
        areaServed: [
            { '@type': 'City', name: 'Москва' },
            { '@type': 'State', name: 'Московская область' }
        ],
        sameAs: [COMPANY.yandexMaps]
    };
}

function productOrServiceSchema(product, url, image, desc) {
    const price = parsePrice(product);
    const provider = {
        '@type': 'LocalBusiness',
        '@id': COMPANY.site + '/#organization',
        name: COMPANY.name,
        telephone: COMPANY.phoneTel,
        address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY.street,
            addressLocality: COMPANY.locality,
            addressRegion: COMPANY.region,
            postalCode: COMPANY.postalCode,
            addressCountry: 'RU'
        }
    };
    const areaServed = [
        { '@type': 'City', name: 'Москва' },
        { '@type': 'State', name: 'Московская область' },
        { '@type': 'City', name: 'Старая Купавна' }
    ];

    if (product.category === 'fuel') {
        const offer = {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            url: url,
            priceValidUntil: '2026-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            seller: provider,
            areaServed: areaServed,
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'RU',
                    addressRegion: ['Москва', 'Московская область']
                },
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
                    transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' }
                }
            }
        };
        if (price != null) offer.price = price;
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: desc,
            image: image,
            sku: String(product.id),
            brand: { '@type': 'Brand', name: COMPANY.name },
            manufacturer: provider,
            category: 'Печное топливо',
            offers: offer
        };
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: product.name,
        description: desc,
        image: image,
        serviceType: product.name,
        provider: provider,
        areaServed: areaServed,
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            url: url,
            priceCurrency: 'RUB',
            priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'RUB',
                description: 'Договорная стоимость'
            }
        }
    };
}

function relatedLinksHtml(product, allProducts) {
    const related = allProducts.filter(function (p) {
        return p.category === product.category && p.slug && p.slug !== product.slug;
    }).slice(0, 8);
    if (!related.length) return '';
    const items = related.map(function (p) {
        return '<li><a href="' + pagePath(p) + '">' + escapeHtml(p.name) + '</a></li>';
    }).join('\n');
    const title = product.category === 'fuel' ? 'Другие виды топлива' : 'Другие виды утилизации';
    return `
            <section class="product-page__related" aria-labelledby="related-title">
                <h2 id="related-title">${title}</h2>
                <ul class="product-page__related-list">
                    ${items}
                </ul>
            </section>`;
}

function faqHtml(faqs) {
    const items = faqs.map(function (f, i) {
        return `<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                    <p class="faq-q" itemprop="name">${escapeHtml(f.q)}</p>
                    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p class="faq-a" itemprop="text">${escapeHtml(f.a)}</p>
                    </div>
                </div>`;
    }).join('\n');
    return `
            <section class="geo-faq product-page__faq" itemscope itemtype="https://schema.org/FAQPage" aria-labelledby="faq-title">
                <h2 id="faq-title">Частые вопросы</h2>
                ${items}
            </section>`;
}

function geoSummaryHtml(product) {
    const cities = AREA_CITIES.join(', ');
    if (product.category === 'fuel') {
        return `<div class="geo-summary" role="complementary">
                    <p><strong>${escapeHtml(product.name)} — ЭКОТЭК АС (ecotek-as.ru):</strong> продажа печного топлива от производителя в Москве и Московской области. Цена ${escapeHtml(product.price)}, опт от 1 тонны, доставка 1–2 дня, работа без НДС, паспорт качества по запросу.</p>
                    <p><strong>Где купить:</strong> ${escapeHtml(COMPANY.address)}. Самовывоз и доставка.</p>
                    <p><strong>Зона обслуживания:</strong> ${escapeHtml(cities)}.</p>
                    <p><strong>Контакты:</strong> тел. <a href="tel:${COMPANY.phoneTel}">${COMPANY.phone}</a>, email <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>. Режим: ${COMPANY.hours}.</p>
                    <p><strong>Как заказать:</strong> позвонить или оставить заявку на сайте. Юрлицо — ${COMPANY.legalName}, работает с 2021 года.</p>
                </div>`;
    }
    return `<div class="geo-summary" role="complementary">
                    <p><strong>${escapeHtml(product.name)} — ЭКОТЭК АС:</strong> лицензированная услуга в Москве и Московской области. Вывоз собственным транспортом, договор, акты, отчётность. Стоимость договорная.</p>
                    <p><strong>Адрес компании:</strong> ${escapeHtml(COMPANY.address)}.</p>
                    <p><strong>Зона вывоза:</strong> ${escapeHtml(cities)}.</p>
                    <p><strong>Контакты:</strong> <a href="tel:${COMPANY.phoneTel}">${COMPANY.phone}</a>, <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>. Сайт: <a href="${COMPANY.site}">ecotek-as.ru</a>.</p>
                    <p><strong>Что входит:</strong> приём / вывоз отходов, безопасная переработка или обезвреживание, полный пакет документов для Роспотребнадзора и отчётности.</p>
                </div>`;
}

function geoFactsHtml(product) {
    if (product.category === 'fuel') {
        return `<ul class="product-page__geo-facts" aria-label="Условия поставки">
                    <li><strong>Регион:</strong> Москва и Московская область</li>
                    <li><strong>Склад:</strong> Старая Купавна</li>
                    <li><strong>Цена:</strong> ${escapeHtml(product.price)}</li>
                    <li><strong>Доставка:</strong> 1–2 дня / самовывоз</li>
                </ul>`;
    }
    return `<ul class="product-page__geo-facts" aria-label="Условия услуги">
                    <li><strong>Регион:</strong> Москва и Московская область</li>
                    <li><strong>Вывоз:</strong> собственным транспортом</li>
                    <li><strong>Документы:</strong> договор, акты, лицензии</li>
                    <li><strong>Цена:</strong> договорная</li>
                </ul>`;
}

function buildPage(product, allProducts) {
    const parent = parentMeta(product);
    const urlPath = pagePath(product);
    const url = COMPANY.site + urlPath;
    const image = COMPANY.site + absUrl(product.image);
    const desc = seoDescription(product);
    const title = seoTitle(product);
    const keywords = keywordBase(product);
    const h1 = h1Text(product);
    const descHtml = formatDescription(product.fullDescription);
    const faqs = buildFaqs(product);
    const pdf = product.pdfFile ? absUrl(product.pdfFile) : '';
    const pdfBlock = pdf
        ? `<a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Открыть подробный файл (PDF)</a>`
        : '';
    const imgAlt = product.category === 'fuel'
        ? product.name + ' купить в Москве — ЭКОТЭК АС'
        : product.name + ' в Москве и МО — ЭКОТЭК АС';

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url: url,
        name: title,
        description: desc,
        inLanguage: 'ru-RU',
        isPartOf: { '@type': 'WebSite', name: COMPANY.name, url: COMPANY.site },
        about: { '@id': COMPANY.site + '/#organization' },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        breadcrumb: { '@id': url + '#breadcrumb' },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.product-page__title', '.geo-summary', '.product-page__faq']
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': url + '#breadcrumb',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: COMPANY.site + '/' },
            { '@type': 'ListItem', position: 2, name: parent.schemaName, item: COMPANY.site + parent.url },
            { '@type': 'ListItem', position: 3, name: product.name, item: url }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (f) {
            return {
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
            };
        })
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
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="author" content="${COMPANY.name}">
    <meta name="geo.region" content="RU-MOS">
    <meta name="geo.placename" content="Старая Купавна, Московская область">
    <meta name="geo.position" content="${COMPANY.lat};${COMPANY.lng}">
    <meta name="ICBM" content="${COMPANY.lat}, ${COMPANY.lng}">
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="ru" href="${url}">
    <link rel="alternate" hreflang="x-default" href="${url}">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">

    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:alt" content="${escapeHtml(imgAlt)}">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:site_name" content="${COMPANY.name}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(desc)}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${escapeHtml(imgAlt)}">

    <script type="application/ld+json">${JSON.stringify(localBusinessSchema())}</script>
    <script type="application/ld+json">${JSON.stringify(productOrServiceSchema(product, url, image, desc))}</script>
    <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>

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
    <section class="product-page page-top" itemscope itemtype="https://schema.org/${product.category === 'fuel' ? 'Product' : 'Service'}">
        <div class="container">
            ${geoSummaryHtml(product)}

            <nav class="product-page__breadcrumbs" aria-label="Хлебные крошки">
                <a href="/">Главная</a>
                <span aria-hidden="true">/</span>
                <a href="${parent.url}">${escapeHtml(parent.name)}</a>
                <span aria-hidden="true">/</span>
                <span>${escapeHtml(product.name)}</span>
            </nav>

            <div class="product-page__layout">
                <div class="product-page__media">
                    <img src="${escapeHtml(absUrl(product.image))}" alt="${escapeHtml(imgAlt)}" width="640" height="480" loading="eager" decoding="async" itemprop="image">
                    ${pdfBlock}
                </div>
                <div class="product-page__info">
                    <p class="product-page__category">${escapeHtml(parent.name)} · Москва и МО</p>
                    <h1 class="product-page__title" itemprop="name">${escapeHtml(h1)}</h1>
                    <p class="product-page__price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <span itemprop="priceCurrency" content="RUB"></span>
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <span ${parsePrice(product) != null ? 'itemprop="price" content="' + parsePrice(product) + '"' : ''}>${escapeHtml(product.price)}</span>
                    </p>
                    ${geoFactsHtml(product)}
                    <div class="product-page__description" itemprop="description">
                        <h2>Описание</h2>
                        <div class="product-page__description-body">${descHtml}</div>
                    </div>
                    <div class="product-page__actions">
                        <button type="button" class="btn" id="btn-open-request" aria-label="Оставить заявку">
                            <i class="fas fa-pen" aria-hidden="true"></i> Оставить заявку
                        </button>
                        <a href="tel:${COMPANY.phoneTel}" class="btn btn-outline" aria-label="Позвонить">
                            <i class="fas fa-phone" aria-hidden="true"></i> ${COMPANY.phone}
                        </a>
                    </div>
                    <p class="product-page__back">
                        <a href="${parent.url}">← Все ${escapeHtml(parent.name.toLowerCase())}</a>
                        <a href="/catalog.html">Каталог</a>
                        <a href="/contacts.html">Контакты</a>
                    </p>
                </div>
            </div>

            ${faqHtml(faqs)}
            ${relatedLinksHtml(product, allProducts)}
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
        fs.writeFileSync(path.join(dir, 'index.html'), buildPage(product, targets), 'utf8');
        count++;
        console.log('Generated', pagePath(product));
    }
    return { targets, count };
}

function updateSitemap(targets) {
    const sitemapPath = path.join(root, 'public', 'sitemap.xml');
    let xml = fs.readFileSync(sitemapPath, 'utf8');
    const today = new Date().toISOString().slice(0, 10);

    xml = xml.replace(/\n\s*<!-- product-pages-start -->[\s\S]*?<!-- product-pages-end -->\s*/g, '\n');

    const entries = targets.map(function (p) {
        const loc = COMPANY.site + pagePath(p);
        const img = COMPANY.site + absUrl(p.image);
        return `    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
        <image:image>
            <image:loc>${img}</image:loc>
            <image:title>${escapeHtml(p.name)} — Москва и МО</image:title>
            <image:caption>${escapeHtml(clip(seoDescription(p), 120))}</image:caption>
        </image:image>
    </url>`;
    }).join('\n\n');

    const block = `\n    <!-- product-pages-start -->\n${entries}\n    <!-- product-pages-end -->\n`;
    xml = xml.replace('</urlset>', block + '</urlset>');
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log('Updated sitemap.xml with', targets.length, 'product pages');
}

const products = loadProducts();
const { targets, count } = generatePages(products);
updateSitemap(targets);
console.log('Done:', count, 'pages with SEO/GEO');
