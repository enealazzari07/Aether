const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const BUILD_DIR = path.join(__dirname, '..', 'build');

// Stelle sicher, dass der Ordner "build" existiert
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Dein Aether-Logo als SVG
const svgBuffer = Buffer.from(`
<svg viewBox="0 0 120 120" width="256" height="256" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" fill="transparent" />
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF8A5B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF6B35;stop-opacity:1" />
        </linearGradient>
    </defs>
    <g transform="rotate(-18 60 60)">
        <circle cx="60" cy="60" r="28" fill="none" stroke="url(#logoGradient)" stroke-width="12" stroke-linecap="round" stroke-dasharray="142 40" />
        <circle cx="60" cy="60" r="16" fill="none" stroke="url(#logoGradient)" stroke-width="8" stroke-linecap="round" stroke-dasharray="78 26" opacity="0.55" transform="rotate(90 60 60)" />
    </g>
</svg>
`);

async function generateIcons() {
  try {
    console.log('🎨 Generiere hochauflösendes PNG-Icon...');
    const pngPath = path.join(BUILD_DIR, 'icon.png');
    
    await sharp(svgBuffer)
      .resize(256, 256)
      .png()
      .toFile(pngPath);

    console.log('🔄 Konvertiere PNG zu Windows favicon.ico...');
    const icoPath = path.join(BUILD_DIR, 'favicon.ico');
    
    const icoBuffer = await pngToIco(pngPath);
    fs.writeFileSync(icoPath, icoBuffer);
    
    console.log('✅ Erfolg! favicon.ico wurde im "build"-Ordner erstellt.');
  } catch (error) {
    console.error('❌ Fehler bei der Generierung:', error);
  }
}

generateIcons();