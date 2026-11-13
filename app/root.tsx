import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
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
import { GoogleAnalytics, MicrosoftClarity } from "@/components/common/analytics";
import { ErrorViewCard } from "@/components/common/error-view-card";
import { getSession } from "@/lib/auth-server";
import { useAuth } from "@/hooks/use-auth";
import { AuthProvider } from "@/components/common/auth/auth-provider";
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

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";

  // 1. SSR Theme extraction from Cookie
  const themeMatch = cookieHeader.match(/(?:^|;\s*)theme=(dark|light|system)(?:;|$)/);
  const theme = themeMatch ? (themeMatch[1] as "dark" | "light" | "system") : null;

  // 2. SSR Auth session extraction
  const sessionData = await getSession(request);

  // 3. Analytics IDs from Worker env or fallback
  const gaId =
    (context as any)?.cloudflare?.env?.PUBLIC_GA_ID ||
    process.env.PUBLIC_GA_ID ||
    "G-V44GMCRBP2";
  const clarityId =
    (context as any)?.cloudflare?.env?.PUBLIC_CLARITY_ID ||
    process.env.PUBLIC_CLARITY_ID ||
    "yui00n93x1";

  return {
    theme,
    user: sessionData?.user ?? null,
    session: sessionData?.session ?? null,
    gaId,
    clarityId,
  };
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
  const rootData = useRouteLoaderData<typeof loader>("root");
  const isDark = rootData?.theme === "dark";

  return (
    <html lang="en" className={isDark ? "dark" : ""} suppressHydrationWarning>
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

export default function App({ loaderData }: Route.ComponentProps) {
  const authState = useAuth();
  const location = useLocation();
  // Check if current page is comic reader mode (e.g. /komik/:slug/:chapter)
  const isReaderMode =
    location.pathname.startsWith("/komik/") &&
    location.pathname.split("/").filter(Boolean).length >= 3;

  return (
    <AuthProvider value={authState}>
      <div
        className={
          isReaderMode
            ? "min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-primary selection:text-primary-foreground"
            : "min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground"
        }
      >
        <GlobalPresenceListener />
        <GlobalLoadingBar />
        <GoogleAnalytics measurementId={loaderData?.gaId} />
        <MicrosoftClarity projectId={loaderData?.clarityId} />
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
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "An Error Occurred";
  let message = "An unexpected error occurred.";
  let code: 403 | 404 | 418 | 500 | 503 = 500;

  if (isRouteErrorResponse(error)) {
    code = error.status === 404 ? 404 : error.status === 403 ? 403 : 500;
    title = error.status === 404 ? "Comic Panel Not Found!" : "Error Encountered";
    message =
      error.status === 404
        ? "The requested page or comic could not be found."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-16 flex items-center justify-center">
        <ErrorViewCard
          code={code}
          title={title}
          description={message}
          error={error}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
