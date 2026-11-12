import { getLegalDoc, type LegalSlug } from "@/lib/content/legal";
import type { Route } from "./+types/route.md";

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug as LegalSlug;
  const doc = getLegalDoc(slug);

  if (!doc) {
    throw new Response("Legal document not found", {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(doc.rawContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

