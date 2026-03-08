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
        <p className="eyebrow">粉圈现场</p>
        <h1>Fandom 社区精选</h1>
        <p className="hero-text">
          这里收录最值得保存的同行信息、应援协作和场馆经验。看完一轮，你大概就会知道下一场想跟谁一起去、哪些准备得先做。
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
