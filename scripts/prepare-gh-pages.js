const fs = require('fs');
const path = require('path');

const repo = process.env.GITHUB_REPOSITORY || 'abudkina/EcoTekTest';
const prefix = '/' + repo.split('/')[1];
const srcDir = path.join(__dirname, '..', 'public');
const outDir = path.join(__dirname, '..', '_site');

function rewrite(content) {
    return content
        .replace(/href="\//g, 'href="' + prefix + '/')
        .replace(/src="\//g, 'src="' + prefix + '/')
        .replace(/fetch\('\//g, "fetch('" + prefix + '/')
        .replace(/fetch\("\//g, 'fetch("' + prefix + '/');
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
