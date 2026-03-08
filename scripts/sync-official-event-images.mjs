import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const root = process.cwd();
const dataDir = path.join(root, "data");
const publicDir = path.join(root, "public");
const registryPath = path.join(dataDir, "event-image-sources.json");
const eventsPath = path.join(dataDir, "events.json");
const execFileAsync = promisify(execFile);

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function writeJson(file, data) {
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "KoncertTogetherBot/1.0 (official event image sync)"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function downloadFile(url, targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await execFileAsync("curl", [
    "-L",
    "--fail",
    "--retry",
    "5",
    "--retry-delay",
    "5",
    "--retry-all-errors",
    "-A",
    "KoncertTogetherBot/1.0 (official event image sync)",
    "-o",
    targetPath,
    url
  ]);
}

function extractMetaImage(html) {
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) ||
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/i);

  if (!match?.[1]) {
    throw new Error("No og:image or twitter:image found");
  }

  return decodeHtml(match[1]);
}

function extractJypeLatestNotice(html, matchText = []) {
  const noticeMatch = html.match(/latestNotice\\":\{[\s\S]*?"title\\":\\"([^"]+)\\"[\s\S]*?"content\\":\\"([\s\S]*?)\\",\\"createdAt/i);
  if (!noticeMatch) {
    throw new Error("Latest notice payload not found");
  }

  const title = decodeHtml(noticeMatch[1]);
  const rawContent = noticeMatch[2];
  const content = decodeHtml(rawContent);
  const imageMatch =
    rawContent.match(/src=\\\\\\"([^"\\]+)\\\\\\"/i) ||
    rawContent.match(/src=\\\\"([^"\\]+)\\\\"/i) ||
    rawContent.match(/src=\\\"([^"\\]+)\\\"/i) ||
    content.match(/src="([^"]+)"/i);
  if (!imageMatch?.[1]) {
    throw new Error("No notice image found");
  }

  const haystack = `${title} ${content}`.toLowerCase();
  const allMatched = matchText.every((token) => haystack.includes(token.toLowerCase()));

  if (!allMatched) {
    throw new Error(`Latest notice did not match expected tokens: ${matchText.join(", ")}`);
  }

  return {
    url: decodeHtml(imageMatch[1]),
    title
  };
}

async function resolveSource(source) {
  if (source.type === "page_og_image") {
    const html = await fetchHtml(source.officialPageUrl);
    return { url: extractMetaImage(html), sourceLabel: source.label };
  }

  if (source.type === "jype_latest_notice_image") {
    const html = await fetchHtml(source.officialPageUrl);
    const resolved = extractJypeLatestNotice(html, source.matchText ?? []);
    return { url: resolved.url, sourceLabel: resolved.title };
  }

  if (source.type === "official_direct") {
    return { url: source.assetUrl, sourceLabel: source.label };
  }

  throw new Error(`Unsupported event image source type: ${source.type}`);
}

async function main() {
  const [registry, events] = await Promise.all([readJson(registryPath), readJson(eventsPath)]);
  const eventBySlug = new Map(events.map((event) => [event.slug, event]));

  for (const source of registry) {
    const event = eventBySlug.get(source.eventSlug);
    if (!event) {
      throw new Error(`Unknown event slug in event image registry: ${source.eventSlug}`);
    }

    const resolved = await resolveSource(source);
    const outputPath = path.join(publicDir, source.targetPath.replace(/^\//, ""));
    await downloadFile(resolved.url, outputPath);

    event.heroImage = source.targetPath;
    event.heroImageAttribution = {
      provider: source.provider,
      creator: source.creator,
      license: source.license,
      sourceUrl: source.officialPageUrl,
      sourceLabel: source.label ?? resolved.sourceLabel
    };
  }

  await writeJson(eventsPath, events);

  console.log(
    JSON.stringify(
      {
        task: "sync-official-event-images",
        updatedEvents: registry.length
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
