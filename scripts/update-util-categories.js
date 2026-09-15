const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const productsPath = path.join(root, 'public', 'static', 'js', 'products-data.js');

function loadProducts() {
    const code = fs.readFileSync(productsPath, 'utf8');
    const ctx = { window: {} };
    vm.runInNewContext(code, ctx);
    return ctx.window.ecotekCatalogProducts;
}

function serialize(value, indent) {
    const sp = ' '.repeat(indent);
    if (Array.isArray(value)) {
        if (!value.length) return '[]';
        return '[\n' + value.map(function (v) {
            return sp + '    ' + serialize(v, indent + 4);
        }).join(',\n') + '\n' + sp + ']';
    }
    if (value && typeof value === 'object') {
        const entries = Object.entries(value);
        return '{\n' + entries.map(function (e) {
            return sp + '    ' + e[0] + ': ' + serialize(e[1], indent + 4);
        }).join(',\n') + '\n' + sp + '}';
    }
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return 'null';
}

function fkkoList(items) {
    return items.map(function (x) {
        return '• ' + x;
    }).join('\n');
}

const KEEP_SLUGS = new Set([
    'promyshlennye-othody',
    'lakokrasochnye-othody',
    'otrabotannye-masla',
    'medicinskie-othody',
    'grunt-nefteprodukty',
    'pesok',
    'specodezhda',
    'rezina',
    'shlam',
    'otrabotannye-filtry',
    'akkumuliatory',
    'polietilenovaya-upakovka',
    'pishchevye-othody'
]);

