import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://auraroutes.com";
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/services",
    "/ai-tools",
    "/universities",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
