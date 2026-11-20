import { sitemapsApi } from "@/lib/sdk-client";

export async function loader() {
  const res = await sitemapsApi.getComicSitemapXmlRaw();
  const xml = await res.raw.text();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

