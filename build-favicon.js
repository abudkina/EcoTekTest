const sharp = require("sharp");
const pngToIco = require("png-to-ico");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "public/static/images/Screenshot_1-Photoroom.png");
const OUT = path.join(__dirname, "public/favicon.ico");
const BLACK_THRESHOLD = 45;

async function makeBlackTransparent(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0;
    }
  }
  return sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();
}

async function main() {
  const transparent = await makeBlackTransparent(SRC);
  const [buf32, buf16] = await Promise.all([
    sharp(transparent).resize(32, 32).png().toBuffer(),
    sharp(transparent).resize(16, 16).png().toBuffer(),
  ]);
  const ico = await pngToIco([buf16, buf32]);
  fs.writeFileSync(OUT, ico);
  console.log("favicon.ico written");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
