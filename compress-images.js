const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const mode = args[0] || 'all'; // 'all', 'images', 'photos'

const folders = [];
if (mode === 'all' || mode === 'images') {
  folders.push('public/static/images');
}
if (mode === 'all' || mode === 'photos') {
  folders.push('public/static/photo');
}

async function compressImages() {
  console.log('🖼️  Начинаю сжатие изображений без потерь качества...\n');

  for (const folder of folders) {
    if (!fs.existsSync(folder)) {
      console.log(`⚠️  Папка не найдена: ${folder}`);
      continue;
    }

    console.log(`📁 Сжимаю изображения в: ${folder}`);
    const startTime = Date.now();

    try {
      const files = await imagemin([`${folder}/*.{jpg,jpeg,png,gif}`], {
        destination: folder,
        plugins: [
          imageminJpegtran({
            progressive: true,
            quality: 0.95
          }),
          imageminOptipng({
            optimizationLevel: 2
          }),
          imageminPngquant({
            quality: [0.92, 0.98],
            speed: 1
          })
        ]
      });

      const elapsed = Date.now() - startTime;
      console.log(`✅ Обработано файлов: ${files.length}`);
      console.log(`⏱️  Время обработки: ${(elapsed / 1000).toFixed(2)}s\n`);

      // Показываем статистику размеров
      let totalOriginal = 0;
      let totalCompressed = 0;

      files.forEach(file => {
        const stats = fs.statSync(file);
        totalCompressed += stats.size;
      });

      console.log(`📊 Результат в папке "${folder}":`);
      console.log(`   Размер сжатых файлов: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB\n`);

    } catch (error) {
      console.error(`❌ Ошибка при сжатии ${folder}:`, error.message);
    }
  }

  console.log('🎉 Сжатие завершено!');
}

compressImages().catch(error => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});
