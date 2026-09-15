const fs = require('fs');
const path = require('path');

const repo = process.env.GITHUB_REPOSITORY || 'abudkina/EcoTekTest';
const repoName = repo.split('/')[1];
const prefix = '/' + repoName;
const srcDir = path.join(__dirname, '..', 'public');
const outDir = path.join(__dirname, '..', '_site');

// Only rewrite real site paths — never bare "/" in JS (regex flags, concat, etc.).
const PATH_ROOTS = [
    'static/',
    'toplivo/',
    'utilizaciya/',
    'docs/',
    'favicon',
    'sitemap',
    'catalog.html',
    'about.html',
    'contacts.html',
    'faq.html',
    'gallery.html',
    'licenses.html',
    'reviews.html',
    'index.html'
];

function rewrite(content) {
    let out = content
        .replace(/(\b(?:href|src|action|poster|data-src)=["'])\/(?!\/)/g, `$1${prefix}/`)
        .replace(/(fetch\(["'])\/(?!\/)/g, `$1${prefix}/`);

    for (const root of PATH_ROOTS) {
        const re = new RegExp(`(["'\`])\\/${root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
        out = out.replace(re, `$1${prefix}/${root}`);
    }

    // Home links: href="/" or href='/' (exact), not JS '/' concatenations
    out = out.replace(/(\bhref=["'])\/(["'])/g, `$1${prefix}/$2`);

    // Avoid double-prefix if something already had it
    out = out.split(prefix + prefix).join(prefix);
    return out;
}

function copyDir(dir) {
    for (const name of fs.readdirSync(dir)) {
        const src = path.join(dir, name);
        const rel = path.relative(srcDir, src);
        const dest = path.join(outDir, rel);
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            copyDir(src);
            continue;
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (/\.(html|js)$/i.test(name)) {
            fs.writeFileSync(dest, rewrite(fs.readFileSync(src, 'utf8')));
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}

if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });
copyDir(srcDir);
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('Prepared GitHub Pages site at', outDir, 'with base', prefix);
