const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const headerPath = path.join(publicDir, 'static', 'partials', 'header.html');
const footerPath = path.join(publicDir, 'static', 'partials', 'footer.html');

function injectHtml(html) {
    const header = fs.readFileSync(headerPath, 'utf8').trim();
    const footer = fs.readFileSync(footerPath, 'utf8').trim();
    if (!/<div id="site-header">\s*<header/i.test(html)) {
        html = html.replace(
            /<div id="site-header">\s*<\/div>/,
            '<div id="site-header">\n' + header + '\n    </div>'
        );
    } else {
        html = html.replace(
            /<div id="site-header">[\s\S]*?<\/div>\s*(?=<main|<!-- Модалка|<!-- Временно)/,
            '<div id="site-header">\n' + header + '\n    </div>\n\n    '
        );
    }
    if (!/<div id="site-footer">\s*<footer/i.test(html)) {
        html = html.replace(
            /<div id="site-footer">\s*<\/div>/,
            '<div id="site-footer">\n' + footer + '\n    </div>'
        );
    } else {
        html = html.replace(
            /<div id="site-footer">[\s\S]*?<\/div>\s*(?=<script|<!-- Scripts)/,
            '<div id="site-footer">\n' + footer + '\n    </div>\n\n    '
        );
    }
    return html;
}

function injectFile(file) {
    const before = fs.readFileSync(file, 'utf8');
    if (!before.includes('id="site-header"') && !before.includes('id="site-footer"')) return false;
    const after = injectHtml(before);
    if (after !== before) {
        fs.writeFileSync(file, after, 'utf8');
        return true;
    }
    return false;
}

function walkPublic(dir) {
    dir = dir || publicDir;
    let count = 0;
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const rel = path.relative(publicDir, full).replace(/\\/g, '/');
        if (rel.startsWith('static/partials')) continue;
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            count += walkPublic(full);
            continue;
        }
        if (!name.endsWith('.html')) continue;
        if (injectFile(full)) count++;
    }
    return count;
}

if (require.main === module) {
    const n = walkPublic();
    console.log('Injected header/footer into', n, 'pages');
}

module.exports = { injectHtml, injectFile, walkPublic };
