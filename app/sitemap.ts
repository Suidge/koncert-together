import type { MetadataRoute } from "next";
import { getAllEvents, getArtists } from "@/lib/events";
import { guides } from "@/lib/site-data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seoul-signal.vercel.app";
  const [events, artists] = await Promise.all([getAllEvents(), getArtists()]);

  return [
    "",
    "/calendar",
    "/artists",
    "/guides",
    "/community",
    "/saved",
    ...artists.map((artist) => `/artists/${artist.slug}`),
    ...guides.map((guide) => `/guides/${guide.slug}`),
    ...events.map((event) => `/events/${event.slug}`)
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));
}
