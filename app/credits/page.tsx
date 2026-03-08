import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { getArtists } from "@/lib/events";

export const metadata: Metadata = {
  title: "图片署名 | Koncert Together",
  description: "Koncert Together 站内外部图片的来源、作者与许可信息。"
};

export default async function CreditsPage() {
  const artists = await getArtists();
  const sourcedArtists = artists
    .filter((artist) => artist.imageAttribution)
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  return (
    <main className="page-shell">
      <Header />
      <section className="detail-hero compact-hero">
        <div className="detail-copy">
          <p className="eyebrow">Image Credits</p>
          <h1>图片署名</h1>
          <p className="hero-text">
            外部图片只接入许可清晰、可本地缓存的来源。其余艺人与活动仍保留站内生成视觉作为兜底。
          </p>
        </div>
      </section>

      <section className="content-grid">
        {sourcedArtists.map((artist) => (
          <article className="detail-block" key={artist.slug}>
            <p className="eyebrow">Artist</p>
            <h2>{artist.name}</h2>
            <p>
              作者: {artist.imageAttribution?.creator}
              <br />
              许可: {artist.imageAttribution?.license}
              <br />
              来源平台: {artist.imageAttribution?.provider}
            </p>
            {artist.imageAttribution?.sourceUrl ? (
              <a className="text-link" href={artist.imageAttribution.sourceUrl} rel="noreferrer" target="_blank">
                {artist.imageAttribution.sourceLabel ?? "查看来源"}
              </a>
            ) : null}
            <div className="link-row">
              <Link className="ticket-link" href={`/artists/${artist.slug}`}>
                查看艺人页
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
