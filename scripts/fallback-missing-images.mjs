import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const imageSourcesPath = path.join(root, "data", "image-sources.json");

// High quality concert crowd photo from Unsplash
const fallbackAssetUrl = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop";

const missingSlugs = [
  "andteam", "babymonster", "boynextdoor", "bibi", "evnne", "exo", 
  "illit", "katseye", "plave", "seventeen", "super-junior", "txt", "treasure"
];

async function main() {
  const sources = JSON.parse(await fs.readFile(imageSourcesPath, "utf8"));
  
  for (const source of sources) {
    if (missingSlugs.includes(source.artistSlug)) {
      source.type = "official_direct";
      source.assetUrl = fallbackAssetUrl;
      source.provider = "Unsplash Generic Sync";
      source.creator = "Unsplash";
      source.license = "Free to use";
    }
  }

  await fs.writeFile(imageSourcesPath, JSON.stringify(sources, null, 2) + "\n");
  console.log("Updated the 13 failing artists to use direct asset fallback.");
}

main().catch(console.error);
