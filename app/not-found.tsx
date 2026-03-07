import Link from "next/link";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <main className="page-shell">
      <Header />
      <section className="calendar-hero">
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
        <p className="hero-text">这个地址当前没有内容，可能是活动还没录入，或者链接已经失效。</p>
        <div className="hero-actions">
          <Link className="primary-button" href="/calendar">
            查看巡演日历
          </Link>
          <Link className="secondary-button" href="/artists">
            查看艺人目录
          </Link>
        </div>
      </section>
    </main>
  );
}
