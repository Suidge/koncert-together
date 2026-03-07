import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { guides } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Seoul Signal`,
    description: guide.summary
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();

  return (
    <main className="page-shell">
      <Header />
      <section className="detail-hero">
        <div className="detail-copy">
          <p className="eyebrow">{guide.category}</p>
          <h1>{guide.title}</h1>
          <p className="hero-text">{guide.body}</p>
        </div>
      </section>
      <section className="detail-content single-column">
        <article className="detail-block">
          <p className="eyebrow">Checklist</p>
          <h2>重点记住</h2>
          <ul className="checklist">
            {guide.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
