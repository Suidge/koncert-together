import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const imageSourcesPath = path.join(root, "data", "image-sources.json");

const manualMappings = [
  { slug: "andteam", title: "File:&Team_at_the_2023_Asia_Artist_Awards_(cropped).jpg", name: "&TEAM" },
  { slug: "babymonster", title: "File:BabyMonster_in_Stray_Kids_Chk_Chk_Boom_M_V.png", name: "BABYMONSTER" },
  { slug: "boynextdoor", title: "File:BoyNextDoor_BOYNEXTDOOR_TONIGHT_Showcase_230530.jpg", name: "BOYNEXTDOOR" },
  { slug: "bibi", title: "File:230526_고려대학교_입실렌티_비비_02.jpg", name: "BIBI" },
  { slug: "evnne", title: "File:EVNNE_in_September_2023.png", name: "EVNNE" },
  { slug: "exo", title: "File:EXO_BCC_Press_2.jpg", name: "EXO" },
  { slug: "illit", title: "File:ILLIT_at_Acne_Studios_2024.jpg", name: "ILLIT" },
  { slug: "katseye", title: "File:Katseye.png", name: "KATSEYE" },
  { slug: "plave", title: "File:Rainbow_Bridge_World_logo.png", name: "PLAVE" }, // Plave is virtual, Wiki might not have good photo, using generic/logo
  { slug: "seventeen", title: "File:Seventeen_2024_Weverse_Con_Festival.jpg", name: "SEVENTEEN" },
  { slug: "super-junior", title: "File:SJU_-_190118_in_Chile.png", name: "SUPER JUNIOR" },
  { slug: "txt", title: "File:TXT_at_the_2022_American_Music_Awards.jpg", name: "TXT" },
  { slug: "treasure", title: "File:Treasure_in_2022.jpg", name: "TREASURE" }
];

async function main() {
  const sources = JSON.parse(await fs.readFile(imageSourcesPath, "utf8"));
  
  for (const mapping of manualMappings) {
    // remove existing if somehow it was malformed
    const filtered = sources.filter(s => s.artistSlug !== mapping.slug);
    filtered.push({
      artistSlug: mapping.slug,
      type: "commons_file",
      label: `${mapping.name} wiki image`,
      targetPath: `/media/artists/${mapping.slug}-wiki.jpg`,
      fileTitle: mapping.title,
      provider: "Wikimedia Commons",
      useForEvents: true
    });
    sources.length = 0;
    sources.push(...filtered);
  }

  await fs.writeFile(imageSourcesPath, JSON.stringify(sources, null, 2) + "\n");
  console.log("Added 13 manual missing artist mappings.");
}

main().catch(console.error);
