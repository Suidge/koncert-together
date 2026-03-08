import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Koncert Together</strong>
        <p>把巡演排期、成员档案、场馆经验和中文观演提醒整理在一起，方便你更快判断哪一场值得冲、哪一档票更适合自己。</p>
      </div>
      <nav className="footer-nav">
        <Link href="/calendar">巡演日历</Link>
        <Link href="/artists">艺人目录</Link>
        <Link href="/guides">观演指南</Link>
        <Link href="/credits">图片署名</Link>
      </nav>
    </footer>
  );
}
