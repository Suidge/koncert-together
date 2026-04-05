import Link from "next/link";
import { assetPath } from "@/lib/assets";
import { hasDisplayVisual } from "@/lib/site-data";
import type { ArtistProfile } from "@/lib/site-data";

type Props = {
  artist: ArtistProfile;
  eventCount: number;
  planCount?: number;
};

export function ArtistCard({ artist, eventCount, planCount = 0 }: Props) {
  return (
    <article className="artist-card" style={{ ["--artist-accent" as string]: artist.accent }}>
      {artist.coverImage && hasDisplayVisual(artist.imageQuality) ? (
        <div className="artist-visual-frame">
          <img alt={`${artist.name} visual`} className="artist-visual" src={assetPath(artist.coverImage)} />
        </div>
      ) : null}
      <div className="artist-card-top">
        <p className="eyebrow">艺人</p>
        <span className="artist-count">{eventCount} 场排期</span>
      </div>
      <h3>
        <Link href={`/artists/${artist.slug}`}>{artist.name}</Link>
      </h3>
      <p className="artist-tagline">{artist.tagline}</p>
      <p className="artist-intro">{artist.intro}</p>
      <div className="artist-meta-strip">
        <span>{artist.fandom ?? "Fandom"}</span>
        <span>{artist.memberCount ?? 0} 位成员</span>
        <span>{planCount} 条消息</span>
      </div>
      <div className="tag-row">
        {(artist.genres ?? []).slice(0, 3).map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="link-row">
        <Link className="ticket-link" href={`/artists/${artist.slug}`}>
          查看艺人页
        </Link>
        {artist.officialUrl ? (
          <a className="ticket-link" href={artist.officialUrl} rel="noreferrer" target="_blank">
            官方入口
          </a>
        ) : null}
      </div>
    </article>
  );
}
