import * as React from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheckIcon as ShieldCheck,
  FileTextIcon as FileText,
  CopyrightIcon as Copyright,
  EnvelopeSimpleIcon as EnvelopeSimple,
  SlidersHorizontalIcon as SlidersHorizontal,
  CaretRightIcon as CaretRight,
  ClockIcon as Clock,
  CopyIcon as Copy,
  CheckIcon as Check,
  ArrowSquareOutIcon as ArrowSquareOut,
  BookOpenIcon as BookOpen,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { TableOfContents } from "./toc";
import { getAllLegalDocs, type LegalDoc, type LegalSlug } from "@/lib/content/legal";

interface LegalShellProps {
  doc: LegalDoc;
  children: React.ReactNode;
}

function getLegalIcon(slug: LegalSlug) {
  switch (slug) {
    case "privacy":
      return ShieldCheck;
    case "terms":
      return FileText;
    case "dmca":
      return Copyright;
    case "contact":
      return EnvelopeSimple;
    default:
      return FileText;
  }
}

export function LegalShell({ doc, children }: LegalShellProps) {
  const [copied, setCopied] = React.useState<boolean>(false);
  const legalDocs = getAllLegalDocs();

  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new CustomEvent("komikhq:open-cookie-settings"));
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(doc.rawContent);
      setCopied(true);
      toast.success("Markdown copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy markdown to clipboard.");
    }
  };

  const { title, description, lastUpdated } = doc.frontmatter;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link to="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <CaretRight className="size-3.5 opacity-60" />
        <span>Legal</span>
        <CaretRight className="size-3.5 opacity-60" />
        <span className="font-medium text-foreground">{title}</span>
      </nav>

      {/* Header Banner */}
      <header className="mb-8 border-b border-border/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1 px-2.5 py-0.5 text-xs font-normal"
            >
              <ShieldCheck className="size-3 text-primary" />
              Official Policy
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="size-3.5" />
              {doc.readingTime}
            </span>
          </div>

          {/* Document Actions (Fumadocs/Starlight Style) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              title="Copy raw markdown to clipboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-muted/60"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <a
              href={`/legal/${doc.slug}.md`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open raw markdown in a new tab"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <ArrowSquareOut className="size-3.5" />
              <span>View Raw</span>
            </a>
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </header>

      {/* Dynamic Legal Navigation Tabs (File-Driven from app/content/legal/*.md) */}
      <div className="mb-8 flex flex-wrap gap-1.5 rounded-2xl border border-border/70 bg-muted/30 p-1.5 backdrop-blur-sm">
        {legalDocs.map((item) => {
          const isActive = item.slug === doc.slug;
          const Icon = getLegalIcon(item.slug);
          return (
            <Link
              key={item.slug}
              to={`/legal/${item.slug}`}
              className={
                isActive
                  ? "flex items-center gap-2 rounded-xl bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm ring-1 ring-border/50 transition-all dark:bg-card"
                  : "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-background/50 hover:text-foreground"
              }
            >
              <Icon
                className={
                  isActive ? "size-4 text-primary" : "size-4 opacity-70"
                }
              />
              <span>{item.frontmatter.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Cookie Control Callout on Privacy Page */}
      {doc.slug === "privacy" && (
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-primary/10">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-foreground">
              Manage Your Cookie Preferences
            </h4>
            <p className="text-xs text-muted-foreground">
              You can adjust Google Analytics and Microsoft Clarity tracking
              permissions at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCookieSettings}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <SlidersHorizontal className="size-3.5" />
            Cookie Settings
          </button>
        </div>
      )}

      {/* Two-Column Layout (Article + TOC Sidebar) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_240px]">
        {/* Main Markdown Content Container with typeset styles */}
        <main className="min-w-0 rounded-3xl border border-border/80 bg-card/60 p-6 shadow-sm backdrop-blur-sm sm:p-10 dark:bg-card/40">
          {children}
        </main>

        {/* On-This-Page Table of Contents */}
        <TableOfContents items={doc.toc} />
      </div>
    </div>
  );
}
