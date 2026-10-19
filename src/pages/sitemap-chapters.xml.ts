import type { APIRoute } from "astro"
import { sitemapsApi } from "@/lib/sdk-client"

export const GET: APIRoute = async () => {
  const xml = await sitemapsApi.getChaptersXmlSitemap()
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
