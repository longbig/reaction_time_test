import type { MetadataRoute } from "next";

// Serve /robots.txt and point Google/Bing to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // Primary host; Google uses this for absolute references.
    host: "https://reactiontest.site",
    // Expose both sitemap URLs so either hostname is discoverable.
    sitemap: [
      "https://reactiontest.site/sitemap.xml",
      "https://www.reactiontest.site/sitemap.xml",
    ],
  };
}

