import * as React from "react";
import type { TocItem } from "@/lib/content/legal";
import { ListIcon, CaretDownIcon } from "@phosphor-icons/react";

interface TocProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id || "");
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const isClickScrolling = React.useRef<boolean>(false);
  const scrollTimeoutRef = React.useRef<number | null>(null);

  // Deterministic, DOM-ordered ScrollSpy (Fumadocs & Starlight standard)
  React.useEffect(() => {
    if (!items || items.length === 0) return;

    const handleScroll = () => {
      // Don't fight with user click while smooth scroll animation is running
      if (isClickScrolling.current) return;

      // When reaching the bottom of the page, always highlight the last heading
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      const headerOffset = 110;
      let currentId = items[0]?.id || "";

      // Evaluate in strict document order so items never jump or get skipped
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= headerOffset) {
            currentId = item.id;
          } else {
            break;
          }
        }
      }

      if (currentId) {
        setActiveId(currentId);
      }
    };

    // Initial check on mount
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && items.some((item) => item.id === hash)) {
      setActiveId(hash);
    } else {
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    // Immediately highlight the clicked item for instant responsiveness
    setActiveId(id);
    setMobileOpen(false);
    window.history.pushState(null, "", `#${id}`);

    // Lock scrollspy updates during smooth scrolling animation
    isClickScrolling.current = true;
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    const headerOffset = 95;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Re-enable scroll listener after smooth scroll finishes
    scrollTimeoutRef.current = window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="mb-6 rounded-2xl border border-border/70 bg-muted/20 p-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-xs font-semibold text-foreground"
        >
          <span className="flex items-center gap-1.5">
            <ListIcon className="size-4 text-primary" />
            Table of Contents ({items.length})
          </span>
          <CaretDownIcon
            className={`size-3.5 transition-transform duration-200 ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {mobileOpen && (
          <ul className="mt-3 space-y-1 border-t border-border/50 pt-2 text-xs">
            {items.map((item) => (
              <li
                key={item.id}
                className={item.depth === 3 ? "pl-3 text-[11px]" : ""}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleItemClick(e, item.id)}
                  className={`block py-1 transition-colors hover:text-foreground ${
                    activeId === item.id
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Sticky TOC Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ListIcon className="size-3.5 text-primary" />
            <span>On This Page</span>
          </div>

          <nav className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
            <ul className="space-y-1.5 border-l border-border/60 text-xs">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleItemClick(e, item.id)}
                      className={`block border-l -ml-px transition-colors ${
                        item.depth === 3
                          ? "pl-4 text-[11px]"
                          : "pl-3 text-xs"
                      } py-1 ${
                        isActive
                          ? "border-primary font-semibold text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
