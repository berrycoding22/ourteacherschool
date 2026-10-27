import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";
import { createClient } from "../lib/supabase/server";

const publicPages = ["", "/about", "/programs", "/teachers", "/gallery", "/videos", "/news", "/faq", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = publicPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/news" || path === "/gallery" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("activity_albums").select("id,activity_date").eq("published", true);
    const activityEntries: MetadataRoute.Sitemap = (data ?? []).map((activity) => ({
      url: `${siteUrl}/activities/${activity.id}`,
      lastModified: activity.activity_date ? new Date(`${activity.activity_date}T00:00:00`) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...staticEntries, ...activityEntries];
  } catch {
    return staticEntries;
  }
}
