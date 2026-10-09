import type { APIRoute } from "astro"
import { SITE_URL, API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export const GET: APIRoute = async ({ locals }) => {
  let chapters: Array<{
    comicSlug: string
    chapterSlug: string
    updated_at?: string
    updatedAt?: string
  }> = []

  try {
    const res = await apiFetch<any>(
      API_ROUTES.SITEMAPS.CHAPTERS(1, 50000),
      undefined,
      locals
    )
    chapters = res.chapters || res.data || []
  } catch (error) {
    console.error("Failed to fetch chapters for sitemap:", error)
    chapters = []
  }

  const today = new Date().toISOString().split("T")[0]

  const urlsXml = chapters
    .filter((ch) => Boolean(ch.comicSlug && ch.chapterSlug))
    .map((ch) => {
      const rawDate = ch.updated_at || ch.updatedAt
      const lastmod = rawDate
        ? new Date(rawDate).toISOString().split("T")[0]
        : today
      return `  <url>
    <loc>${SITE_URL}/komik/${ch.comicSlug}/${ch.chapterSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  })
}
