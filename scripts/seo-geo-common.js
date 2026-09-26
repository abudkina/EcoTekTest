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
    taxId: '5042157588',
    ogrn: '1215000106221',
    yandexMaps: 'https://yandex.ru/maps/org/ekotek_as/107232674994/',
    gisMaps: 'https://2gis.ru/staraya-kupavna/firm/70000001110147401'
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

function areaServedSchema() {
    return AREA_CITIES.map(function (name) {
        if (name === 'Московская область') {
            return { '@type': 'State', name: name };
        }
        if (name === 'Богородский городской округ') {
            return { '@type': 'AdministrativeArea', name: name };
        }
        return { '@type': 'City', name: name };
    });
}

function localBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'WasteManagement'],
        '@id': COMPANY.site + '/#organization',
        name: COMPANY.name,
        alternateName: ['ЭкоТэк АС', 'Экотэк АС', 'EcoTek AS', 'ЭКОТЭК АС'],
        legalName: COMPANY.legalName,
        url: COMPANY.site,
        telephone: COMPANY.phoneTel,
        email: COMPANY.email,
        foundingDate: '2021',
        taxID: COMPANY.taxId,
        identifier: COMPANY.ogrn,
        priceRange: '₽₽',
        image: COMPANY.site + '/static/images/Screenshot_1.jpg',
        logo: COMPANY.site + '/static/images/Screenshot_1.jpg',
        hasMap: COMPANY.yandexMaps,
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
        openingHours: 'Mo-Fr 09:00-18:00',
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: COMPANY.phoneTel,
                contactType: 'sales',
                availableLanguage: ['Russian'],
                areaServed: 'RU',
                email: COMPANY.email
            },
            {
                '@type': 'ContactPoint',
                telephone: COMPANY.phoneTel,
                contactType: 'customer service',
                availableLanguage: ['Russian'],
                areaServed: 'RU'
            }
        ],
        areaServed: areaServedSchema(),
        knowsAbout: [
            'Печное топливо',
            'Тёмное печное топливо',
            'Светлое печное топливо',
            'Дизельное печное топливо',
            'Печное дизельное топливо',
            'Утилизация отходов',
            'Утилизация медицинских отходов',
            'Обезвреживание медицинских отходов',
            'Утилизация отработанных масел',
            'Утилизация промышленных отходов'
        ],
        sameAs: [COMPANY.yandexMaps, COMPANY.gisMaps]
    };
}

function geoHeadHtml() {
    return [
        '    <meta name="author" content="' + COMPANY.name + '">',
        '    <meta name="geo.region" content="RU-MOS">',
        '    <meta name="geo.placename" content="Старая Купавна, Московская область">',
        '    <meta name="geo.position" content="' + COMPANY.lat + ';' + COMPANY.lng + '">',
        '    <meta name="ICBM" content="' + COMPANY.lat + ', ' + COMPANY.lng + '">',
        '    <link rel="alternate" type="text/plain" title="llms.txt" href="' + COMPANY.site + '/llms.txt">',
        '    <link rel="alternate" type="text/plain" title="llms-full.txt" href="' + COMPANY.site + '/llms-full.txt">'
    ].join('\n');
}

function localBusinessScript() {
    return '    <script type="application/ld+json">' + JSON.stringify(localBusinessSchema()) + '</script>';
}

module.exports = {
    COMPANY,
    AREA_CITIES,
    areaServedSchema,
    localBusinessSchema,
    geoHeadHtml,
    localBusinessScript
};
