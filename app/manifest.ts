import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seoul Signal",
    short_name: "Seoul Signal",
    description: "中文 K-pop 全球巡演聚合站。",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#181412",
    icons: []
  };
}
