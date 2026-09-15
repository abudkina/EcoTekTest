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

function categoryBase(product) {
    if (product.category === 'fuel') return 'toplivo';
    if (product.category === 'products') return 'sredstva';
    return 'utilizaciya';
}

function pagePath(product) {
    return '/' + categoryBase(product) + '/' + product.slug + '/';
}

function parentMeta(product) {
    if (product.category === 'fuel') {
        return { name: 'Печное топливо', url: '/toplivo/', schemaName: 'Печное топливо' };
    }
    if (product.category === 'products') {
        return { name: 'Средства', url: '/catalog.html?filter=products', schemaName: 'Средства' };
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
    if (product.category === 'products') {
        return [
            name,
            'G-12 смазка',
            'проникающая смазка G-12',
            'универсальное смазывающее средство',
            'купить G-12 Москва',
            'средство G-12 ЭКОТЭК',
            'смазка от ржавчины',
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
    if (product.category === 'products') {
        return 'Смазка G-12 — купить в Москве и МО | ЭКОТЭК АС';
    }
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
    if (product.category === 'products') {
        return 'Многофункциональное проникающее смазывающее средство G-12 от ЭКОТЭК АС в Москве и МО. Очистка, смазка, защита от коррозии. Цена договорная. ☎ ' + COMPANY.phone;
    }
    return product.name + ' в Москве и МО: лицензии, вывоз, договор и акты. ЭКОТЭК АС, Старая Купавна. ☎ ' + COMPANY.phone;
}

function h1Text(product) {
    if (product.category === 'fuel') {
        return product.name + ' в Москве и Московской области';
    }
    if (product.category === 'products') {
        return product.name + ' в Москве и МО';
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
    if (product.category === 'products') {
        return [
            {
                q: 'Где купить смазку G-12 в Москве?',
                a: 'Многофункциональное проникающее смазывающее средство G-12 продаёт ЭКОТЭК АС в Москве и Московской области. Самовывоз в Старой Купавне или доставка. Телефон: ' + COMPANY.phone + '.'
            },
            {
                q: 'Для чего нужно средство G-12?',
                a: 'G-12 сочетает свойства очистителя, смазки и защитного покрытия: проникает в ржавчину, удаляет грязь и влагу, устраняет скрип, защищает от коррозии. Подходит для автомобилей, дома и производства.'
            },
            {
                q: 'Какая цена на G-12?',
                a: 'Стоимость договорная. Уточните актуальные условия по телефону ' + COMPANY.phone + ' или оставьте заявку на сайте.'
            },
            {
                q: 'Есть ли сертификат на средство G-12?',
                a: 'Да. Сертификат доступен на странице товара и в разделе лицензий сайта ЭКОТЭК АС.'
            },
            {
                q: 'Где забрать заказ?',
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

    if (product.category === 'fuel' || product.category === 'products') {
        const offer = {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            url: url,
            priceValidUntil: '2026-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            seller: provider,
            areaServed: areaServed
        };
        if (price != null) offer.price = price;
        if (product.category === 'fuel') {
            offer.shippingDetails = {
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
            };
        } else {
            offer.priceSpecification = {
                '@type': 'PriceSpecification',
                priceCurrency: 'RUB',
                description: 'Договорная стоимость'
            };
        }
        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: desc,
            image: image,
            sku: String(product.id),
            brand: { '@type': 'Brand', name: COMPANY.name },
            manufacturer: provider,
            category: product.category === 'fuel' ? 'Печное топливо' : 'Смазочные средства',
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
    const title = product.category === 'fuel'
        ? 'Другие виды топлива'
        : product.category === 'products'
            ? 'Другие товары'
            : 'Другие виды утилизации';
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
    if (product.category === 'products') {
        return `<div class="geo-summary" role="complementary">
                    <p><strong>${escapeHtml(product.name)} — ЭКОТЭК АС:</strong> универсальное проникающее смазывающее средство (очиститель, смазка, защита от коррозии). Продажа в Москве и Московской области. Цена договорная.</p>
                    <p><strong>Где купить:</strong> ${escapeHtml(COMPANY.address)}. Самовывоз и доставка по Москве и МО.</p>
                    <p><strong>Зона обслуживания:</strong> ${escapeHtml(cities)}.</p>
                    <p><strong>Контакты:</strong> <a href="tel:${COMPANY.phoneTel}">${COMPANY.phone}</a>, <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>. Сертификат в комплекте документов.</p>
                    <p><strong>Применение:</strong> резьбовые соединения, петли, замки, электрические контакты, автомобили, дом и производство.</p>
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

function fuelDefaultType(product) {
    if (/legkoe|lait|лайт/i.test(product.slug + ' ' + product.name)) return 'light';
    return 'dark';
}

function fuelMarketingHtml(product) {
    if (product.category !== 'fuel') return '';
    const fuelType = fuelDefaultType(product);
    const darkActive = fuelType === 'dark';
    return `
    <section class="fuel-details" id="fuel-details">
        <div class="container">
            <h2 class="section-title">Почему выбирают наше печное топливо</h2>
            <p class="fuel-types__lead">Стабильная котельная и меньшие затраты на обслуживание — без посредников и сюрпризов в партии.</p>
            <div class="fuel-grid">
                <div class="fuel-card">
                    <h3>1. Защита вашего оборудования</h3>
                    <ul>
                        <li>Глубокая <strong>3-ступенчатая фильтрация</strong> — удаляем механические примеси, металлическую стружку, воду и антифриз. Минимальная зольность.</li>
                        <li>Результат: чище горелки, меньше нагара, реже чистка котла, экономия на ремонте.</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>2. Стабильность тепла в любой мороз</h3>
                    <ul>
                        <li>Низкая температура застывания (−38&nbsp;°C) — топливо не густеет, система работает бесперебойно даже в сильные холода.</li>
                        <li>Высокая теплоотдача — эффективный обогрев при оптимальном расходе.</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>3. Полная документальная ответственность</h3>
                    <ul>
                        <li>С каждой партией — официальный паспорт качества. Вы точно знаете, что заливаете в котельную.</li>
                        <li>Работаем с юридическими лицами по всем правилам.</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>4. Экономия без посредников</h3>
                    <ul>
                        <li>Цена от производителя — платите за качественное топливо, а не за накрутки перекупщиков.</li>
                        <li>Гибкие условия опта — пробная партия от 1 тонны, индивидуальный расчёт для постоянных клиентов.</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>Для кого наше топливо идеально</h3>
                    <ul>
                        <li>Отопление складских помещений, сушильных камер, АБЗ</li>
                        <li>Котлы с масляными горелками (Buderus, Viessmann и др.)</li>
                        <li>Производственные и сельскохозяйственные объекты</li>
                        <li>Строительные площадки для обогрева</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>Условия поставки</h3>
                    <ul>
                        <li>Минимальный заказ — от 1 тонны</li>
                        <li>Доставка топливовозами по Москве и МО</li>
                        <li>Самовывоз в Старой Купавне</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>ЭКОТЭК Лайт — аналог ДТ</h3>
                    <ul>
                        <li>Подходит для котлов с дизельными горелками.</li>
                        <li>Высокая теплоотдача, стабильный состав, минимальное содержание серы.</li>
                        <li>Дешевле дизельного топлива без потери качества. Цена 45&nbsp;₽/л без НДС.</li>
                    </ul>
                </div>
                <div class="fuel-card">
                    <h3>Работаем с юрлицами</h3>
                    <ul>
                        <li>Договор, отсрочка платежа и закрывающие документы для бухгалтерии.</li>
                        <li>Паспорт качества готовы выслать по запросу — на каждую партию.</li>
                        <li>Мы производитель: своя лаборатория и производство в Старой Купавне.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <div class="fuel-calc-request-row">
        <section class="fuel-calculator-block" id="fuel-calculator" data-fuel="${fuelType}">
            <div class="container">
                <h2 class="section-title">Калькулятор стоимости</h2>
                <p class="lead-text" id="fuel-calc-lead">${darkActive
        ? 'Укажите объём в литрах или массу в кг — рассчитаем сумму. Цена: 30 ₽/л, ≈ 34,5 ₽/кг.'
        : 'Укажите объём в литрах или массу в кг — рассчитаем сумму. Цена: 45 ₽/л, ≈ 56 ₽/кг.'}</p>
                <div class="fuel-calc">
                    <div class="fuel-calc-tabs fuel-calc-tabs--type" role="group" aria-label="Тип топлива">
                        <button type="button" class="fuel-calc-tab fuel-calc-type${darkActive ? ' active' : ''}" data-fuel="dark" aria-pressed="${darkActive ? 'true' : 'false'}">Тёмное</button>
                        <button type="button" class="fuel-calc-tab fuel-calc-type${darkActive ? '' : ' active'}" data-fuel="light" aria-pressed="${darkActive ? 'false' : 'true'}">Лайт</button>
                    </div>
                    <div class="fuel-calc-tabs" role="group" aria-label="Единицы измерения">
                        <button type="button" class="fuel-calc-tab fuel-calc-unit-tab active" data-unit="liters" aria-pressed="true">Литры</button>
                        <button type="button" class="fuel-calc-tab fuel-calc-unit-tab" data-unit="kg" aria-pressed="false">Килограммы</button>
                    </div>
                    <div class="fuel-calc-input-wrap">
                        <label for="fuel-calc-value" class="fuel-calc-label">Объём, л</label>
                        <input type="number" id="fuel-calc-value" class="fuel-calc-input" min="0" step="1" placeholder="0" inputmode="decimal">
                        <span class="fuel-calc-unit">л</span>
                    </div>
                    <div class="fuel-calc-convert" aria-live="polite">
                        <span class="fuel-calc-convert-text">≈ <strong id="fuel-calc-other">0</strong> <span id="fuel-calc-other-unit">кг</span></span>
                    </div>
                    <div class="fuel-calc-result">
                        <span class="fuel-calc-result-label">Сумма</span>
                        <span id="fuel-calc-sum" class="fuel-calc-sum">0 ₽</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="request-block" id="request">
            <div class="container">
                <h2 class="section-title">Получить расчёт по печному топливу</h2>
                <p class="lead-text">Оставьте контакты — уточним объём, адрес доставки и подготовим коммерческое предложение.</p>
                <form id="request-form" class="request-form" novalidate>
                    <div class="request-form-row">
                        <div class="request-form-field">
                            <label for="request-name">Имя *</label>
                            <input type="text" id="request-name" name="name" required autocomplete="name">
                        </div>
                        <div class="request-form-field">
                            <label for="request-phone">Телефон *</label>
                            <input type="tel" id="request-phone" name="phone" required autocomplete="tel">
                        </div>
                    </div>
                    <div class="request-form-field">
                        <label for="request-message">Комментарий</label>
                        <textarea id="request-message" name="message" rows="4" placeholder="Например: объем, желаемые сроки, адрес доставки"></textarea>
                    </div>
                    <div id="request-form-status"></div>
                    <button type="submit" class="btn" id="request-submit">Отправить заявку</button>
                </form>
            </div>
        </section>
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
    if (product.category === 'products') {
        return `<ul class="product-page__geo-facts" aria-label="Условия продажи">
                    <li><strong>Регион:</strong> Москва и Московская область</li>
                    <li><strong>Склад:</strong> Старая Купавна</li>
                    <li><strong>Цена:</strong> договорная</li>
                    <li><strong>Документ:</strong> сертификат</li>
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
    const licensePdf = absUrl('/docs/Лицензия_Экотек.pdf');
    const isLicenseExtract = /Выписка/i.test(pdf);
    const isFuelPassport = product.category === 'fuel';
    const isProductCert = product.category === 'products';
    const pdfBlock = pdf
        ? (isLicenseExtract
            ? `<div class="product-page__docs">
                    <a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Выписка из реестра лицензий</a>
                    <a href="${escapeHtml(licensePdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Лицензия</a>
                </div>`
            : isFuelPassport
                ? `<a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Паспорт качества</a>`
                : isProductCert
                    ? `<a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Сертификат</a>`
                    : `<a href="${escapeHtml(pdf)}" target="_blank" rel="noopener noreferrer" class="btn btn-disk product-page__doc"><i class="fas fa-file-pdf" aria-hidden="true"></i> Открыть подробный файл (PDF)</a>`)
        : '';
    const imgAlt = product.category === 'utilization'
        ? product.name + ' в Москве и МО — ЭКОТЭК АС'
        : product.name + ' купить в Москве — ЭКОТЭК АС';
    const schemaItemType = product.category === 'utilization' ? 'Service' : 'Product';

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
    <section class="product-page page-top" itemscope itemtype="https://schema.org/${schemaItemType}">
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
                    <div class="product-page__actions">
                        ${product.category === 'fuel'
        ? `<a href="#request" class="btn" aria-label="Оставить заявку">
                            <i class="fas fa-pen" aria-hidden="true"></i> Оставить заявку
                        </a>`
        : `<button type="button" class="btn" id="btn-open-request" aria-label="Оставить заявку">
                            <i class="fas fa-pen" aria-hidden="true"></i> Оставить заявку
                        </button>`}
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

            <div class="product-page__description" itemprop="description">
                <h2>Описание</h2>
                <div class="product-page__description-body">${descHtml}</div>
            </div>

            ${faqHtml(faqs)}
            ${relatedLinksHtml(product, allProducts)}
        </div>
    </section>
    ${fuelMarketingHtml(product)}
</main>

${product.category === 'fuel' ? '' : `<div id="request-modal-overlay" class="modal-overlay request-modal-overlay" aria-hidden="true">
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
`}
<div id="site-footer"></div>
<script src="/static/js/include-partials.js"></script>
<script src="/static/js/request-form.js"></script>
${product.category === 'fuel' ? '<script src="/static/js/fuel-calculator.js"></script>' : ''}
</body>
</html>
`;
}

function generatePages(products) {
    const targets = products.filter(function (p) {
        return (p.category === 'fuel' || p.category === 'utilization' || p.category === 'products') && p.slug;
    });

    let count = 0;
    for (const product of targets) {
        const dir = path.join(root, 'public', categoryBase(product), product.slug);
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
