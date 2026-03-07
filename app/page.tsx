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
  slugifyArtistName
} from "@/lib/site-data";

export default async function HomePage() {
  const [events, artists] = await Promise.all([getEvents(), getArtists()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">K-pop Tours, Tickets, Fandom</p>
          <h1>给中文 K-pop fans 的全球巡演日历与 fandom 入口。</h1>
          <p className="hero-text">
            在一个站里看清巡演时间、购票入口、观演提示、艺人页和社区入口。
            目标不是做“资料展示页”，而是做真正能被反复打开的外部站点。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/calendar">
              进入巡演日历
            </Link>
            <Link className="secondary-button" href="/community">
              进入 fandom 社区
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">本周焦点</p>
          <div className="hero-stats">
            <div>
              <strong>{events.length}</strong>
              <span>已整理活动</span>
            </div>
            <div>
              <strong>{artists.length}</strong>
              <span>艺人主页</span>
            </div>
            <div>
              <strong>{guides.length}</strong>
              <span>中文指南</span>
            </div>
          </div>
          <div className="artist-cloud">
            {artists.slice(0, 6).map((artist) => (
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
          <h2>每个艺人页都应该像一个 fandom hub</h2>
        </div>
        <Link className="text-link" href="/artists">
          查看艺人目录
        </Link>
      </section>
      <section className="artist-grid">
        {artists.slice(0, 3).map((artist) => (
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
          <h2>中文用户真正需要的观演与购票说明</h2>
        </div>
        <Link className="text-link" href="/guides">
          查看全部指南
        </Link>
      </section>
      <section className="content-grid">
        {guides.map((guide) => (
          <GuideCard guide={guide} key={guide.slug} />
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Community</p>
          <h2>让 fandom 不只停留在“看信息”</h2>
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
