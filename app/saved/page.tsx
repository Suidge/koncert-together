import type { Metadata } from "next";
import { Header } from "@/components/header";
import { SavedBrowser } from "@/components/saved-browser";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "我的收藏 | Koncert Together",
  description: "查看本地收藏的 K-pop 巡演活动。"
};

export default async function SavedPage() {
  const events = await getEvents();

  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">我的收藏</p>
        <h1>我的收藏</h1>
        <p className="hero-text">
          先把你真正想看的场次和城市收在这里。下次回来，不用再从头翻一次整张日历。
        </p>
      </section>
      <SavedBrowser events={events} />
    </main>
  );
}
