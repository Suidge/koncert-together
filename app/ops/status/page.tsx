import type { Metadata } from "next";
import { Header } from "@/components/header";
import { sourceStatus } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Status | Koncert Together",
  robots: {
    index: false,
    follow: false
  }
};

export default function OpsStatusPage() {
  const checked = sourceStatus.filter((item) => item.checkedAt).sort((a, b) => (b.checkedAt ?? "").localeCompare(a.checkedAt ?? ""));
  const ok = sourceStatus.filter((item) => item.ok).length;
  const failed = sourceStatus.length - ok;

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Ops</p>
        <h1>内部状态页</h1>
        <p className="hero-text">这个页面不对外链接，用来查看来源检查和自动维护状态。</p>
      </section>
      <section className="insight-strip">
        <article><strong>{sourceStatus.length}</strong><span>监测来源</span></article>
        <article><strong>{ok}</strong><span>正常</span></article>
        <article><strong>{failed}</strong><span>需复查</span></article>
        <article><strong>{checked[0]?.checkedAt ? new Date(checked[0].checkedAt).toLocaleString("zh-CN") : "未检查"}</strong><span>最近检查</span></article>
      </section>
      <section className="content-grid">
        {checked.slice(0, 12).map((item) => (
          <article className="content-card" key={item.id}>
            <p className="eyebrow">{item.category}</p>
            <h3>{item.label}</h3>
            <p className="content-summary">{item.url}</p>
            <p className="content-summary">状态: {item.ok ? `正常 (${item.status ?? "n/a"})` : `需复查${item.status ? ` (${item.status})` : ""}`}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
