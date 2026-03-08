import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarBrowser } from "@/components/calendar-browser";
import { Header } from "@/components/header";
import { getArtists, getEvents, getTourPlans } from "@/lib/events";

export const metadata: Metadata = {
  title: "巡演日历 | Koncert Together",
  description: "按艺人、地区和状态查看 K-pop 全球巡演日历与巡演雷达。"
};

export default async function CalendarPage() {
  const [artists, events, plans] = await Promise.all([getArtists(), getEvents(), getTourPlans()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Tour Calendar</p>
        <h1>巡演日历</h1>
        <p className="hero-text">
          当前日历页分成两层：已经整理到日期的活动卡片，以及仍在等待更完整官宣的巡演雷达。这样能扩大覆盖，但不把未落地信息伪装成正式排期。
        </p>
      </section>
      <Suspense fallback={<section className="calendar-hero">正在加载筛选器…</section>}>
        <CalendarBrowser artists={artists} events={events} plans={plans} />
      </Suspense>
    </main>
  );
}
