import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");
const artistsPath = path.join(dataDir, "artists.json");
const imageSourcesPath = path.join(dataDir, "image-sources.json");

async function fetchWikiImage(artistName) {
  // Try direct page search first since many K-pop group pages have straightforward names
  for (const suffix of ["", " (band)", " (group)", " (singer)"]) {
    const title = artistName + suffix;
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=1000`;
    
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "KoncertTogetherBot/1.0 (https://github.com/suidge/koncert-together)" }
      });
      const data = await res.json();
      const pages = data?.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        // Ensure the page exists and has an image
        if (!page.missing && page.pageimage && !page.pageimage.includes('Default') && !page.pageimage.includes('No_image')) {
          return page.pageimage;
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch wiki data for ${title}:`, e);
    }
  }

  // Backup search via search API
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(artistName + " kpop")}&utf8=&format=json`;
  try {
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "KoncertTogetherBot/1.0 (https://github.com/suidge/koncert-together)" }
    });
    const data = await res.json();
    if (data?.query?.search?.length > 0) {
      const bestMatch = data.query.search[0].title;
      const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(bestMatch)}&format=json&pithumbsize=1000`;
      const res2 = await fetch(url, {
        headers: { "User-Agent": "KoncertTogetherBot/1.0 (https://github.com/suidge/koncert-together)" }
      });
      const data2 = await res2.json();
      const pages = data2?.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        if (!page.missing && page.pageimage && !page.pageimage.match(/svg|default|no_image/i)) {
            return page.pageimage;
        }
      }
    }
  } catch (e) {
     console.warn(`Failed to search wiki for ${artistName}:`, e);
  }

  return null;
}

async function main() {
  const artists = JSON.parse(await fs.readFile(artistsPath, "utf8"));
  let imageSources = JSON.parse(await fs.readFile(imageSourcesPath, "utf8"));

  // First, set useForEvents to true for all existing image sources
  // to replace the SVG SVGs with real images.
  for (const source of imageSources) {
    source.useForEvents = true;
  }

  const existingSlugs = new Set(imageSources.map(s => s.artistSlug));

  let added = 0;
  for (const artist of artists) {
    if (existingSlugs.has(artist.slug)) {
      continue;
    }

    console.log(`Searching wiki for ${artist.name}...`);
    const pageImage = await fetchWikiImage(artist.name);
    
    if (pageImage) {
      console.log(`Found image: ${pageImage}`);
      imageSources.push({
        artistSlug: artist.slug,
        type: "commons_file",
        label: `${artist.name} wiki image`,
        targetPath: `/media/artists/${artist.slug}-wiki.jpg`,
        fileTitle: `File:${pageImage}`,
        provider: "Wikimedia Commons",
        useForEvents: true
      });
      existingSlugs.add(artist.slug);
      added++;
    } else {
      console.log(`No wiki image found for ${artist.name}`);
    }
    
    // Add brief delay to prevent rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  await fs.writeFile(imageSourcesPath, JSON.stringify(imageSources, null, 2) + "\n");
  console.log(`Done. Added ${added} new sources. Enabled useForEvents globally.`);
}

main().catch(console.error);
