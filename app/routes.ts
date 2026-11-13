import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // 1. Beranda
  index("routes/home/route.tsx"),

  // 2. Eksplorasi & Katalog
  route("browse", "routes/browse/route.tsx"),
  route("list-all", "routes/list-all/route.tsx"),

  // 3. Komik & Reader
  route("komik/:slug", "routes/comic/detail/route.tsx"),
  route("komik/:slug/:chapterSlug", "routes/comic/reader/route.tsx"),

  // 4. Autentikasi
  route("login", "routes/auth/login/route.tsx"),
  route("register", "routes/auth/register/route.tsx"),
  route("verify-email", "routes/auth/verify-email/route.tsx"),
  route("forgot-password", "routes/auth/forgot-password/route.tsx"),
  route("reset-password", "routes/auth/reset-password/route.tsx"),

  // 5. Akun & Perpustakaan Pengguna
  layout("routes/account/layout.tsx", [
    route("account", "routes/account/profile/route.tsx"),
    route("account/settings", "routes/account/settings/route.tsx"),
  ]),
  route("bookmark", "routes/account/bookmarks/route.tsx"),
  route("history", "routes/account/history/route.tsx"),

  // 6. Admin Dashboard (Nested Layout)
  layout("routes/dashboard/layout.tsx", [
    route("dashboard", "routes/dashboard/overview/route.tsx"),
    route("dashboard/comics", "routes/dashboard/comics/route.tsx"),
    route("dashboard/comics/:id", "routes/dashboard/comics/detail/route.tsx"),
    route("dashboard/genres", "routes/dashboard/genres/route.tsx"),
    route("dashboard/users", "routes/dashboard/users/route.tsx"),
    route("dashboard/moderation", "routes/dashboard/moderation/route.tsx"),
    route("dashboard/analytics", "routes/dashboard/analytics/route.tsx"),
    route("dashboard/settings", "routes/dashboard/settings/route.tsx"),
  ]),

  // 7. Legal & Kebijakan (Pure Dynamic Routing by Markdown File)
  route("legal/:slug", "routes/legal/route.tsx"),
  route("legal/:slug.md", "routes/legal/route.md.ts"),

  // 8. Resource Routes (Sitemaps)
  route("sitemap.xml", "routes/resources/sitemap.xml.ts"),
  route("sitemap-pages.xml", "routes/resources/sitemap-pages.xml.ts"),
  route("sitemap-comics.xml", "routes/resources/sitemap-comics.xml.ts"),
  route("sitemap-chapters.xml", "routes/resources/sitemap-chapters.xml.ts"),
] satisfies RouteConfig;
