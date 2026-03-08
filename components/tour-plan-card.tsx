import Link from "next/link";
import type { TourPlanItem } from "@/lib/site-data";

type Props = {
  plan: TourPlanItem;
};

export function TourPlanCard({ plan }: Props) {
  return (
    <article className="content-card radar-card">
      <p className="eyebrow">巡演消息</p>
      <h3>{plan.title}</h3>
      <p className="content-summary">{plan.note}</p>
      <div className="tag-row">
        {plan.regions.map((region) => (
          <span className="tag" key={region}>{region}</span>
        ))}
      </div>
      <div className="link-row">
        <Link className="ticket-link" href={`/artists/${plan.artistSlug}`}>
          进入艺人页
        </Link>
        {plan.sourceUrl ? (
          <a className="ticket-link" href={plan.sourceUrl} rel="noreferrer" target="_blank">
            官方来源
          </a>
        ) : null}
      </div>
    </article>
  );
}
