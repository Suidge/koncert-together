import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { communityPosts } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return communityPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = communityPosts.find((item) => item.slug === slug);
  return post ? { title: `${post.title} | Koncert Together`, description: post.summary } : {};
}

export default async function CommunityPostPage({ params }: Props) {
  const { slug } = await params;
  const post = communityPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Header />
      <section className="detail-hero">
        <div className="detail-copy">
          <p className="eyebrow">{post.kind}</p>
          <h1>{post.title}</h1>
          <p className="hero-text">{post.summary}</p>
        </div>
        <aside className="detail-panel">
          <div className="detail-row">
            <span>城市</span>
            <strong>{post.city}</strong>
          </div>
          <div className="detail-row">
            <span>时间</span>
            <strong>{post.dateLabel}</strong>
          </div>
        </aside>
      </section>
      <section className="detail-content single-column">
        <article className="detail-block">
          <p className="eyebrow">Preview</p>
          <h2>社区内容方向</h2>
          <p>
            当前公共站先以精选内容和投稿入口为主。等到哪些城市协作、应援项目和场馆经验最受欢迎之后，再决定是否继续升级成真实发帖和评论系统。
          </p>
        </article>
      </section>
    </main>
  );
}
