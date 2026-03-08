import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteToggle } from "@/components/favorite-toggle";
import { Header } from "@/components/header";
import { ImageAttributionLine } from "@/components/image-attribution";
import { ShareButton } from "@/components/share-button";
import { assetPath } from "@/lib/assets";
import { formatEventDateLabel, getEventBySlug, getEvents } from "@/lib/events";
import {
  type EventItem,
  findSourceStatus,
  formatShortDate,
  getStatusLabel
} from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event: EventItem) => ({ slug: event.slug }));
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const sourceStatus = findSourceStatus(event.sourceUrl);

  return (
    <main className="page-shell">
      <Header />
      <section className="detail-hero detail-hero-rich">
        <div className="detail-copy">
          <p className="eyebrow">场次详情</p>
          <h1>{event.title}</h1>
          <p className="hero-text">{event.description}</p>
          <div className="detail-actions">
            <FavoriteToggle slug={event.slug} />
            <ShareButton title={event.title} />
            {event.ticketLinks.map((link: EventItem["ticketLinks"][number]) => (
              <a className="primary-button" href={link.href} key={link.href} rel="noreferrer" target="_blank">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="detail-hero-image-wrap">
          {event.heroImage ? <img alt={event.title} className="detail-hero-image" src={assetPath(event.heroImage)} /> : null}
          <ImageAttributionLine attribution={event.heroImageAttribution} />
        </div>
        <aside className="detail-panel">
          <div className="detail-row">
            <span>艺人</span>
            <strong>{event.artist}</strong>
          </div>
          {event.artistNameKo ? (
            <div className="detail-row">
              <span>韩文名</span>
              <strong>{event.artistNameKo}</strong>
            </div>
          ) : null}
          <div className="detail-row">
            <span>巡演</span>
            <strong>{event.tourName}</strong>
          </div>
          <div className="detail-row">
            <span>状态</span>
            <strong>{getStatusLabel(event.status)}</strong>
          </div>
          <div className="detail-row">
            <span>时间</span>
            <strong>{formatEventDateLabel(event.startDate, event.timezone)}</strong>
          </div>
          <div className="detail-row">
            <span>场馆</span>
            <strong>{event.venue}, {event.city}</strong>
          </div>
          <div className="detail-row">
            <span>来源</span>
            <strong>{event.source}</strong>
          </div>
          {event.doorsTime ? (
            <div className="detail-row">
              <span>入场时间</span>
              <strong>{event.doorsTime}</strong>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="detail-content">
        <article className="detail-block">
          <p className="eyebrow">抢票重点</p>
          <h2>购票与观演提示</h2>
          <p>{event.purchaseHint ?? "暂未补充购票说明。"}</p>
          {event.priceNote ? <p className="detail-note">票务提示: {event.priceNote}</p> : null}
          {event.ticketSaleDate ? <p className="detail-note">开票时间: {formatEventDateLabel(event.ticketSaleDate, event.timezone)}</p> : null}
        </article>
        <article className="detail-block">
          <p className="eyebrow">出行准备</p>
          <h2>出行与准备</h2>
          <p>{event.travelNote ?? "暂未补充出行提示。"}</p>
          {event.checklist?.length ? (
            <ul className="checklist">
              {event.checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
        </article>
        <article className="detail-block">
          <p className="eyebrow">核对入口</p>
          <h2>官宣与票务入口</h2>
          <p>这里优先保留官宣页面和可复核入口，方便你在抢票前快速确认消息有没有更新、购票页能不能正常打开。</p>
          {event.sourceConfidence ? <p className="detail-note">来源类型: {event.sourceConfidence === "official" ? "官方入口" : event.sourceConfidence === "partner" ? "合作票务" : "场馆页面"}</p> : null}
          {sourceStatus ? (
            <>
              <p className="detail-note">最近核对: {sourceStatus.checkedAt ? formatShortDate(sourceStatus.checkedAt) : "尚未核对"}</p>
              <p className="detail-note">页面状态: {sourceStatus.ok ? "当前可正常打开" : "当前访问异常，建议优先回到艺人官方主页确认"}</p>
            </>
          ) : null}
          {event.sourceUrl ? (
            <a className="text-link" href={event.sourceUrl} rel="noreferrer" target="_blank">
              查看来源页面
            </a>
          ) : null}
        </article>
      </section>

      <Link className="text-link back-link" href="/calendar">
        返回巡演日历
      </Link>
    </main>
  );
}
