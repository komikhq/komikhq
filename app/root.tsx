import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { SiteHeader } from "@/components/common/site-header";
import { BottomNav } from "@/components/common/bottom-nav";
import { SiteFooter } from "@/components/common/site-footer";
import { GlobalLoadingBar } from "@/components/common/global-loading-bar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalPresenceListener } from "@/components/common/global-presence-listener";
import { CookieConsent } from "@/components/common/cookie-consent";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

export function meta(): Route.MetaDescriptors {
  return [
    { title: `${SITE_NAME} - Read Manga, Manhwa, and Manhua Online` },
    { name: "description", content: SITE_DESCRIPTION },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/og.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "/images/og.png" },
  ];
}

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var supportDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && supportDark) || (stored === "system" && supportDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  // Check if current page is comic reader mode (e.g. /komik/:slug/:chapter)
  const isReaderMode =
    location.pathname.startsWith("/komik/") &&
    location.pathname.split("/").filter(Boolean).length >= 3;

  return (
    <div
      className={
        isReaderMode
          ? "min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-primary selection:text-primary-foreground"
          : "min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
      }
    >
      <GlobalPresenceListener />
      <GlobalLoadingBar />
      <div className="relative flex min-h-screen flex-col">
        {!isReaderMode && <SiteHeader />}
        <main className={isReaderMode ? "flex-1" : "flex-1 pb-16 md:pb-0"}>
          <Outlet />
        </main>
        {!isReaderMode && <SiteFooter />}
        {!isReaderMode && <BottomNav />}
        <Toaster position="top-right" richColors />
        <CookieConsent />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          {message}
        </h1>
        <p className="mt-4 text-base text-muted-foreground">{details}</p>
        {stack && (
          <pre className="mt-6 overflow-x-auto rounded-lg bg-muted p-4 text-left text-xs">
            <code>{stack}</code>
          </pre>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
