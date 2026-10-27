const fallbackSiteUrl = "https://ourteacherschool.vercel.app";

/** Public, canonical address used by metadata, robots, and sitemaps. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");

export const siteName = "Our Teacher School";
