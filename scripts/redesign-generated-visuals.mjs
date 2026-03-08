import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");
const artistDir = path.join(root, "public", "media", "artists");
const eventDir = path.join(root, "public", "media", "events");

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function tint(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: Math.round(r + (255 - r) * amount),
    g: Math.round(g + (255 - g) * amount),
    b: Math.round(b + (255 - b) * amount)
  });
}

function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: Math.round(r * (1 - amount)),
    g: Math.round(g * (1 - amount)),
    b: Math.round(b * (1 - amount))
  });
}

async function readJson(name) {
  return JSON.parse(await fs.readFile(path.join(dataDir, name), "utf8"));
}

function escapeXml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(value = "", maxChars = 12, maxLines = 3) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) {
      break;
    }
  }

  if (current) {
    lines.push(current);
  }

  const remainder = words.slice(lines.join(" ").split(/\s+/).filter(Boolean).length).join(" ");
  if (remainder && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
  }

  return lines.slice(0, maxLines);
}

function renderLines(lines, x, y, size, lineHeight, extra = "") {
  return `<text x="${x}" y="${y}" fill="#FFF7EF" font-size="${size}" font-family="Georgia, serif" ${extra}>${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join("")}</text>`;
}

function artistSvg(artist) {
  const light = tint(artist.accent, 0.72);
  const mid = tint(artist.accent, 0.3);
  const dark = shade(artist.accent, 0.4);
  const glow = tint(artist.accent, 0.86);
  const nameLines = wrapText(artist.name, artist.name.length > 14 ? 10 : 12, 2);
  const nameSize = artist.name.length > 16 ? 108 : artist.name.length > 10 ? 126 : 144;
  const subtitle = [artist.nameKo, artist.fandom && `${artist.fandom} fan guide`, artist.agency].filter(Boolean).slice(0, 2).join("  •  ");
  const metaLine = [artist.memberCount ? `${artist.memberCount} members` : "", artist.debutYear ?? ""].filter(Boolean).join("  •  ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1500" viewBox="0 0 1200 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="80" y1="40" x2="1120" y2="1460" gradientUnits="userSpaceOnUse">
      <stop stop-color="${light}"/>
      <stop offset="0.55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="halo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(890 280) rotate(90) scale(360 360)">
      <stop stop-color="${glow}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="1500" rx="56" fill="url(#bg)"/>
  <rect x="56" y="56" width="1088" height="1388" rx="42" stroke="rgba(255,247,239,0.26)" stroke-width="2"/>
  <circle cx="890" cy="280" r="360" fill="url(#halo)"/>
  <circle cx="268" cy="268" r="198" fill="rgba(255,247,239,0.10)"/>
  <path d="M94 1152C234 980 402 874 612 874C786 874 954 944 1102 1098" stroke="rgba(255,247,239,0.18)" stroke-width="18" stroke-linecap="round"/>
  <path d="M132 1264C286 1128 452 1068 612 1068C760 1068 920 1116 1060 1232" stroke="rgba(255,247,239,0.12)" stroke-width="10" stroke-linecap="round"/>
  <text x="96" y="126" fill="#FFF7EF" font-size="24" font-family="Arial, sans-serif" letter-spacing="5">KONCERT TOGETHER</text>
  <text x="96" y="206" fill="#FFF7EF" font-size="22" font-family="Arial, sans-serif" opacity="0.86" letter-spacing="4">ARTIST FILE</text>
  <rect x="96" y="1134" width="1008" height="216" rx="34" fill="rgba(18,15,14,0.16)"/>
  ${renderLines(nameLines, 96, 990, nameSize, 132, 'font-weight="700"')}
  <text x="96" y="1226" fill="#FFF7EF" font-size="28" font-family="Arial, sans-serif" opacity="0.92">${escapeXml(subtitle)}</text>
  <text x="96" y="1284" fill="#FFF7EF" font-size="24" font-family="Arial, sans-serif" opacity="0.84">${escapeXml(metaLine)}</text>
  <text x="96" y="1328" fill="#FFF7EF" font-size="22" font-family="Arial, sans-serif" opacity="0.72">${escapeXml(artist.tagline ?? "K-pop artist guide")}</text>
</svg>`;
}

function eventSvg(event) {
  const accent = event.accent ?? "#7b665a";
  const light = tint(accent, 0.74);
  const mid = tint(accent, 0.28);
  const dark = shade(accent, 0.42);
  const month = new Intl.DateTimeFormat("en", { month: "short", timeZone: event.timezone }).format(new Date(event.startDate));
  const day = new Intl.DateTimeFormat("en", { day: "2-digit", timeZone: event.timezone }).format(new Date(event.startDate));
  const artistLines = wrapText(event.artist, event.artist.length > 14 ? 10 : 12, 2);
  const cityLines = wrapText(event.city, 12, 2);
  const venueLines = wrapText(event.venue, 24, 2);
  const sourceLine = event.tourName ?? event.source ?? "Official schedule";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1500" viewBox="0 0 1200 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="120" y1="60" x2="1080" y2="1440" gradientUnits="userSpaceOnUse">
      <stop stop-color="${light}"/>
      <stop offset="0.58" stop-color="${mid}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" rx="56" fill="url(#bg)"/>
  <rect x="66" y="70" width="1068" height="1360" rx="42" stroke="rgba(255,247,239,0.22)" stroke-width="2"/>
  <circle cx="952" cy="246" r="210" fill="rgba(255,247,239,0.15)"/>
  <rect x="94" y="102" width="152" height="186" rx="32" fill="rgba(18,15,14,0.18)"/>
  <text x="170" y="174" text-anchor="middle" fill="#FFF7EF" font-size="34" font-family="Arial, sans-serif" letter-spacing="4">${month.toUpperCase()}</text>
  <text x="170" y="246" text-anchor="middle" fill="#FFF7EF" font-size="82" font-family="Georgia, serif" font-weight="700">${day}</text>
  <text x="92" y="408" fill="#FFF7EF" font-size="28" font-family="Arial, sans-serif" letter-spacing="5">LIVE DATE</text>
  ${renderLines(artistLines, 92, 544, 110, 116, 'font-weight="700"')}
  ${renderLines(cityLines, 92, 732, 86, 92)}
  <text x="92" y="874" fill="#FFF7EF" font-size="28" font-family="Arial, sans-serif" opacity="0.92">${escapeXml(event.country)}</text>
  ${renderLines(venueLines, 92, 948, 34, 42, 'font-family="Arial, sans-serif"')}
  <text x="92" y="1028" fill="#FFF7EF" font-size="26" font-family="Arial, sans-serif" opacity="0.82">${escapeXml(sourceLine)}</text>
  <path d="M92 982H1108" stroke="rgba(255,247,239,0.22)" stroke-width="2"/>
  <text x="92" y="1112" fill="#FFF7EF" font-size="28" font-family="Arial, sans-serif">${escapeXml(event.tags.slice(0, 2).join("  •  "))}</text>
  <text x="92" y="1308" fill="#FFF7EF" font-size="26" font-family="Arial, sans-serif" opacity="0.84">Koncert Together</text>
</svg>`;
}

async function main() {
  const [artists, events] = await Promise.all([readJson("artists.json"), readJson("events.json")]);
  const artistMap = new Map(artists.map((artist) => [artist.slug, artist]));

  await fs.mkdir(artistDir, { recursive: true });
  await fs.mkdir(eventDir, { recursive: true });

  for (const artist of artists) {
    await fs.writeFile(path.join(artistDir, `${artist.slug}.svg`), artistSvg(artist));
  }

  for (const event of events) {
    const artist = artistMap.get(event.artistSlug) ?? artists.find((item) => item.name === event.artist);
    const enriched = {
      ...event,
      accent: artist?.accent ?? "#7b665a"
    };
    await fs.writeFile(path.join(eventDir, `${event.slug}.svg`), eventSvg(enriched));
  }

  console.log(JSON.stringify({ task: "redesign-generated-visuals", artists: artists.length, events: events.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
