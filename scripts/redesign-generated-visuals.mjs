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

function renderLines(lines, x, y, size, lineHeight, options = {}) {
  const {
    fill = "#FFF7EF",
    fontFamily = "Georgia, serif",
    opacity,
    fontWeight,
    letterSpacing
  } = options;
  const attrs = [
    `x="${x}"`,
    `y="${y}"`,
    `fill="${fill}"`,
    `font-size="${size}"`,
    `font-family="${fontFamily}"`
  ];
  if (opacity !== undefined) attrs.push(`opacity="${opacity}"`);
  if (fontWeight !== undefined) attrs.push(`font-weight="${fontWeight}"`);
  if (letterSpacing !== undefined) attrs.push(`letter-spacing="${letterSpacing}"`);
  return `<text ${attrs.join(" ")}>${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join("")}</text>`;
}

function artistSvg(artist) {
  const light = tint(artist.accent, 0.72);
  const mid = tint(artist.accent, 0.3);
  const dark = shade(artist.accent, 0.4);
  const glow = tint(artist.accent, 0.86);
  const nameLines = wrapText(artist.name, artist.name.length > 14 ? 11 : 13, 2);
  const nameSize = artist.name.length > 16 ? 98 : artist.name.length > 10 ? 112 : 126;
  const subtitle = [artist.nameKo, artist.fandom ? `fan name ${artist.fandom}` : "", artist.agency].filter(Boolean).slice(0, 2).join("  •  ");
  const metaLine = [artist.memberCount ? `${artist.memberCount} members` : "", artist.debutYear ?? "", artist.origin ?? ""].filter(Boolean).join("  •  ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1500" viewBox="0 0 1200 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="80" y1="40" x2="1120" y2="1460" gradientUnits="userSpaceOnUse">
      <stop stop-color="${light}"/>
      <stop offset="0.55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="halo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(926 264) rotate(90) scale(420 420)">
      <stop stop-color="${glow}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="panel" x1="92" y1="918" x2="1098" y2="1364" gradientUnits="userSpaceOnUse">
      <stop stop-color="#131010" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#131010" stop-opacity="0.34"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" rx="56" fill="url(#bg)"/>
  <rect x="56" y="56" width="1088" height="1388" rx="42" stroke="#FFF7EF" stroke-opacity="0.22" stroke-width="2"/>
  <circle cx="926" cy="264" r="420" fill="url(#halo)"/>
  <path d="M168 288C304 132 526 88 742 154C924 210 1030 332 1090 474" stroke="#FFF7EF" stroke-opacity="0.12" stroke-width="22" stroke-linecap="round"/>
  <path d="M88 956C222 818 410 742 612 742C796 742 964 804 1108 930" stroke="#FFF7EF" stroke-opacity="0.16" stroke-width="14" stroke-linecap="round"/>
  <path d="M118 1046C290 942 444 900 622 900C808 900 954 944 1082 1032" stroke="#FFF7EF" stroke-opacity="0.12" stroke-width="8" stroke-linecap="round"/>
  <rect x="92" y="98" width="252" height="54" rx="27" fill="#FFF7EF" fill-opacity="0.12"/>
  <text x="218" y="132" text-anchor="middle" fill="#FFF7EF" font-size="21" font-family="Helvetica Neue, Arial, sans-serif" letter-spacing="3">KONCERT TOGETHER</text>
  <text x="98" y="224" fill="#FFF7EF" font-size="20" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.84" letter-spacing="6">ARTIST GUIDE</text>
  ${renderLines(nameLines, 96, 1044, nameSize, 122, { fontWeight: 700 })}
  <rect x="92" y="1128" width="1014" height="238" rx="34" fill="url(#panel)"/>
  <text x="128" y="1194" fill="#FFF7EF" font-size="24" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.92">${escapeXml(subtitle)}</text>
  <text x="128" y="1248" fill="#FFF7EF" font-size="22" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.8">${escapeXml(metaLine)}</text>
  <text x="128" y="1318" fill="#FFF7EF" font-size="48" font-family="Georgia, serif" opacity="0.94">${escapeXml(artist.tagline ?? "K-pop artist guide")}</text>
  <text x="128" y="1356" fill="#FFF7EF" font-size="20" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.7">tour notes • member profile • fandom entry</text>
</svg>`;
}

function eventSvg(event) {
  const accent = event.accent ?? "#7b665a";
  const light = tint(accent, 0.74);
  const mid = tint(accent, 0.28);
  const dark = shade(accent, 0.42);
  const soft = tint(accent, 0.88);
  const month = new Intl.DateTimeFormat("en", { month: "short", timeZone: event.timezone }).format(new Date(event.startDate));
  const day = new Intl.DateTimeFormat("en", { day: "2-digit", timeZone: event.timezone }).format(new Date(event.startDate));
  const artistLines = wrapText(event.artist, event.artist.length > 14 ? 11 : 13, 2);
  const cityLines = wrapText(event.city, 14, 2);
  const venueLines = wrapText(event.venue, 28, 2);
  const sourceLine = event.tourName ?? "Official schedule";
  const tagLine = event.tags.slice(0, 2).join("  •  ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1500" viewBox="0 0 1200 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="120" y1="60" x2="1080" y2="1440" gradientUnits="userSpaceOnUse">
      <stop stop-color="${light}"/>
      <stop offset="0.58" stop-color="${mid}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <linearGradient id="panel" x1="88" y1="956" x2="1110" y2="1368" gradientUnits="userSpaceOnUse">
      <stop stop-color="#141010" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#141010" stop-opacity="0.36"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" rx="56" fill="url(#bg)"/>
  <rect x="66" y="70" width="1068" height="1360" rx="42" stroke="#FFF7EF" stroke-opacity="0.22" stroke-width="2"/>
  <circle cx="962" cy="236" r="236" fill="#FFF7EF" fill-opacity="0.12"/>
  <path d="M184 154L1018 612" stroke="#FFF7EF" stroke-opacity="0.08" stroke-width="84" stroke-linecap="round"/>
  <path d="M86 854C254 738 458 688 660 712C854 734 1006 810 1112 902" stroke="#FFF7EF" stroke-opacity="0.14" stroke-width="16" stroke-linecap="round"/>
  <rect x="88" y="100" width="166" height="194" rx="34" fill="#141010" fill-opacity="0.18"/>
  <text x="171" y="174" text-anchor="middle" fill="#FFF7EF" font-size="30" font-family="Helvetica Neue, Arial, sans-serif" letter-spacing="4">${month.toUpperCase()}</text>
  <text x="171" y="248" text-anchor="middle" fill="#FFF7EF" font-size="86" font-family="Georgia, serif" font-weight="700">${day}</text>
  <rect x="92" y="344" width="238" height="52" rx="26" fill="#FFF7EF" fill-opacity="0.11"/>
  <text x="211" y="377" text-anchor="middle" fill="#FFF7EF" font-size="20" font-family="Helvetica Neue, Arial, sans-serif" letter-spacing="4">LIVE SCHEDULE</text>
  ${renderLines(artistLines, 92, 528, 108, 112, { fontWeight: 700 })}
  ${renderLines(cityLines, 92, 724, 84, 88)}
  <text x="94" y="830" fill="${soft}" font-size="30" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.96">${escapeXml(event.country)}</text>
  <rect x="88" y="968" width="1022" height="356" rx="36" fill="url(#panel)"/>
  <text x="126" y="1040" fill="#FFF7EF" font-size="18" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.7" letter-spacing="4">VENUE</text>
  ${renderLines(venueLines, 126, 1100, 42, 48, { fontFamily: "Helvetica Neue, Arial, sans-serif", fontWeight: 600 })}
  <text x="126" y="1188" fill="#FFF7EF" font-size="18" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.7" letter-spacing="4">TOUR</text>
  <text x="126" y="1234" fill="#FFF7EF" font-size="30" font-family="Georgia, serif" opacity="0.95">${escapeXml(sourceLine)}</text>
  <text x="126" y="1302" fill="#FFF7EF" font-size="22" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.78">${escapeXml(tagLine)}</text>
  <text x="126" y="1362" fill="#FFF7EF" font-size="20" font-family="Helvetica Neue, Arial, sans-serif" opacity="0.68">Koncert Together • concert note</text>
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
