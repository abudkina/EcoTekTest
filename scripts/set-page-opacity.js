const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'static', 'css', 'styles.css');
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('--page-surface')) {
    s = '/* Page surface opacity 70% */\n:root {\n    --page-surface: rgba(255, 255, 255, 0.7);\n}\n\n' + s;
}

s = s.replace(/rgba\(255,\s*255,\s*255,\s*0\.(?:95|92|9|88|85|8|75)\)/g, 'rgba(255, 255, 255, 0.7)');
s = s.replace(/rgba\(241,\s*248,\s*233,\s*0\.(?:6|95|9|8)\)/g, 'rgba(241, 248, 233, 0.7)');
s = s.replace(/rgba\(232,\s*245,\s*233,\s*0\.(?:95|9|8)\)/g, 'rgba(232, 245, 233, 0.7)');

s = s.replace(
    /\.product-page \{\n    padding-bottom: 60px;\n\}/,
    '.product-page {\n    padding-bottom: 60px;\n    background: var(--page-surface);\n}'
);

fs.writeFileSync(file, s);
const count = (s.match(/rgba\(255, 255, 255, 0\.7\)/g) || []).length;
console.log('page-surface vars and rgba(255,255,255,0.7) count:', count);
