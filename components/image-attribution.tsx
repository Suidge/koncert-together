import type { ImageAttribution } from "@/lib/site-data";

type Props = {
  attribution?: ImageAttribution;
};

export function ImageAttributionLine({ attribution }: Props) {
  if (!attribution) {
    return null;
  }

  return (
    <p className="image-attribution">
      图片来源: {attribution.provider} · {attribution.creator} · {attribution.license} ·{" "}
      <a href={attribution.sourceUrl} rel="noreferrer" target="_blank">
        {attribution.sourceLabel ?? "查看来源"}
      </a>
    </p>
  );
}
