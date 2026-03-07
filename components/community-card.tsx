import type { CommunityPost } from "@/lib/site-data";

type Props = {
  post: CommunityPost;
};

export function CommunityCard({ post }: Props) {
  return (
    <article className="content-card">
      <p className="eyebrow">{post.kind}</p>
      <h3>{post.title}</h3>
      <p className="content-summary">{post.summary}</p>
      <div className="meta-line">
        <span>{post.city}</span>
        <span>{post.dateLabel}</span>
      </div>
    </article>
  );
}
