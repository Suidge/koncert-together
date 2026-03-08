import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { loadDedupState, saveDedupState, isDuplicateUrl, markDownloaded } from "./image-dedup.mjs";

const root = process.cwd();
const dataDir = path.join(root, "data");
const publicDir = path.join(root, "public");
const registryPath = path.join(dataDir, "fanclub-image-sources.json");
const artistsPath = path.join(dataDir, "artists.json");

const execFileAsync = promisify(execFile);

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function writeJson(file, data) {
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function downloadFile(url, targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await execFileAsync("curl", [
    "-L",
    "--fail",
    "--retry", "5",
    "--retry-delay", "5",
    "--retry-all-errors",
    "-A", "KoncertTogetherBot/1.0 (local asset sync)",
    "-o", targetPath,
    url
  ]);
}

async function main() {
  let registry = [];
  try {
    registry = await readJson(registryPath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No fanclub-image-sources.json found. Skipping.");
      return;
    }
    throw err;
  }

  const artists = await readJson(artistsPath);
  const dedupState = await loadDedupState();

  const artistBySlug = new Map(artists.map((artist) => [artist.slug, artist]));
  let updatedCount = 0;

  for (const source of registry) {
    const artist = artistBySlug.get(source.artistSlug);
    if (!artist) {
      console.warn(`Unknown artist slug in fanclub image registry: ${source.artistSlug}`);
      continue;
    }

    const url = source.assetUrl;
    if (!url) continue;

    if (await isDuplicateUrl(dedupState, url)) {
      console.warn(`Skipping duplicate URL: ${url}`);
      continue;
    }

    try {
      const outputPath = path.join(publicDir, source.targetPath.replace(/^\//, ""));
      await downloadFile(url, outputPath);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      markDownloaded(dedupState, url, source.targetPath, source.imageType || "live");
      
      if (!artist.galleryImages) {
        artist.galleryImages = [];
      }
      
      artist.galleryImages.push({
        url: source.targetPath,
        imageType: source.imageType || "live",
        attribution: {
          provider: source.provider,
          creator: source.creator,
          license: source.license,
          sourceUrl: source.sourceUrl,
          sourceLabel: source.label
        }
      });
      updatedCount++;

    } catch (err) {
      console.error(`Failed to fetch and process ${url}:`, err.message);
    }
  }

  await writeJson(artistsPath, artists);
  await saveDedupState(dedupState);

  console.log(
    JSON.stringify(
      {
        task: "sync-fanclub-images",
        sourcedEventOrArtists: registry.length,
        updatedEntries: updatedCount
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
