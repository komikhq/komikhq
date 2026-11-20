import { sitemapsApi } from "@/lib/sdk-client";

export async function loader() {
  const res = await sitemapsApi.getComicSitemapXmlRaw();
  const rawXml = await res.raw.text();

  const xml = rawXml.includes("<?xml-stylesheet")
    ? rawXml
    : rawXml.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/css" href="/sitemap.css"?>'
      );

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
