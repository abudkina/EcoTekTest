const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIDEO_FOLDER = 'static/video';
const EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];

// Настройки сжатия (CRF 28 = хороший баланс качество/размер)
const FFMPEG_OPTIONS = {
  crf: '28',           // 18-28 рекомендуется, выше = меньше размер
  preset: 'medium',    // ultrafast, fast, medium, slow, veryslow
  audioBitrate: '128k'
};

async function runFFmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-vcodec', 'libx264',
      '-crf', FFMPEG_OPTIONS.crf,
      '-preset', FFMPEG_OPTIONS.preset,
      '-acodec', 'aac',
      '-b:a', FFMPEG_OPTIONS.audioBitrate,
      '-movflags', '+faststart',  // Быстрый старт для веб
      '-y',  // Перезаписывать без вопросов
      outputPath
    ];

    const ffmpeg = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });

    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg завершился с кодом ${code}\n${stderr}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(new Error(`Не удалось запустить FFmpeg: ${err.message}\nУбедитесь, что FFmpeg установлен: winget install ffmpeg`));
    });
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function compressVideos() {
  console.log('🎬 Начинаю сжатие видео...\n');

  if (!fs.existsSync(VIDEO_FOLDER)) {
    console.log(`⚠️  Папка не найдена: ${VIDEO_FOLDER}`);
    return;
  }

  const files = fs.readdirSync(VIDEO_FOLDER)
    .filter(file => EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .filter(file => !file.includes('_compressed'));

  if (files.length === 0) {
    console.log('📭 Видео файлы не найдены');
    return;
  }

  console.log(`📁 Найдено видео: ${files.length}\n`);

  let totalOriginal = 0;
  let totalCompressed = 0;
  let processed = 0;

  for (const file of files) {
    const inputPath = path.join(VIDEO_FOLDER, file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(VIDEO_FOLDER, `${baseName}_compressed.mp4`);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    console.log(`🔄 Сжимаю: ${file} (${formatBytes(originalSize)})`);

    try {
      const startTime = Date.now();
      await runFFmpeg(inputPath, outputPath);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      const compressedSize = fs.statSync(outputPath).size;
      totalCompressed += compressedSize;

      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(`   ✅ ${formatBytes(compressedSize)} (-${savings}%) за ${elapsed}s`);
      processed++;
    } catch (error) {
      console.error(`   ❌ Ошибка: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Результат:`);
  console.log(`   Обработано: ${processed}/${files.length} файлов`);
  console.log(`   До сжатия:  ${formatBytes(totalOriginal)}`);
  console.log(`   После:      ${formatBytes(totalCompressed)}`);
  console.log(`   Экономия:   ${formatBytes(totalOriginal - totalCompressed)} (${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('\n🎉 Сжатие завершено!');
  console.log('\n💡 Сжатые файлы имеют суффикс "_compressed"');
  console.log('   После проверки качества можно удалить оригиналы и переименовать файлы.');
}

compressVideos().catch(error => {
  console.error('Критическая ошибка:', error.message);
  process.exit(1);
});
