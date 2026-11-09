import { sitemapsApi } from "@/lib/sdk-client";

export async function loader() {
  const xml = await sitemapsApi.getComicsXmlSitemap();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

