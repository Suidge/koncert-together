import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommunityCard } from "@/components/community-card";
import { EventCard } from "@/components/event-card";
import { GuideCard } from "@/components/guide-card";
import { Header } from "@/components/header";
import { ImageAttributionLine } from "@/components/image-attribution";
import { TourPlanCard } from "@/components/tour-plan-card";
import { getArtistBySlug, getArtists } from "@/lib/events";
import { assetPath } from "@/lib/assets";
import { communityPosts, guides, type EventItem } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const artists = await getArtists();
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    return {};
  }

  return {
    title: `${artist.name} | Koncert Together`,
    description: `${artist.name} 的巡演聚合页，包含成员档案、活动卡片、巡演雷达和官方入口。`
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const relatedGuides = guides.filter((guide) => guide.relatedArtists?.includes(artist.slug)).slice(0, 4);
  const relatedPosts = communityPosts.filter((post) => post.relatedArtists?.includes(artist.slug)).slice(0, 3);

  return (
    <main className="page-shell">
      <Header />
      <section className="artist-hero artist-hero-rich" style={{ ["--artist-accent" as string]: artist.accent }}>
        <div className="artist-hero-copy">
          <p className="eyebrow">Artist Hub</p>
          <h1>{artist.name}</h1>
          <p className="hero-text">{artist.intro}</p>
          <div className="hero-actions">
            <Link className="primary-button" href={`/calendar?artist=${artist.slug}`}>
              查看巡演
            </Link>
            {artist.officialUrl ? (
              <a className="secondary-button" href={artist.officialUrl} rel="noreferrer" target="_blank">
                官方入口
              </a>
            ) : null}
          </div>
        </div>
        <div className="artist-hero-visual">
          {artist.heroImage ? <img alt={artist.name} className="artist-hero-image" src={assetPath(artist.heroImage)} /> : null}
          <ImageAttributionLine attribution={artist.imageAttribution} />
        </div>
        <div className="artist-hero-panel">
          <div className="detail-row">
            <span>韩文名</span>
            <strong>{artist.nameKo ?? "待补充"}</strong>
          </div>
          <div className="detail-row">
            <span>粉丝名</span>
            <strong>{artist.fandom ?? "待补充"}</strong>
          </div>
          <div className="detail-row">
            <span>公司</span>
            <strong>{artist.agency ?? "待补充"}</strong>
          </div>
          <div className="detail-row">
            <span>出道</span>
            <strong>{artist.debutYear ?? "待补充"}</strong>
          </div>
          <div className="detail-row">
            <span>成员</span>
            <strong>{artist.memberCount ?? artist.members?.length ?? 0} 位</strong>
          </div>
          <div className="detail-row">
            <span>地区</span>
            <strong>{artist.origin ?? "待补充"}</strong>
          </div>
        </div>
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Member Profiles</p>
          <h2>成员 profile</h2>
        </div>
      </section>
      <section className="member-grid">
        {(artist.members ?? []).map((member) => (
          <article className="member-card" key={member.slug}>
            <div className="member-avatar" style={{ ["--artist-accent" as string]: artist.accent }}>
              <span>{member.initials}</span>
            </div>
            <div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="artist-intro">{member.profile}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Upcoming Events</p>
          <h2>已整理排期</h2>
        </div>
        <Link className="text-link" href={`/calendar?artist=${artist.slug}`}>
          在日历页查看
        </Link>
      </section>
      <section className="event-grid">
        {artist.upcomingEvents.length ? (
          artist.upcomingEvents.map((event: EventItem) => <EventCard event={event} key={event.id} />)
        ) : (
          <article className="detail-block single-card-message">
            <p className="eyebrow">No Dated Shows Yet</p>
            <h2>当前还没有已整理到日期卡片的场次</h2>
            <p>先看下方巡演雷达，等待更明确信息后会补进日历页。</p>
          </article>
        )}
      </section>

      <section className="section-head">
        <div>
          <p className="eyebrow">Tour Radar</p>
          <h2>日期未完全释放的巡演计划</h2>
        </div>
      </section>
      <section className="content-grid">
        {artist.tourPlans.length ? (
          artist.tourPlans.map((plan) => <TourPlanCard key={plan.slug} plan={plan} />)
        ) : (
          <article className="detail-block single-card-message">
            <p className="eyebrow">Radar Clear</p>
            <h2>这个艺人目前没有额外的巡演雷达条目</h2>
            <p>已知信息已经整理在上方活动卡片里。</p>
          </article>
        )}
      </section>

      {relatedGuides.length ? (
        <>
          <section className="section-head">
            <div>
              <p className="eyebrow">Starter Kit</p>
              <h2>入坑和观演前先看这些</h2>
            </div>
          </section>
          <section className="content-grid">
            {relatedGuides.map((guide) => (
              <GuideCard guide={guide} key={guide.slug} />
            ))}
          </section>
        </>
      ) : null}

      {relatedPosts.length ? (
        <>
          <section className="section-head">
            <div>
              <p className="eyebrow">Community</p>
              <h2>相关 fandom 场景</h2>
            </div>
          </section>
          <section className="content-grid">
            {relatedPosts.map((post) => (
              <CommunityCard key={post.slug} post={post} />
            ))}
          </section>
        </>
      ) : null}
    </main>
  );
}
