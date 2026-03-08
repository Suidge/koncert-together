import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarBrowser } from "@/components/calendar-browser";
import { Header } from "@/components/header";
import { getArtists, getEvents, getTourPlans } from "@/lib/events";

export const metadata: Metadata = {
  title: "巡演日历 | Koncert Together",
  description: "按艺人、地区和状态查看 K-pop 全球巡演日历与巡演消息。"
};

export default async function CalendarPage() {
  const [artists, events, plans] = await Promise.all([getArtists(), getEvents(), getTourPlans()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">巡演日历</p>
        <h1>巡演日历</h1>
        <p className="hero-text">
          已经落到日期的正式场次和还在等完整官宣的巡演消息，会在这里分开整理。你可以先锁定确定排期，也可以顺手盯住下一轮最可能落地的大场。
        </p>
      </section>
      <Suspense fallback={<section className="calendar-hero">筛选器加载中…</section>}>
        <CalendarBrowser artists={artists} events={events} plans={plans} />
      </Suspense>
    </main>
  );
}
