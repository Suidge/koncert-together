import type { Metadata } from "next";
import { ArtistCard } from "@/components/artist-card";
import { Header } from "@/components/header";
import { getArtists, getEvents, getTourPlans } from "@/lib/events";
import { slugifyArtistName } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "艺人目录 | Koncert Together",
  description: "浏览当前站内追踪的 K-pop 艺人、成员档案和巡演雷达。"
};

export default async function ArtistsPage() {
  const [artists, events, plans] = await Promise.all([getArtists(), getEvents(), getTourPlans()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Artists</p>
        <h1>艺人主页与成员档案</h1>
        <p className="hero-text">
          这里不只是艺人名单。每个页面都尽量把成员 profile、官方入口、排期卡片和巡演雷达组织成可以直接浏览的艺人主页。
        </p>
      </section>
      <section className="artist-grid">
        {artists.map((artist) => (
          <ArtistCard
            artist={artist}
            eventCount={events.filter((event) => slugifyArtistName(event.artist) === artist.slug).length}
            key={artist.slug}
            planCount={plans.filter((plan) => plan.artistSlug === artist.slug).length}
          />
        ))}
      </section>
    </main>
  );
}