const UPDATES = {
    'promyshlennye-othody': {
        name: 'Утилизация промышленных отходов',
        image: 'static/images/6.png',
        fullDescription:
            'Основная категория: лицензированная утилизация промышленных отходов в Москве и МО. Принимаем виды отходов по ФККО из лицензии, оформляем договор и полный пакет документов.\n\n' +
            'Принимаем, в том числе:\n' +
            fkkoList([
                'упаковочные материалы из бумаги и картона, загрязненные хлоридами щелочных металлов — 4 05 911 01 60',
                'упаковочные материалы из бумаги и картона, загрязненные неметаллическими нерастворимыми/малорастворимыми минеральными продуктами — 4 05 911 31 60',
                'полиэтиленовую тару и упаковку с подтверждёнными загрязнениями (см. отдельную категорию)',
                'стеклянную тару, загрязненную серной кислотой (содержание серной кислоты не более 1,5%) — 4 51 811 05 51',
                'отходы грунта при проведении открытых земляных работ — 8 11 111 11 49',
                'грунт насыпной, загрязненный отходами строительных материалов — 8 11 115 31 40',
                'аккумуляторы свинцовые и корпуса аккумуляторов',
                'пищевые и жировые отходы (жироуловители, растительные масла, фритюр)',
                'другие промышленные отходы из лицензии'
            ]) +
            '\n\nУслуги: вывоз собственным транспортом / приём на площадке в Старой Купавне, утилизация и обезвреживание по лицензии, акты и отчётность.',
        shortDescription: 'Утилизация промышленных отходов по лицензии: упаковка, грунт, аккумуляторы, пищевые отходы и другие позиции ФККО. Москва и МО.'
    },
    'lakokrasochnye-othody': {
        name: 'Утилизация лакокрасочных отходов',
        image: 'static/images/9.jpg',
        fullDescription:
            'Утилизация лакокрасочных отходов и растворителей по лицензии. По растворителям в лицензии прямо указана утилизация.\n\n' +
            'Растворители и связанные отходы:\n' +
            fkkoList([
                'отходы растворителей на основе бензина, загрязненные лакокрасочными материалами — 4 14 121 21 32',
                'обтирочный материал, загрязненный лакокрасочными материалами, содержание ЛКМ 5% и более — 8 92 110 01 60',
                'обтирочный материал, загрязненный лакокрасочными материалами, содержание ЛКМ менее 5% — 8 92 110 02 60'
            ]) +
            '\n\nТакже принимаем связанные отходы растворителей нефтяного происхождения из лицензии (бензин, керосин, сольвент и др.). Вывоз, договор, акты.',
        shortDescription: 'Утилизация ЛКМ и растворителей по ФККО: бензиновые растворители с ЛКМ, обтирочный материал. Москва и МО.'
    },
    'otrabotannye-masla': {
        name: 'Утилизация отработанных минеральных масел',
        image: 'static/images/8.png',
        fullDescription:
            'Утилизация отработанных минеральных масел по лицензии (в том числе позиции, ранее относимые к «моторным» маслам). Приём на возмездной основе, вывоз от 1 т или приём на площадке.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'отходы минеральных масел компрессорных — 4 06 166 01 31',
                'смесь масел минеральных отработанных (трансмиссионных, осевых, обкаточных, цилиндровых) от термической обработки металлов — 4 06 320 01 31',
                'смесь минеральных масел отработанных с примесью синтетических масел — 4 06 325 11 31',
                'смесь масел минеральных отработанных, не содержащих галогены, пригодная для утилизации — 4 06 329 01 31',
                'отходы масел гидравлических, содержащих галогены — 4 72 302 01 31'
            ]) +
            '\n\nВажно: принимаем только виды масел, подтверждённые лицензией. Перед вывозом уточняем состав и код ФККО.',
        shortDescription: 'Утилизация отработанных минеральных масел по ФККО: компрессорные, смеси, гидравлические. Москва и МО.'
    },
    'medicinskie-othody': {
        name: 'Обезвреживание медицинских отходов',
        image: 'static/images/4.jpeg',
        fullDescription:
            'Полный цикл безопасного обращения с медицинскими отходами: вывоз и термическое обезвреживание в соответствии с требованиями Роспотребнадзора и СанПиН.\n\n' +
            'Работаем со всеми классами опасности:\n' +
            '• Класс Б (опасные): инфицированные материалы, органические отходы, инструментарий\n' +
            '• Класс В (чрезвычайно опасные): отходы из инфекционных отделений, лабораторий\n' +
            '• Класс Г (токсикологические): просроченные лекарства, дезинфектанты, химические препараты',
        shortDescription: 'Обезвреживание медицинских отходов классов Б, В, Г: вывоз, термическое обезвреживание, документы. Москва и МО.'
    },
    'grunt-nefteprodukty': {
        name: 'Утилизация загрязненного грунта и песка',
        image: 'static/images/17.jpg',
        fullDescription:
            'Утилизация загрязненного грунта и песка по позициям лицензии. В лицензии подтверждены отходы грунта и песок, загрязненный нефтью/нефтепродуктами.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'отходы грунта при проведении открытых земляных работ — 8 11 111 11 49',
                'грунт насыпной, загрязненный отходами строительных материалов — 8 11 115 31 40',
                'песок, загрязненный нефтью или нефтепродуктами, содержание 15% и более — 9 19 201 01 39',
                'песок, загрязненный нефтью или нефтепродуктами, содержание менее 15% — 9 19 201 02 39'
            ]) +
            '\n\nВывоз, обезвреживание/утилизация, полный пакет документов.',
        shortDescription: 'Утилизация загрязненного грунта и песка по ФККО: земляные работы, стройматериалы, песок с НП. Москва и МО.'
    },
    'pesok': {
        name: 'Утилизация загрязненного песка',
        image: 'static/images/18.jpg',
        fullDescription:
            'Утилизация загрязненного песка — подтверждённая категория лицензии.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'песок, загрязненный нефтью или нефтепродуктами, содержание 15% и более — 9 19 201 01 39',
                'песок, загрязненный нефтью или нефтепродуктами, содержание менее 15% — 9 19 201 02 39'
            ]) +
            '\n\nВывоз собственным транспортом, утилизация, акты и отчётность.',
        shortDescription: 'Утилизация песка, загрязненного нефтью/нефтепродуктами (ФККО 9 19 201 01 39 и 9 19 201 02 39). Москва и МО.'
    },
    'specodezhda': {
        name: 'Утилизация спецодежды и загрязненных СИЗ',
        image: 'static/images/20.jpg',
        fullDescription:
            'Утилизация спецодежды и загрязненных СИЗ. По лицензии прямо указана утилизация спецодежды, перчаток и канатных изделий.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'спецодежда из хлопчатобумажного и смешанных волокон, утратившая потребительские свойства, незагрязненная — 4 02 110 01 62',
                'спецодежда из натуральных, синтетических, искусственных и шерстяных волокон, загрязненная нефтепродуктами менее 15% — 4 02 312 01 62',
                'перчатки из натуральных волокон, загрязненные нефтепродуктами менее 15% — 4 02 312 03 60',
                'отходы веревочно-канатных изделий из натуральных, синтетических, искусственных и шерстяных волокон, загрязненных нефтепродуктами менее 15% — 4 02 312 12 60'
            ]) +
            '\n\nВывоз, безопасная утилизация, санитарные нормы, документы.',
        shortDescription: 'Утилизация спецодежды и СИЗ по ФККО: незагрязненная и загрязненная НП спецодежда, перчатки, канаты. Москва и МО.'
    },
    'rezina': {
        name: 'Утилизация шин и резиновых отходов',
        image: 'static/images/15.jpg',
        fullDescription:
            'Утилизация шин и резиновых отходов. По лицензии подтверждены автомобильные пневматические шины (не «любая резина»).\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'шины пневматические автомобильные отработанные — 9 21 110 01 50'
            ]) +
            '\n\nВывоз, экологически безопасная переработка, полный пакет документов.',
        shortDescription: 'Утилизация отработанных автомобильных пневматических шин (ФККО 9 21 110 01 50). Москва и МО.'
    },
    'shlam': {
        name: 'Утилизация промышленного шлама',
        image: 'static/images/22.jpg',
        fullDescription:
            'Утилизация промышленного шлама по лицензии. Подтверждён шлам сернокислотного электролита (утилизация и обезвреживание). Нефтешлам на основании этой лицензии не заявляем.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'шлам сернокислотного электролита — 9 20 110 04 39'
            ]) +
            '\n\nВывоз, утилизация и обезвреживание, документы для отчётности.',
        shortDescription: 'Утилизация шлама сернокислотного электролита (ФККО 9 20 110 04 39). Москва и МО.'
    },
    'otrabotannye-filtry': {
        name: 'Утилизация отработанных фильтров',
        image: 'static/images/21.jpg',
        fullDescription:
            'Утилизация отработанных фильтров по лицензии. Подтверждены угольные фильтры, загрязненные нефтепродуктами.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'угольные фильтры отработанные, загрязненные нефтепродуктами 15% и более — 4 43 101 01 52',
                'угольные фильтры отработанные, загрязненные нефтепродуктами менее 15% — 4 43 101 02 52'
            ]) +
            '\n\nВывоз, переработка, полный пакет документов.',
        shortDescription: 'Утилизация угольных фильтров, загрязненных нефтепродуктами (ФККО 4 43 101 01 52 и 4 43 101 02 52). Москва и МО.'
    }
};

