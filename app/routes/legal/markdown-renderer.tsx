import * as React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Link } from "react-router";
import { LinkIcon } from "@phosphor-icons/react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="typeset typeset-docs max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ href, children, ...props }) => {
            if (!href) return <span {...props}>{children}</span>;

            // Internal link via React Router Link
            if (href.startsWith("/")) {
              return (
                <Link to={href} {...props}>
                  {children}
                </Link>
              );
            }

            // External link
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          h1: ({ id, children, ...props }) => (
            <h1
              id={id}
              className="group relative scroll-mt-24 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-8 mb-4"
              {...props}
            >
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  aria-label="Direct link to heading"
                  className="ml-2 inline-flex text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                >
                  <LinkIcon className="size-4 inline" />
                </a>
              )}
            </h1>
          ),
          h2: ({ id, children, ...props }) => (
            <h2
              id={id}
              className="group relative scroll-mt-24 font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground border-b border-border/70 pb-2 mt-8 mb-4 flex items-center justify-between"
              {...props}
            >
              <span>{children}</span>
              {id && (
                <a
                  href={`#${id}`}
                  aria-label="Direct link to section"
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                >
                  <LinkIcon className="size-4" />
                </a>
              )}
            </h2>
          ),
          h3: ({ id, children, ...props }) => (
            <h3
              id={id}
              className="group relative scroll-mt-24 font-heading text-base font-semibold tracking-tight text-foreground/90 mt-6 mb-3 flex items-center justify-between"
              {...props}
            >
              <span>{children}</span>
              {id && (
                <a
                  href={`#${id}`}
                  aria-label="Direct link to sub-section"
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                >
                  <LinkIcon className="size-3.5" />
                </a>
              )}
            </h3>
          ),
          h4: ({ id, children, ...props }) => (
            <h4
              id={id}
              className="group relative scroll-mt-24 font-heading text-sm font-semibold tracking-tight text-foreground/80 mt-4 mb-2"
              {...props}
            >
              {children}
            </h4>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
