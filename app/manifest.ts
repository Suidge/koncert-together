import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Koncert Together",
    short_name: "Koncert Together",
    description: "中文 K-pop 全球巡演、艺人主页与指南站。",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe7",
    theme_color: "#181412",
    icons: []
  };
}
