import type { Metadata } from "next";
import { ArtistCard } from "@/components/artist-card";
import { Header } from "@/components/header";
import { getArtists, getEvents } from "@/lib/events";
import { slugifyArtistName } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "艺人目录 | Seoul Signal",
  description: "浏览 Seoul Signal 当前追踪的 K-pop 艺人和组合。"
};

export default async function ArtistsPage() {
  const [artists, events] = await Promise.all([getArtists(), getEvents()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Artists</p>
        <h1>艺人目录</h1>
        <p className="hero-text">
          这里是未来 fandom 平台的入口层。当前先聚焦巡演追踪，后续可以自然扩展到艺人内容、社区和收藏功能。
        </p>
      </section>
      <section className="artist-grid">
        {artists.map((artist) => (
          <ArtistCard
            artist={artist}
            eventCount={events.filter((event) => slugifyArtistName(event.artist) === artist.slug).length}
            key={artist.slug}
          />
        ))}
      </section>
    </main>
  );
}
