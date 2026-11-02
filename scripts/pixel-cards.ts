// Draws the profile's link cards as pixel art to match the git-dragon banner:
// obsidian rock, orange ember accents, a 3x5 pixel font, and the same 3x pixel
// scale as the dragon (200x24 logical pixels -> 600x72). Logos are kept as their
// original vectors, set into pixel-framed tiles.
//
// Run: node scripts/pixel-cards.ts   (Node 23.6+; writes assets/*-pixel.svg)

import { writeFileSync } from 'node:fs';

type RGB = [number, number, number];

const W = 200;
const H = 24;
const SCALE = 3;

const OUTLINE: RGB = [4, 3, 6];
const ROCK: RGB[] = [[9, 7, 11], [13, 11, 16], [18, 15, 21], [24, 20, 27], [31, 25, 33]];
const EMBER: RGB[] = [[96, 38, 12], [168, 70, 20], [242, 132, 42], [255, 204, 120]];
const TILE: RGB = [7, 6, 9];
const TEXT: RGB = [246, 234, 214];
const MUTED: RGB = [156, 138, 130];
const ACCENT: RGB = [242, 132, 42];

interface Card {
  file: string;
  title: string;
  subtitle: string;
  url: string;
  label: string;
  seed: number;
  /** Original logo markup in a 48x48 box. */
  logo: string;
}

const CARDS: Card[] = [
  {
    file: 'site',
    title: 'Website',
    subtitle: 'Projects, background, contact',
    url: 'jakekang.dev',
    label: 'Website: jakekang.dev',
    seed: 11,
    logo: '<g transform="scale(0.75)"><rect width="64" height="64" rx="12" fill="#000"/><rect x="0.75" y="0.75" width="62.5" height="62.5" rx="11.25" fill="none" stroke="#2e2e2e" stroke-width="1.5"/><path fill="#fff" d="M28 16H32V48H18V36H22V44H28ZM41.12 16H46L32 36V29.02ZM37.6 28L46 48H41.66L34.89 31.87Z"/></g>',
  },
  {
    file: 'lectern',
    title: 'Lectern',
    subtitle: 'Custom software for small businesses',
    url: 'lectern.systems',
    label: 'Lectern: lectern.systems',
    seed: 23,
    logo: '<rect x="0.75" y="0.75" width="46.5" height="46.5" rx="9.25" fill="#0b0b0a" stroke="#2e2e2e" stroke-width="1.5"/><g transform="translate(4 4) scale(0.4)" fill="#7dd1c0"><path d="M25 23 L57 16 L57 29 L25 36 Z"/><path d="M43 30.5 L57 27.5 L57 78.5 L43 81.5 Z"/><path d="M43 69 L75 62 L75 75 L43 82 Z"/></g>',
  },
  {
    file: 'hearth',
    title: 'Hearth',
    subtitle: 'Open-source engine for making games by chat',
    url: 'hearthengine.com',
    label: 'Hearth: hearthengine.com',
    seed: 37,
    logo: '<rect width="48" height="48" rx="10" fill="#0b0b0a"/><rect x="0.75" y="0.75" width="46.5" height="46.5" rx="9.25" fill="none" stroke="#2e2e2e" stroke-width="1.5"/><path fill="#f76b15" fill-rule="evenodd" transform="translate(4.8 4.8) scale(0.8)" d="M10 26 A14 14 0 0 1 38 26 L38 39 A3 3 0 0 1 35 42 L13 42 A3 3 0 0 1 10 39 Z M23.9 38.6 C 19.8 38.6, 16.8 35.7, 16.8 31.8 C 16.8 26.9, 21.4 24.9, 24.4 16.0 C 27.5 19.7, 31.1 24.7, 31.1 30.1 C 31.1 35.2, 27.9 38.6, 23.9 38.6 Z"/>',
  },
  {
    file: 'linkedin',
    title: 'LinkedIn',
    subtitle: 'Work history',
    url: 'in/jakekangdev',
    label: 'LinkedIn: in/jakekangdev',
    seed: 41,
    logo: '<rect width="48" height="48" rx="10" fill="#0A66C2"/><g transform="translate(12 12)" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 4.455v5.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></g>',
  },
];

// ---------------------------------------------------------------------------
// The same 3x5 font the dragon's caption uses, plus an arrow.

const GLYPHS: Record<string, string> = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
  I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
  M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
  Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
  Y: '101101010010010', Z: '111001010100111',
  '.': '000000000000010', ',': '000000000010100', '-': '000000111000000', '/': '001001010100100',
  '↗': '000111011101000', ' ': '000000000000000',
};
const textWidth = (text: string) => text.length * 4 - 1;

// ---------------------------------------------------------------------------

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

