import type { Metadata } from "next";
import { Header } from "@/components/header";
import { formatShortDate, siteMeta, sourceStatus } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Status | Seoul Signal",
  robots: {
    index: false,
    follow: false
  }
};

export default function OpsStatusPage() {
  const latest = [...sourceStatus]
    .sort((a, b) => (b.checkedAt ?? "").localeCompare(a.checkedAt ?? ""))
    .slice(0, 12);

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Internal</p>
        <h1>Source Monitor Status</h1>
        <p className="hero-text">这个页面不在导航暴露，用来查看当前来源监测和自动维护状态。</p>
      </section>
      <section className="pillar-grid">
        <article className="pillar-card">
          <h2>内容规模</h2>
          <p>{siteMeta.counts.artists} 个艺人，{siteMeta.counts.events} 个活动，{siteMeta.counts.guides} 篇指南。</p>
        </article>
        <article className="pillar-card">
          <h2>来源健康</h2>
          <p>正常 {siteMeta.sourceHealth?.ok ?? 0}，需复查 {siteMeta.sourceHealth?.failed ?? 0}。</p>
        </article>
        <article className="pillar-card">
          <h2>最近检查</h2>
          <p>{siteMeta.sourceHealth?.lastCheckedAt ? formatShortDate(siteMeta.sourceHealth.lastCheckedAt) : '未检查'}</p>
        </article>
      </section>
      <section className="content-grid">
        {latest.map((item) => (
          <article className="content-card" key={item.id}>
            <p className="eyebrow">{item.category}</p>
            <h3>{item.label}</h3>
            <p className="content-summary">
              {item.ok ? (item.access === 'restricted' ? '受限但可识别' : '正常') : '需要复查'}
            </p>
            <div className="meta-line">
              <span>{item.status ?? 'n/a'}</span>
              <span>{item.checkedAt ? formatShortDate(item.checkedAt) : '未检查'}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
