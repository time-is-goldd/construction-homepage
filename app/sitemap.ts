import type { MetadataRoute } from "next";
import { listWorks } from "@/lib/works";
import { SITE_URL } from "@/lib/seo/site";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/company", changeFrequency: "yearly", priority: 0.5 },
  { path: "/business", changeFrequency: "monthly", priority: 0.8 },
  { path: "/works", changeFrequency: "weekly", priority: 0.9 },
  { path: "/performance", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
];

// 정적 공개 페이지 + 게시(is_published=true)된 시공사례 상세를 합쳐 생성한다.
// /admin 경로는 robots.ts에서 색인 차단되므로 sitemap에도 포함하지 않는다.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await listWorks({ publishedOnly: true });

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const workEntries: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${SITE_URL}/works/${work.id}`,
    lastModified: new Date(work.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...workEntries];
}
