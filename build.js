/**
 * KDN 바이브코딩 아카데미 빌드 스크립트
 * - HTML/CSS/JS를 dist/ 폴더로 복사
 * - CSS/JS 인라인 주석 제거 (경량화)
 * - 빌드 메타 정보 삽입
 */
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DIST = path.join(__dirname, 'dist');
const BUILD_TIME = new Date().toISOString();
const VERSION = require('./package.json').version;

const HTML_FILES = ['index.html', 'courses.html', 'playground.html'];
const ASSETS = ['style.css', 'script.js'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function stripComments(code, ext) {
  if (ext === '.css') {
    return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n').trim();
  }
  if (ext === '.js') {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  return code;
}

function injectMeta(html) {
  const meta = `  <!-- Build: ${BUILD_TIME} | Version: ${VERSION} -->`;
  return html.replace('<head>', `<head>\n${meta}`);
}

console.log('\n🔨 KDN 바이브코딩 아카데미 빌드 시작\n');
ensureDir(DIST);

// HTML 파일 처리
HTML_FILES.forEach(file => {
  const src = path.join(SRC, file);
  const dest = path.join(DIST, file);
  if (!fs.existsSync(src)) { console.warn(`  ⚠️  ${file} 없음, 건너뜀`); return; }
  let content = fs.readFileSync(src, 'utf8');
  content = injectMeta(content);
  fs.writeFileSync(dest, content);
  const size = (fs.statSync(dest).size / 1024).toFixed(1);
  console.log(`  ✅ ${file.padEnd(20)} ${size} KB`);
});

// CSS/JS 에셋 처리
ASSETS.forEach(file => {
  const src = path.join(SRC, file);
  const dest = path.join(DIST, file);
  if (!fs.existsSync(src)) { console.warn(`  ⚠️  ${file} 없음, 건너뜀`); return; }
  const ext = path.extname(file);
  const raw = fs.readFileSync(src, 'utf8');
  const processed = stripComments(raw, ext);
  fs.writeFileSync(dest, processed);
  const orig = (raw.length / 1024).toFixed(1);
  const min = (processed.length / 1024).toFixed(1);
  const saved = (((raw.length - processed.length) / raw.length) * 100).toFixed(0);
  console.log(`  ✅ ${file.padEnd(20)} ${orig} KB → ${min} KB (${saved}% 절감)`);
});

// 빌드 정보 파일 생성
const buildInfo = {
  name: 'KDN 바이브코딩 아카데미',
  version: VERSION,
  buildTime: BUILD_TIME,
  files: [...HTML_FILES, ...ASSETS],
};
fs.writeFileSync(path.join(DIST, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
console.log(`  ✅ build-info.json`);

console.log(`\n🚀 빌드 완료 → dist/`);
console.log(`   버전: v${VERSION}`);
console.log(`   시각: ${BUILD_TIME}\n`);
