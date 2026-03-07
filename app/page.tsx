import Link from "next/link";
import { ArtistCard } from "@/components/artist-card";
import { EventCard } from "@/components/event-card";
import { Header } from "@/components/header";
import { getArtists, getEvents } from "@/lib/events";
import {
  type EventItem,
  architectureTracks,
  featuredArtists,
  productPillars,
  slugifyArtistName
} from "@/lib/site-data";

export default async function HomePage() {
  const [events, artists] = await Promise.all([getEvents(), getArtists()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">K-pop Tour Intelligence for Chinese Fans</p>
          <h1>把全球 K-pop 巡演信息，整理成一个真正可用的中文站点。</h1>
          <p className="hero-text">
            第一阶段先解决信息分散、票务入口混乱、官宣时间线不一致的问题。
            第二阶段再往艺人主页、提醒订阅、饭圈内容和中文 fandom 社区继续扩展。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/calendar">
              查看巡演日历
            </Link>
            <a className="secondary-button" href="#architecture">
              看技术路线
            </a>
          </div>
        </div>
        <div className="hero-panel">
          <p className="panel-label">正在追踪</p>
          <div className="artist-cloud">
            {featuredArtists.map((artist) => (
              <span key={artist}>{artist}</span>
            ))}
          </div>
          <div className="hero-stats">
            <div>
              <strong>{events.length}</strong>
              <span>追踪活动</span>
            </div>
            <div>
              <strong>{artists.length}</strong>
              <span>艺人入口</span>
            </div>
            <div>
              <strong>CN</strong>
              <span>中文体验优先</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pillar-grid" id="vision">
        {productPillars.map((pillar) => (
          <article className="pillar-card" key={pillar.title}>
            <h2>{pillar.title}</h2>
            <p>{pillar.body}</p>
          </article>
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Launch Scope</p>
          <h2>首页先展示有价值的最小闭环</h2>
        </div>
        <Link className="text-link" href="/calendar">
          进入完整日历
        </Link>
      </section>

      <section className="event-grid">
        {events.slice(0, 6).map((event: EventItem) => (
          <EventCard event={event} key={event.id} />
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Artist Layer</p>
          <h2>从巡演站点过渡到 fandom 平台的第一层</h2>
        </div>
        <Link className="text-link" href="/artists">
          进入艺人目录
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

      <section className="architecture" id="architecture">
        <div className="section-head">
          <div>
            <p className="eyebrow">Architecture</p>
            <h2>为内容平台和数据平台同时留扩展空间</h2>
          </div>
        </div>
        <div className="track-list">
          {architectureTracks.map((track) => (
            <article className="track-card" key={track.name}>
              <p className="track-name">{track.name}</p>
              <p>{track.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
