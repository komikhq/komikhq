import { getLegalDoc, type LegalSlug } from "@/lib/content/legal";
import { LegalShell } from "./legal-shell";
import { MarkdownRenderer } from "./markdown-renderer";
import { SITE_NAME } from "@/constants";
import type { Route } from "./+types/route";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug as LegalSlug;
  const doc = getLegalDoc(slug);

  if (!doc) {
    throw new Response(`Legal document '${slug}' not found`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return { doc };
}

export function meta({ params }: { params?: { slug?: string } }): Route.MetaDescriptors {
  const doc = params?.slug ? getLegalDoc(params.slug) : null;
  if (!doc) {
    return [{ title: `Legal Policy | ${SITE_NAME}` }];
  }
  return [
    { title: `${doc.frontmatter.title} | ${SITE_NAME}` },
    { name: "description", content: doc.frontmatter.description },
  ];
}

export default function LegalRoute({ loaderData }: Route.ComponentProps) {
  const { doc } = loaderData;
  return (
    <LegalShell doc={doc}>
      <MarkdownRenderer content={doc.content} />
    </LegalShell>
  );
}