function drawCard(card: Card): string {
  const pixels: (RGB | null)[] = new Array(W * H).fill(null);
  const set = (x: number, y: number, color: RGB) => {
    if (x >= 0 && y >= 0 && x < W && y < H) pixels[y * W + x] = color;
  };
  const random = seeded(card.seed);

  // Obsidian rock: slanted strata, dithered, warmer toward the bottom.
  const tilt = 0.12 + random() * 0.1;
  const phase = random() * 10;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const strata = Math.sin((y + x * tilt) * 0.55 + phase) * 0.5 + Math.sin((y - x * tilt * 0.6) * 1.3 + phase * 2) * 0.25;
      const level = 1.6 + strata + (bayer(x, y) - 0.5) * 1.1;
      set(x, y, ROCK[Math.max(0, Math.min(ROCK.length - 1, Math.floor(level)))]);
    }
  }
  // Heat rising from below: an ember glow dithered up from the bottom edge.
  for (let y = H - 6; y < H - 1; y += 1) {
    const heat = (y - (H - 6)) / 5;
    for (let x = 0; x < W; x += 1) if (bayer(x, y) < heat * 0.55) set(x, y, heat > 0.7 && bayer(x, y) < 0.18 ? EMBER[1] : EMBER[0]);
  }
  // Lava cracks seeping up from the bottom edge, below the text.
  const flickers: [number, number][] = [];
  const clear = 24 + textWidth(card.subtitle) + 3;
  for (let crack = 0; crack < 3; crack += 1) {
    let x = Math.floor(8 + random() * (W - 16));
    let y = H - 3;
    for (let step = 0; step < 4; step += 1) {
      if (y < 19 && x < clear) break;
      set(x, y, step === 0 ? EMBER[2] : EMBER[1]);
      if (step === 1) flickers.push([x, y]);
      y -= 1;
      x += random() < 0.5 ? -1 : 1;
    }
  }

  // Frame: outline with notched corners, orange inner edge, hotter along the bottom.
  for (let x = 0; x < W; x += 1) {
    set(x, 0, OUTLINE);
    set(x, H - 1, OUTLINE);
    set(x, 1, x % 2 === 0 ? EMBER[0] : ROCK[4]);
    set(x, H - 2, bayer(x, 3) < 0.5 ? EMBER[1] : EMBER[0]);
  }
  for (let y = 0; y < H; y += 1) {
    set(0, y, OUTLINE);
    set(W - 1, y, OUTLINE);
    if (y > 0 && y < H - 1) {
      set(1, y, y % 2 === 0 ? EMBER[0] : ROCK[4]);
      set(W - 2, y, y % 2 === 0 ? EMBER[0] : ROCK[3]);
    }
  }
  for (const [cx, cy] of [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]]) pixels[cy * W + cx] = null;
  for (const [cx, cy] of [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]]) set(cx, cy, OUTLINE);

  // Logo tile, 16x16 with a bevel.
  const tx = 4;
  const ty = 4;
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      const edge = x === 0 || y === 0 || x === 15 || y === 15;
      const lit = x === 1 || y === 1;
      const shade = x === 14 || y === 14;
      set(tx + x, ty + y, edge ? OUTLINE : lit ? EMBER[1] : shade ? EMBER[0] : TILE);
    }
  }
  for (const [cx, cy] of [[0, 0], [15, 0], [0, 15], [15, 15]]) set(tx + cx, ty + cy, ROCK[1]);

  // Text: title and arrowed URL on the first line, the tagline below.
  const text = (value: string, x: number, y: number, color: RGB) => {
    let cursor = x;
    for (const char of value.toUpperCase()) {
      const glyph = GLYPHS[char] ?? GLYPHS[' '];
      for (let i = 0; i < 15; i += 1) if (glyph[i] === '1') set(cursor + (i % 3) + 1, y + Math.floor(i / 3) + 1, OUTLINE);
      for (let i = 0; i < 15; i += 1) if (glyph[i] === '1') set(cursor + (i % 3), y + Math.floor(i / 3), color);
      cursor += 4;
    }
  };
  text(card.title, 24, 5, TEXT);
  const url = `${card.url} ↗`;
  text(url, W - 5 - textWidth(url), 5, ACCENT);
  text(card.subtitle, 24, 13, MUTED);

  // Paint: one path per color, horizontal runs merged.
  const runs = new Map<string, string[]>();
  for (let y = 0; y < H; y += 1) {
    let x = 0;
    while (x < W) {
      const color = pixels[y * W + x];
      if (!color) {
        x += 1;
        continue;
      }
      let end = x + 1;
      const key = hex(color);
      while (end < W && pixels[y * W + end] && hex(pixels[y * W + end]!) === key) end += 1;
      if (!runs.has(key)) runs.set(key, []);
      runs.get(key)!.push(`M${x} ${y}h${end - x}v1h${x - end}z`);
      x = end;
    }
  }
  const paths = [...runs.entries()].map(([color, d]) => `<path fill="${color}" d="${d.join('')}"/>`).join('');
  const embers = flickers
    .slice(0, 6)
    .map(([x, y], i) => `<rect class="e e${i % 3}" x="${x}" y="${y}" width="1" height="1" fill="${hex(EMBER[3])}"/>`)
    .join('');
  const logoScale = 12 / 48;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${card.label}">`,
    `<title>${card.label}</title>`,
    '<style>.e{animation:f 2.4s steps(1) infinite}.e1{animation-delay:-.8s}.e2{animation-delay:-1.6s}@keyframes f{0%{opacity:1}33%{opacity:.35}66%{opacity:0}}</style>',
    `<g shape-rendering="crispEdges">${paths}${embers}</g>`,
    `<g transform="translate(${tx + 2} ${ty + 2}) scale(${logoScale})">${card.logo}</g>`,
    '</svg>',
  ].join('');
}

const hex = ([r, g, b]: RGB) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

for (const card of CARDS) {
  const path = new URL(`../assets/${card.file}-pixel.svg`, import.meta.url);
  writeFileSync(path, `${drawCard(card)}\n`);
  console.log(`wrote assets/${card.file}-pixel.svg`);
}
