import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Koncert Together</strong>
        <p>试运行阶段以前台内容站为主，活动、指南和艺人页持续扩充。</p>
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
