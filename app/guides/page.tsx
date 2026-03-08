import type { Metadata } from "next";
import { GuideCard } from "@/components/guide-card";
import { Header } from "@/components/header";
import { guides } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "观演指南 | Koncert Together",
  description: "给中文 K-pop fans 的购票、出行、选座和场馆指南。"
};

export default function GuidesPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Guides</p>
        <h1>观演与入坑指南</h1>
        <p className="hero-text">
          这里优先整理最常用、最容易影响决策的内容：抢票、选座、跨城观演、场馆速查和 fandom 入门。
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
