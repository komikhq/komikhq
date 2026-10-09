import type { APIRoute } from "astro"
import { proxyApiResponse } from "@/lib/api-client"

export const GET: APIRoute = () => proxyApiResponse("/sitemap-chapters.xml")
