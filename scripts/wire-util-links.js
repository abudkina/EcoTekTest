const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'public/static/js/products-data.js'), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(code, ctx);

function trunc(t, m) {
    t = String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return t.length > m ? t.slice(0, m) + '…' : t;
}

const list = ctx.window.ecotekCatalogProducts.filter(function (p) {
    return p.category === 'utilization' && p.slug;
});

const cards = list.map(function (p) {
    const img = '/' + String(p.image).replace(/^\//, '');
    return [
        '                <a class="util-catalog-card" href="/utilizaciya/' + p.slug + '/">',
        '                    <img src="' + img + '" alt="' + p.name.replace(/"/g, '&quot;') + '" loading="lazy" width="320" height="160">',
        '                    <div class="util-catalog-card__body">',
        '                        <h3>' + p.name.replace(/</g, '&lt;') + '</h3>',
        '                        <p>' + trunc(p.shortDescription || p.fullDescription, 110) + '</p>',
        '                        <span class="util-catalog-card__more">Подробнее →</span>',
        '                    </div>',
        '                </a>'
    ].join('\n');
}).join('\n');

const utilPath = path.join(root, 'public/utilizaciya/index.html');
let html = fs.readFileSync(utilPath, 'utf8');

html = html.replace(
    /<div class="util-catalog-grid" id="util-catalog-grid"><\/div>/,
    '<div class="util-catalog-grid" id="util-catalog-grid">\n' + cards + '\n            </div>'
);

// Remove JS that filled the grid dynamically
html = html.replace(
    /<script src="\/static\/js\/products-data\.js"><\/script>\s*<script>\([\s\S]*?\)\(\);\s*<\/script>\s*/,
    ''
);

// Make top 3 service cards fully clickable
html = html.replace(
    /<article class="service-item">\s*<h3>Медицинские отходы[\s\S]*?<\/article>/,
    `<a class="service-item service-item--link" href="/utilizaciya/medicinskie-othody/">
                    <h3>Медицинские отходы (классы Б, В, Г)</h3>
                    <ul>
                        <li>Отходы лечебно-профилактических учреждений</li>
                        <li>Инфекционные и эпидемиологически опасные отходы</li>
                        <li>Проколы, шприцы, перевязочные материалы и др.</li>
                    </ul>
                    <span class="service-item__more">Подробнее →</span>
                </a>`
);

html = html.replace(
    /<article class="service-item">\s*<h3>Промышленные отходы[\s\S]*?<\/article>/,
    `<a class="service-item service-item--link" href="/utilizaciya/promyshlennye-othody/">
                    <h3>Промышленные отходы</h3>
                    <ul>
                        <li>Производственные и технологические отходы</li>
                        <li>Шламы, загрязнённые грунты и сорбенты</li>
                        <li>Отходы с содержанием нефтепродуктов</li>
                    </ul>
                    <span class="service-item__more">Подробнее →</span>
                </a>`
);

html = html.replace(
    /<article class="service-item">\s*<h3>Отработанные масла и ЛКМ[\s\S]*?<\/article>/,
    `<a class="service-item service-item--link" href="/utilizaciya/otrabotannye-masla/">
                    <h3>Отработанные масла и ЛКМ</h3>
                    <ul>
                        <li>Отработанные масла и смазки</li>
                        <li>Лакокрасочные материалы и растворители</li>
                        <li>Загрязнённая тара, фильтры, спецодежда</li>
                    </ul>
                    <span class="service-item__more">Подробнее →</span>
                </a>`
);

fs.writeFileSync(utilPath, html);
console.log('Updated utilizaciya with', list.length, 'static cards');
