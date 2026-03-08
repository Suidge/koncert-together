import type { Metadata } from "next";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "投稿入口 | Seoul Signal",
  description: "向 Seoul Signal 提交观演攻略、场次组织和应援项目。"
};

export default function CommunitySubmitPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="detail-hero">
        <div className="detail-copy">
          <p className="eyebrow">Submit</p>
          <h1>投稿与线索入口</h1>
          <p className="hero-text">
            试运行阶段先通过邮件和 GitHub issue 收集观演攻略、应援项目和官宣线索，再人工整理成精选内容，降低社区起步阶段的噪音。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="mailto:hello@seoulsignal.site?subject=Seoul%20Signal%20投稿">
              邮件投稿
            </a>
            <a
              className="secondary-button"
              href="https://github.com/Suidge/seoul-signal/issues/new"
              rel="noreferrer"
              target="_blank"
            >
              提交线索
            </a>
          </div>
        </div>
        <aside className="detail-panel">
          <div className="detail-row">
            <span>适合投稿</span>
            <strong>同行 / 应援 / 观演攻略</strong>
          </div>
          <div className="detail-row">
            <span>适合线索</span>
            <strong>官宣 / 场馆 / 票务更新</strong>
          </div>
          <div className="detail-row">
            <span>发布方式</span>
            <strong>人工审核后精选上线</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}
