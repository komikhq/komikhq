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
          h2: ({ id, children, ...props }) => (
            <h2 id={id} className="group relative scroll-mt-24" {...props}>
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  aria-label={`Direct link to ${typeof children === "string" ? children : "section"}`}
                  className="ml-2 inline-opacity-0 text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                >
                  <LinkIcon className="inline size-3.5 align-baseline" />
                </a>
              )}
            </h2>
          ),
          h3: ({ id, children, ...props }) => (
            <h3 id={id} className="group relative scroll-mt-24" {...props}>
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  aria-label={`Direct link to section`}
                  className="ml-2 inline-opacity-0 text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                >
                  <LinkIcon className="inline size-3 align-baseline" />
                </a>
              )}
            </h3>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

