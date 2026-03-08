import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "投稿入口 | Koncert Together",
  description: "向 Koncert Together 提交观演攻略、场次组织和应援项目。"
};

export default function CommunitySubmissionPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">投稿</p>
        <h1>投稿入口</h1>
        <p className="hero-text">
          如果你有靠谱的场馆经验、同场同行信息、应援项目或抢票心得，欢迎投进来。好的投稿会整理进对应艺人页、场次页和指南页，方便更多人少踩坑。
        </p>
        <div className="hero-actions">
          <Link className="primary-button" href="https://github.com/Suidge/koncert-together/issues/new">
            打开投稿页
          </Link>
        </div>
      </section>
    </main>
  );
}
