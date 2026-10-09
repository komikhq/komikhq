import type { APIRoute } from "astro"
import { SITE_URL, API_ROUTES } from "@/constants"
import { apiFetch } from "@/lib/api-client"

export const GET: APIRoute = async ({ locals }) => {
  let comics: Array<{ slug: string; updated_at?: string; updatedAt?: string }> =
    []

  try {
    const res = await apiFetch<any>(
      API_ROUTES.COMICS.BROWSE("limit=1000"),
      undefined,
      locals
    )
    comics = res.comics || res.data || []
  } catch (error) {
    console.error("Failed to fetch comics for sitemap:", error)
    comics = []
  }

  const today = new Date().toISOString().split("T")[0]

  const urlsXml = comics
    .filter((c) => Boolean(c.slug))
    .map((c) => {
      const rawDate = c.updated_at || c.updatedAt
      const lastmod = rawDate ? new Date(rawDate).toISOString().split("T")[0] : today
      return `  <url>
    <loc>${SITE_URL}/komik/${c.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
