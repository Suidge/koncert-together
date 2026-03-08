import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarBrowser } from "@/components/calendar-browser";
import { Header } from "@/components/header";
import { getArtists, getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "巡演日历 | Seoul Signal",
  description: "按艺人、地区和状态查看 K-pop 全球巡演日历。"
};

export default async function CalendarPage() {
  const [artists, events] = await Promise.all([getArtists(), getEvents()]);

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">Tour Calendar</p>
        <h1>巡演日历</h1>
        <p className="hero-text">
          试运行阶段先把主流艺人、主流城市和高价值场馆覆盖起来。当前支持按艺人、国家和状态筛选，并保留本地收藏。
        </p>
      </section>
      <Suspense fallback={<section className="calendar-hero">正在加载筛选器…</section>}>
        <CalendarBrowser artists={artists} events={events} />
      </Suspense>
    </main>
  );
}
