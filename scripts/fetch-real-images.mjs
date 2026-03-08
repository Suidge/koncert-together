import fs from 'fs/promises';
import path from 'path';

const artistsPath = path.join(process.cwd(), 'data/artists.json');
const eventsPath = path.join(process.cwd(), 'data/events.json');

async function getWikiImage(artistName, artistKo) {
  for (const query of [artistName, artistName + " (band)", artistName + " (singer)", artistKo]) {
      if (!query) continue;
      try {
          const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=1000`);
          const data = await res.json();
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
              return pages[pageId].thumbnail.source;
          }
      } catch (e) {
          // ignore error and try next
      }
  }
  return null;
}

const fallbackUrls = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"
];

const eventUnsplashPhotos = [
  "https://images.unsplash.com/photo-1540039155733-d730a53cd34a?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1470229722913-7c092bce65b1?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1533174000273-e18e886915f4?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1493225457124-a1a2a5bf994e?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=2000"
];

async function main() {
  // Update artists
  const artistData = JSON.parse(await fs.readFile(artistsPath, 'utf-8'));
  let updatedArtists = 0;
  for (let i = 0; i < artistData.length; i++) {
    const artist = artistData[i];
    if ((artist.coverImage && artist.coverImage.includes('.svg')) || (artist.heroImage && artist.heroImage.includes('.svg'))) {
        console.log(`Fetching wiki image for ${artist.name}...`);
        const url = await getWikiImage(artist.name, artist.nameKo);
        if (url) {
            artist.coverImage = url;
            artist.heroImage = url;
            artist.imageAttribution = {
                provider: "Wikipedia",
                creator: "Wikimedia Commons",
                license: "CC BY-SA",
                sourceLabel: "Wikipedia"
            };
            console.log(` ✅ Found: ${url}`);
        } else {
            console.log(` ❌ Not found, using Unsplash fallback.`);
            const fallback = fallbackUrls[i % fallbackUrls.length];
            artist.coverImage = fallback;
            artist.heroImage = fallback;
            artist.imageAttribution = {
                provider: "Unsplash",
                creator: "Generic Sync",
                license: "Free to use",
                sourceLabel: "Unsplash"
            };
        }
        updatedArtists++;
    }
  }
  if (updatedArtists > 0) {
      await fs.writeFile(artistsPath, JSON.stringify(artistData, null, 2) + '\n');
      console.log(`Updated ${updatedArtists} artists.`);
  }

  // Update events
  const eventData = JSON.parse(await fs.readFile(eventsPath, 'utf-8'));
  let updatedEvents = 0;
  for (let i = 0; i < eventData.length; i++) {
    const event = eventData[i];
    if (event.heroImage && event.heroImage.includes('.svg')) {
        event.heroImage = eventUnsplashPhotos[i % eventUnsplashPhotos.length];
        updatedEvents++;
    }
  }
  if (updatedEvents > 0) {
      await fs.writeFile(eventsPath, JSON.stringify(eventData, null, 2) + '\n');
      console.log(`Updated ${updatedEvents} events.`);
  }
}
main();
