import Link from "next/link";
import type { GuideItem } from "@/lib/site-data";

type Props = {
  guide: GuideItem;
};

export function GuideCard({ guide }: Props) {
  return (
    <article className="content-card">
      <p className="eyebrow">{guide.category}</p>
      <h3>{guide.title}</h3>
      <p className="content-summary">{guide.summary}</p>
      <Link className="text-link" href={`/guides/${guide.slug}`}>
        阅读全文
      </Link>
    </article>
  );
}
