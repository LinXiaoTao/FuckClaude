/**
 * Generates the site's visual assets (Claude palette + middle-finger mark):
 *   public/favicon.svg          – orange tile + white middle finger
 *   public/apple-touch-icon.png – 180×180, square (iOS applies its own mask)
 *   public/icon-192.png / icon-512.png – PWA/manifest icons
 *   public/og.png               – 1200×630 Open Graph card
 *
 * Run: node scripts/gen-assets.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const ORANGE = '#D97757'; // Claude terracotta
const CREAM = '#FAF9F5'; // ivory
const BONE = '#F0EEE6';
const SLATE = '#1F1E1D';
const MUTED = '#63615B';
const FAINT = '#8A887F';

/**
 * Stylized middle-finger hand (raised middle finger, folded knuckles, thumb),
 * drawn inside a 64×64 box. Kept as overlapping rounded rects so it stays
 * crisp at favicon sizes.
 */
function hand(color) {
  return `<g fill="${color}">
    <rect x="26.9" y="8" width="7.6" height="29" rx="3.8"/>
    <rect x="18.9" y="24.5" width="6.4" height="11" rx="3.2"/>
    <rect x="36.1" y="24.5" width="6.4" height="11" rx="3.2"/>
    <rect x="16.9" y="30" width="27.6" height="24" rx="9"/>
    <rect x="40.6" y="32.5" width="7.6" height="16" rx="3.8" transform="rotate(-24 44.4 40.5)"/>
  </g>`;
}

function tileSvg(rx) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="${rx}" fill="${ORANGE}"/>
  ${hand(CREAM)}
</svg>`;
}

const OG_HAND_SCALE = 4.6;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <circle cx="280" cy="315" r="205" fill="${BONE}"/>
  <g transform="translate(${(280 - 32 * OG_HAND_SCALE).toFixed(1)} ${(315 - 32 * OG_HAND_SCALE).toFixed(1)}) scale(${OG_HAND_SCALE})">${hand(ORANGE)}</g>
  <text x="530" y="190" font-family="Helvetica, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="8" fill="${ORANGE}">FUCK CLAUDE</text>
  <text x="525" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="70" font-weight="700" fill="${SLATE}">Are you a Claude</text>
  <text x="525" y="370" font-family="Georgia, 'Times New Roman', serif" font-size="70" font-weight="700" font-style="italic" fill="${ORANGE}">“China user”?</text>
  <text x="530" y="442" font-family="Helvetica, Arial, sans-serif" font-size="25" fill="${MUTED}">Timezone · Language · Fonts · Locale</text>
  <text x="530" y="482" font-family="Helvetica, Arial, sans-serif" font-size="25" fill="${MUTED}">Checked 100% locally in your browser</text>
  <text x="530" y="556" font-family="Menlo, monospace" font-size="23" fill="${FAINT}">fuck-claude.vercel.app</text>
</svg>`;

const px = (svg, size) =>
  sharp(Buffer.from(svg), { density: 72 * (size / 64) }).resize(size, size);

await writeFile('public/favicon.svg', tileSvg(14) + '\n');
await px(tileSvg(0), 180).png().toFile('public/apple-touch-icon.png');
await px(tileSvg(14), 192).png().toFile('public/icon-192.png');
await px(tileSvg(14), 512).png().toFile('public/icon-512.png');
await sharp(Buffer.from(ogSvg)).png().toFile('public/og.png');

console.log('assets written to public/');
