import Link from "next/link";
import { ArtistCard } from "@/components/artist-card";
import { CommunityCard } from "@/components/community-card";
import { EventCard } from "@/components/event-card";
import { GuideCard } from "@/components/guide-card";
import { Header } from "@/components/header";
import { getArtists, getEvents } from "@/lib/events";
import {
  type EventItem,
  communityPosts,
  guides,
  launchHighlights,
  slugifyArtistName,
  uniqueCountries
} from "@/lib/site-data";

export default async function HomePage() {
  const [events, artists] = await Promise.all([getEvents(), getArtists()]);
  const countries = uniqueCountries(events);
  const cities = new Set(events.map((event) => event.city));

  return (
    <main className="page-shell">
      <Header />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">K-pop Tours, Tickets, Fandom</p>
          <h1>给中文 K-pop fans 的全球巡演日历、场馆指南与 fandom 入口。</h1>
          <p className="hero-text">
            在一个站里看巡演时间、票务入口、场馆建议、选座思路和艺人入口，减少在不同语言和不同平台之间来回切换。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/calendar">
              进入巡演日历
            </Link>
            <Link className="secondary-button" href="/guides">
              先看指南
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">全球覆盖</p>
          <div className="hero-stats">
            <div>
              <strong>{events.length}</strong>
              <span>活动卡片</span>
            </div>
            <div>
              <strong>{artists.length}</strong>
              <span>艺人入口</span>
            </div>
            <div>
              <strong>{guides.length}</strong>
              <span>中文指南</span>
            </div>
          </div>
          <div className="hero-stats compact-stats">
            <div>
              <strong>{cities.size}</strong>
              <span>覆盖城市</span>
            </div>
            <div>
              <strong>{countries.length}</strong>
              <span>国家/地区</span>
            </div>
            <div>
              <strong>{communityPosts.length}</strong>
              <span>精选主题</span>
            </div>
          </div>
          <div className="artist-cloud">
            {artists.slice(0, 10).map((artist) => (
              <span key={artist.slug}>{artist.name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="pillar-grid">
        {launchHighlights.map((item) => (
          <article className="pillar-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Calendar</p>
          <h2>近期最值得先看的场次</h2>
        </div>
        <Link className="text-link" href="/calendar">
          查看全部活动
        </Link>
      </section>
      <section className="event-grid">
        {events.slice(0, 6).map((event: EventItem) => (
          <EventCard event={event} key={event.id} />
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Artists</p>
          <h2>从主流团体到 solo artist 的入口都先铺开</h2>
        </div>
        <Link className="text-link" href="/artists">
          查看艺人目录
        </Link>
      </section>
      <section className="artist-grid">
        {artists.slice(0, 8).map((artist) => (
          <ArtistCard
            artist={artist}
            eventCount={events.filter((event) => slugifyArtistName(event.artist) === artist.slug).length}
            key={artist.slug}
          />
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Guides</p>
          <h2>把中文用户真正会搜的观演问题讲清楚</h2>
        </div>
        <Link className="text-link" href="/guides">
          查看全部指南
        </Link>
      </section>
      <section className="content-grid">
        {guides.slice(0, 8).map((guide) => (
          <GuideCard guide={guide} key={guide.slug} />
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Community</p>
          <h2>从同行、应援到场馆经验，先看粉丝真正关心什么</h2>
        </div>
        <Link className="text-link" href="/community">
          进入社区页
        </Link>
      </section>
      <section className="content-grid">
        {communityPosts.map((post) => (
          <CommunityCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