const NEW_PRODUCTS = [
    {
        id: 19,
        name: 'Утилизация свинцовых аккумуляторов',
        slug: 'akkumuliatory',
        category: 'utilization',
        price: 'Договорная',
        image: 'static/images/19.jpg',
        pdfFile: 'docs/Выписка.pdf',
        fullDescription:
            'Утилизация свинцовых аккумуляторов. В лицензии прямо указаны утилизация и обезвреживание.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'аккумуляторы свинцовые отработанные неповрежденные, с электролитом — 9 20 110 01 53',
                'аккумуляторы свинцовые отработанные в сборе, без электролита — 9 20 110 02 52'
            ]) +
            '\n\nТакже по лицензии: корпус карболитовый аккумулятора свинцового с остатками свинцовой пасты и серной кислоты (суммарно не более 5%) — 9 20 112 11 51.\n\nВывоз, утилизация и обезвреживание, документы.',
        shortDescription: 'Утилизация свинцовых аккумуляторов с/без электролита по ФККО 9 20 110. Москва и МО.'
    },
    {
        id: 20,
        name: 'Утилизация загрязненной полиэтиленовой упаковки',
        slug: 'polietilenovaya-upakovka',
        category: 'utilization',
        price: 'Договорная',
        image: 'static/images/6.png',
        pdfFile: 'docs/Выписка.pdf',
        fullDescription:
            'Утилизация загрязненной полиэтиленовой тары и упаковки по лицензии.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'тара полиэтиленовая, загрязненная неорганическими нерастворимыми/малорастворимыми минеральными веществами — 4 38 112 01 51',
                'упаковка полиэтиленовая, загрязненная неорганическими хлоридами и/или сульфатами — 4 38 112 15 51',
                'тара полиэтиленовая, загрязненная гипохлоритами — 4 38 112 21 51',
                'упаковка полиэтиленовая, загрязненная минеральными удобрениями — 4 38 112 62 51'
            ]) +
            '\n\nВывоз, утилизация и обезвреживание, полный пакет документов.',
        shortDescription: 'Утилизация загрязненной полиэтиленовой тары и упаковки по ФККО 4 38 112. Москва и МО.'
    },
    {
        id: 21,
        name: 'Утилизация пищевых и жировых отходов',
        slug: 'pishchevye-othody',
        category: 'utilization',
        price: 'Договорная',
        image: 'static/images/10.jpg',
        pdfFile: 'docs/Выписка.pdf',
        fullDescription:
            'Утилизация пищевых и жировых отходов организаций общественного питания и смежных производств.\n\n' +
            'Принимаем:\n' +
            fkkoList([
                'отходы жиров при разгрузке жироуловителей — 7 36 101 01 39',
                'масла растительные отработанные при приготовлении пищи — 7 36 110 01 31',
                'отходы фритюра на основе растительного масла — 7 36 111 11 32'
            ]) +
            '\n\nВывоз, утилизация, документы для отчётности.',
        shortDescription: 'Утилизация жиров из жироуловителей, отработанных растительных масел и фритюра. Москва и МО.'
    }
];

