import type { Metadata } from "next";
import Link from "next/link";
import { CommunityCard } from "@/components/community-card";
import { Header } from "@/components/header";
import { communityPosts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Fandom 社区 | Koncert Together",
  description: "面向中文 K-pop fans 的城市聚会、应援协作和同看活动入口。"
};

export default function CommunityPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Community</p>
        <h1>Fandom 社区精选</h1>
        <p className="hero-text">
          当前先提供只读精选内容和投稿入口，验证哪些城市协作、应援项目和观演经验最值得继续做成真实社区功能。
        </p>
        <div className="hero-actions">
          <Link className="primary-button" href="/community/new">
            投稿入口
          </Link>
        </div>
      </section>
      <section className="content-grid">
        {communityPosts.map((post) => (
          <CommunityCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
