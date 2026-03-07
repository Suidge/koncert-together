import type { Metadata } from "next";
import { GuideCard } from "@/components/guide-card";
import { Header } from "@/components/header";
import { guides } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "观演指南 | Seoul Signal",
  description: "给中文 K-pop fans 的购票、出行和入坑指南。"
};

export default function GuidesPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Guides</p>
        <h1>观演与入坑指南</h1>
        <p className="hero-text">
          站点不只是日历，还应该真正帮助中文粉丝做决定。这里整理购票、跨城观演和 fandom 入门内容。
        </p>
      </section>
      <section className="content-grid">
        {guides.map((guide) => (
          <GuideCard guide={guide} key={guide.slug} />
        ))}
      </section>
    </main>
  );
}