const REDIRECTS = [
    ['motornoe-maslo', '/utilizaciya/otrabotannye-masla/'],
    ['maslyanye-filtry', '/utilizaciya/otrabotannye-filtry/'],
    ['transformatornoe-maslo', '/utilizaciya/otrabotannye-masla/'],
    ['dizelnoe-toplivo', '/utilizaciya/'],
    ['nefteprodukty', '/utilizaciya/'],
    ['voda-nefteprodukty', '/utilizaciya/']
];

function redirectHtml(to) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=${to}">
    <link rel="canonical" href="https://ecotek-as.ru${to}">
    <title>Перенаправление…</title>
    <script>location.replace(${JSON.stringify(to)});</script>
</head>
<body>
    <p>Страница перенесена. <a href="${to}">Перейти</a>.</p>
</body>
</html>
`;
}

function main() {
    const products = loadProducts();
    const nonUtil = products.filter(function (p) {
        return p.category !== 'utilization';
    });

    const bySlug = {};
    products.forEach(function (p) {
        if (p.category === 'utilization' && p.slug) bySlug[p.slug] = p;
    });

    // rename filters slug
    if (bySlug['maslyanye-filtry'] && !bySlug['otrabotannye-filtry']) {
        const f = Object.assign({}, bySlug['maslyanye-filtry']);
        f.slug = 'otrabotannye-filtry';
        bySlug['otrabotannye-filtry'] = f;
        delete bySlug['maslyanye-filtry'];
    }

    const utilOut = [];
    const order = [
        'promyshlennye-othody',
        'lakokrasochnye-othody',
        'otrabotannye-masla',
        'medicinskie-othody',
        'grunt-nefteprodukty',
        'pesok',
        'specodezhda',
        'rezina',
        'shlam',
        'otrabotannye-filtry',
        'akkumuliatory',
        'polietilenovaya-upakovka',
        'pishchevye-othody'
    ];

    order.forEach(function (slug) {
        let p = bySlug[slug];
        if (!p) {
            p = NEW_PRODUCTS.find(function (n) { return n.slug === slug; });
        }
        if (!p) throw new Error('Missing product: ' + slug);
        p = Object.assign({}, p);
        const upd = UPDATES[slug];
        if (upd) Object.assign(p, upd);
        if (slug === 'akkumuliatory' || slug === 'polietilenovaya-upakovka' || slug === 'pishchevye-othody') {
            const neu = NEW_PRODUCTS.find(function (n) { return n.slug === slug; });
            Object.assign(p, neu);
        }
        p.category = 'utilization';
        p.pdfFile = p.pdfFile || 'docs/Выписка.pdf';
        p.price = p.price || 'Договорная';
        utilOut.push(p);
    });

    // preserve ids where possible
    const idMap = {
        'promyshlennye-othody': 2,
        'lakokrasochnye-othody': 3,
        'otrabotannye-masla': 4,
        'medicinskie-othody': 5,
        'grunt-nefteprodukty': 8,
        'pesok': 11,
        'specodezhda': 12,
        'rezina': 9,
        'shlam': 13,
        'otrabotannye-filtry': 14,
        'akkumuliatory': 19,
        'polietilenovaya-upakovka': 20,
        'pishchevye-othody': 21
    };
    utilOut.forEach(function (p) {
        if (idMap[p.slug]) p.id = idMap[p.slug];
    });

    const next = nonUtil.concat(utilOut).sort(function (a, b) {
        return a.id - b.id;
    });

    const out = 'window.ecotekCatalogProducts = ' + serialize(next, 0) + ';\n';
    fs.writeFileSync(productsPath, out, 'utf8');
    console.log('Updated products-data.js, utilization:', utilOut.length);

    REDIRECTS.forEach(function (pair) {
        const dir = path.join(root, 'public', 'utilizaciya', pair[0]);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), redirectHtml(pair[1]), 'utf8');
        console.log('Redirect', pair[0], '->', pair[1]);
    });

    // sanity
    const missing = utilOut.filter(function (p) { return !KEEP_SLUGS.has(p.slug); });
    if (missing.length) console.warn('Unexpected slugs', missing.map(function (p) { return p.slug; }));
}

main();
