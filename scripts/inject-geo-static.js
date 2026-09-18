const fs = require('fs');
const path = require('path');
const { geoHeadHtml, localBusinessScript } = require('./seo-geo-common');

const publicDir = path.join(__dirname, '..', 'public');
const files = [
    'index.html',
    'about.html',
    'contacts.html',
    'faq.html',
    'catalog.html',
    'gallery.html',
    'licenses.html',
    'reviews.html',
    'toplivo/index.html',
    'utilizaciya/index.html'
];

function scriptJson(block) {
    const m = String(block).match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (!m) return null;
    try {
        return JSON.parse(m[1]);
    } catch (e) {
        return null;
    }
}

function rootType(data) {
    if (!data) return '';
    const t = data['@type'];
    return Array.isArray(t) ? t[0] : t;
}

function insertGeo(html, geoHead) {
    if (!html.includes('name="geo.region"')) {
        if (/<link rel="sitemap"[^>]*>/.test(html)) {
            html = html.replace(/<link rel="sitemap"[^>]*>/, function (m) {
                return m + '\n' + geoHead;
            });
        } else if (/<link rel="canonical"[^>]*>/.test(html)) {
            html = html.replace(/<link rel="canonical"[^>]*>/, function (m) {
                return m + '\n' + geoHead;
            });
        } else {
            html = html.replace('</head>', geoHead + '\n</head>');
        }
    }
    if (!html.includes('llms-full.txt') && html.includes('llms.txt')) {
        html = html.replace(
            /<link rel="alternate" type="text\/plain" title="llms\.txt"[^>]*>/,
            '$&\n    <link rel="alternate" type="text/plain" title="llms-full.txt" href="https://ecotek-as.ru/llms-full.txt">'
        );
    }
    return html;
}

function upsertLocalBusiness(html, lbScript) {
    const canonical = scriptJson(lbScript);
    const canonicalDump = JSON.stringify(canonical);
    let replaced = false;
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, function (block) {
        const data = scriptJson(block);
        const t = rootType(data);
        if ((t === 'LocalBusiness' || t === 'WasteManagement') && !replaced) {
            replaced = true;
            if (JSON.stringify(data) === canonicalDump) return block;
            return lbScript;
        }
        return block;
    });
    if (!replaced) {
        html = html.replace('</head>', lbScript + '\n</head>');
    }
    return html;
}

function run() {
    const geoHead = geoHeadHtml();
    const lbScript = localBusinessScript();
    let n = 0;
    for (const rel of files) {
        const file = path.join(publicDir, rel);
        let html = fs.readFileSync(file, 'utf8');
        const before = html;
        html = insertGeo(html, geoHead);
        html = upsertLocalBusiness(html, lbScript);
        if (html !== before) {
            fs.writeFileSync(file, html, 'utf8');
            n++;
            console.log('Patched', rel);
        }
    }
    console.log('Geo/LocalBusiness injected into', n, 'static pages');
    return n;
}

if (require.main === module) run();

module.exports = { run };
