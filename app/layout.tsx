import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://suidge.github.io/seoul-signal";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seoul Signal",
    template: "%s"
  },
  description: "面向中文用户的 K-pop 全球巡演、场馆指南与 fandom 内容试运行站。",
  applicationName: "Seoul Signal",
  keywords: ["K-pop", "演唱会", "巡演", "购票", "Seoul Signal", "韩流"],
  openGraph: {
    title: "Seoul Signal",
    description: "面向中文用户的 K-pop 全球巡演、场馆指南与 fandom 内容试运行站。",
    siteName: "Seoul Signal",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Seoul Signal",
    description: "面向中文用户的 K-pop 全球巡演、场馆指南与 fandom 内容试运行站。"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
