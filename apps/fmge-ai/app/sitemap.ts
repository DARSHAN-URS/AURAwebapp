import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fmge.ai";

  const routes = [
    "",
    "/about",
    "/why-choose-us",
    "/features",
    "/syllabus",
    "/qbank",
    "/mocks",
    "/ai-tutor",
    "/planner",
    "/analytics",
    "/success-stories",
    "/pricing",
    "/blog",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
