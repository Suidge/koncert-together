import type { Metadata } from "next";
import { CommunityCard } from "@/components/community-card";
import { Header } from "@/components/header";
import { communityPosts } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Fandom 社区 | Seoul Signal",
  description: "面向中文 K-pop fans 的城市聚会、应援协作和同看活动入口。"
};

export default function CommunityPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Community</p>
        <h1>Fandom 社区入口</h1>
        <p className="hero-text">
          这是对外站点真正会长出黏性的部分。先从城市聚会、应援项目和同看活动切入，后续再加入发帖和报名。
        </p>
      </section>
      <section className="content-grid">
        {communityPosts.map((post) => (
          <CommunityCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}
