import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://seoul-signal.vercel.app"
  ),
  title: {
    default: "Seoul Signal",
    template: "%s"
  },
  description:
    "K-pop 全球巡演聚合站，面向中文用户的演出日历、购票入口与 fandom 内容平台雏形。",
  applicationName: "Seoul Signal",
  keywords: ["K-pop", "演唱会", "巡演", "购票", "Seoul Signal", "韩流"],
  openGraph: {
    title: "Seoul Signal",
    description: "面向中文用户的 K-pop 全球巡演聚合站。",
    siteName: "Seoul Signal",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Seoul Signal",
    description: "面向中文用户的 K-pop 全球巡演聚合站。"
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
