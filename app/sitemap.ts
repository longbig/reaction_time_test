import type { MetadataRoute } from "next";

// Next.js metadata route that serves /sitemap.xml
// We include both the apex domain and the www subdomain, per request.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const primary = "https://reactiontest.site";
  const withWww = "https://www.reactiontest.site";

  // List all static routes we want indexed
  const paths = ["/", "/pricing"];

  return [
    ...paths.map((p) => ({
      url: `${primary}${p}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: p === "/" ? 1 : 0.7,
    })),
    ...paths.map((p) => ({
      url: `${withWww}${p}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: p === "/" ? 0.9 : 0.6,
    })),
  ];
}
