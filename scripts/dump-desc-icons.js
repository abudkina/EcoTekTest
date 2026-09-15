const { formatDescription, iconForItem } = require('../public/static/js/desc-icons.js');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/static/js/products-data.js'), 'utf8'), ctx);
ctx.window.ecotekCatalogProducts.forEach(function (p) {
    const html = formatDescription(p.fullDescription);
    const items = [];
    const re = /desc-icon-text">([\s\S]*?)<\/span>/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        items.push(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
    console.log('\n=== ' + p.slug + ' ===');
    items.forEach(function (t) {
        console.log(iconForItem(t).padEnd(22) + t.slice(0, 100));
    });
});
