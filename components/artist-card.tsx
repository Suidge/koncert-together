import Link from "next/link";
import type { ArtistProfile } from "@/lib/site-data";

type Props = {
  artist: ArtistProfile;
  eventCount: number;
};

export function ArtistCard({ artist, eventCount }: Props) {
  return (
    <article className="artist-card" style={{ ["--artist-accent" as string]: artist.accent }}>
      <div className="artist-card-top">
        <p className="eyebrow">Artist</p>
        <span className="artist-count">{eventCount} 场</span>
      </div>
      <h3>
        <Link href={`/artists/${artist.slug}`}>{artist.name}</Link>
      </h3>
      <p className="artist-tagline">{artist.tagline}</p>
      <p className="artist-intro">{artist.intro}</p>
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
