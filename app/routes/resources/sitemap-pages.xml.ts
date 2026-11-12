import { SITE_URL } from "@/constants";
import { getAllLegalDocs } from "@/lib/content/legal";

export async function loader() {
  const today = new Date().toISOString().split("T")[0];
  const legalDocs = getAllLegalDocs();

  const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/browse", changefreq: "daily", priority: "0.9" },
    { loc: "/list-all", changefreq: "daily", priority: "0.8" },
  ];

  const legalPages = legalDocs.map((doc) => ({
    loc: `/legal/${doc.slug}`,
    changefreq: "monthly",
    priority: "0.3",
  }));

  const pages = [...staticPages, ...legalPages];

  const urlsXml = pages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}

