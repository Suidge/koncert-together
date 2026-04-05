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
            artist.imageQuality = "commons";
            artist.imageAttribution = {
                provider: "Wikipedia",
                creator: "Wikimedia Commons",
                license: "CC BY-SA",
                sourceLabel: "Wikipedia"
            };
            console.log(` ✅ Found: ${url}`);
        } else {
            console.log(` ❌ Not found, keeping generated fallback.`);
            artist.coverImage = `/media/artists/${artist.slug}.svg`;
            artist.heroImage = `/media/artists/${artist.slug}.svg`;
            artist.imageQuality = "generated";
            delete artist.imageAttribution;
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
        event.heroImage = `/media/events/${event.slug}.svg`;
        event.heroImageQuality = "generated";
        updatedEvents++;
    }
  }
  if (updatedEvents > 0) {
      await fs.writeFile(eventsPath, JSON.stringify(eventData, null, 2) + '\n');
      console.log(`Updated ${updatedEvents} events.`);
  }
}
main();
