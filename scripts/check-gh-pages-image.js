const { execSync } = require('child_process');
const b = execSync(
  'gh api "repos/abudkina/EcoTekTest/contents/static/js/products-data.js?ref=gh-pages" --jq .content',
  { encoding: 'utf8' }
).replace(/\n/g, '');
const t = Buffer.from(b, 'base64').toString('utf8');
const idx = t.indexOf('temnoe-pechnoe-toplivo');
console.log(t.slice(idx, idx + 200));
