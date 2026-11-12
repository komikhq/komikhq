export type LegalSlug = "privacy" | "terms" | "dmca" | "contact" | string;

export interface LegalDocFrontmatter {
  title: string;
  description: string;
  lastUpdated: string;
  category?: string;
}

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export interface LegalDoc {
  slug: string;
  frontmatter: LegalDocFrontmatter;
  content: string;
  rawContent: string;
  toc: TocItem[];
  readingTime: string;
}

// Bundle all markdown files at compile time via Vite raw query (100% Cloudflare Workers compatible)
const rawLegalModules = import.meta.glob<string>(
  "../../content/legal/*.md",
  { query: "?raw", import: "default", eager: true }
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yaml = match[1];
  const content = match[2];
  const data: Record<string, string> = {};

  for (const line of yaml.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  }

  return { data, content };
}

function extractToc(markdownContent: string): TocItem[] {
  const lines = markdownContent.split("\n");
  const items: TocItem[] = [];
  const slugCounts = new Map<string, number>();

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const depth = match[1].length;
    const text = match[2].replace(/\[(.*?)\]\(.*?\)/g, "$1").trim();
    let id = slugify(text);

    // Handle duplicate heading IDs like GitHub/rehype-slug does (e.g. heading-1)
    const count = slugCounts.get(id) || 0;
    slugCounts.set(id, count + 1);
    if (count > 0) {
      id = `${id}-${count}`;
    }

    items.push({ id, text, depth });
  }

  return items;
}

function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// Pre-parse documents map
const documentsMap = new Map<string, LegalDoc>();

for (const [filepath, rawContent] of Object.entries(rawLegalModules)) {
  const filename = filepath.split("/").pop()?.replace(/\.md$/, "");
  if (!filename) continue;

  const parsed = parseFrontmatter(rawContent);
  const frontmatter: LegalDocFrontmatter = {
    title: parsed.data.title || filename.charAt(0).toUpperCase() + filename.slice(1),
    description: parsed.data.description || "",
    lastUpdated: parsed.data.lastUpdated || "October 8, 2026",
    category: parsed.data.category || "Legal",
  };

  const bodyContent = parsed.content.trim();
  const toc = extractToc(bodyContent);
  const readingTime = calculateReadingTime(bodyContent);

  documentsMap.set(filename, {
    slug: filename,
    frontmatter,
    content: bodyContent,
    rawContent,
    toc,
    readingTime,
  });
}

export function getLegalDoc(slug: string): LegalDoc | null {
  return documentsMap.get(slug) ?? null;
}

export function getAllLegalDocs(): LegalDoc[] {
  return Array.from(documentsMap.values());
}

export function getLegalSlugs(): string[] {
  return Array.from(documentsMap.keys());
}
