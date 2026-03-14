const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');
const sharp = require('sharp');

// Bigger mark (less empty padding) so the app icon reads well at small sizes.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8A5B" stop-opacity="1"/>
      <stop offset="100%" stop-color="#FF6B35" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <g transform="rotate(-18 60 60)">
    <circle cx="60" cy="60" r="44" fill="none" stroke="url(#g)" stroke-width="14" stroke-linecap="round" stroke-dasharray="210 66"/>
    <circle cx="60" cy="60" r="28" fill="none" stroke="url(#g)" stroke-width="10" stroke-linecap="round" stroke-dasharray="132 44" opacity="0.55" transform="rotate(90 60 60)"/>
  </g>
</svg>
`.trim();

async function main() {
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

  const source = sharp(Buffer.from(svg));

  // Keep a large PNG around for packaging and for future conversions.
  const pngPath = path.join(buildDir, 'icon.png');
  await source.clone().resize(1024, 1024).png().toFile(pngPath);

  // Generate multiple PNG sizes and combine into a multi-resolution ICO.
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const tmpDir = path.join(buildDir, '.tmp-icons');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const pngs = [];
  for (const s of sizes) {
    const p = path.join(tmpDir, `icon-${s}.png`);
    // Make sure the mark stays crisp at small sizes.
    await source.clone().resize(s, s).png().toFile(p);
    pngs.push(p);
  }

  const icoBuf = await pngToIco(pngs);
  const icoPath = path.join(buildDir, 'icon.ico');
  fs.writeFileSync(icoPath, icoBuf);

  // Use the same ICO for favicon to keep a single source of truth.
  const faviconPath = path.join(buildDir, 'favicon.ico');
  fs.writeFileSync(faviconPath, icoBuf);

  try {
    for (const p of pngs) fs.unlinkSync(p);
    fs.rmdirSync(tmpDir);
  } catch {
    // ignore tmp cleanup failures
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
