<div align="center">

# KomikHQ

**Read manga, manhwa, manhua, and more in Bahasa Indonesia.**

[![Read on KomikHQ](https://img.shields.io/badge/Read-KomikHQ-0D1117?style=for-the-badge&logo=github&logoColor=white)](https://komikhq.com)
[![Astro](https://img.shields.io/badge/Web-Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/Interactive-React-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Platform-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)

---

_A free, distraction-free place to discover comics and enjoy a seamless reading experience._

</div>

---

## Welcome to KomikHQ

KomikHQ is a web platform for discovering and reading manga, manhwa, manhua, and other comics in Indonesian. Browse a changing catalog, find your next series, and read chapters in a continuous vertical reader. The experience is designed to keep the focus on the story, with no intrusive advertisements.

This repository contains the Astro-powered web application. The companion API is maintained in the [`api`](https://github.com/komikhq/api) repository and included here as a Git submodule.

## Made for readers

- Discover trending, popular, and recently added comics.
- Browse the catalog by genre and other available filters.
- Read chapters in a continuous, scroll-based reader and move between chapters.
- Sign in to save bookmarks and reading history across visits.
- Join comic discussions through comments, with spoiler controls and comment reporting.
- Choose a light or dark appearance.
- Read without intrusive advertisements.

---

## How the project is built

The web application uses Astro for server-rendered pages and Cloudflare Workers deployment, with React for interactive features. Tailwind CSS provides styling. The API is a separate Hono-based Cloudflare Worker; it uses Better Auth for authentication and Drizzle ORM with PostgreSQL for data access.

| Area                      | Technologies                         |
| ------------------------- | ------------------------------------ |
| Web application           | Astro, React, TypeScript             |
| Styling and interface     | Tailwind CSS, Base UI, Radix UI      |
| API                       | Hono, Cloudflare Workers             |
| Authentication and data   | Better Auth, Drizzle ORM, PostgreSQL |
| Hosting and edge services | Cloudflare Workers                   |

For more about KomikHQ's engineering direction, visit the [organization profile](https://github.com/komikhq/.github/blob/main/profile/README.md).

---

## Run locally

### Requirements

- Node.js `24.21.0`
- pnpm `12.3.4`

Install the frontend dependencies and check out the API submodule:

```bash
pnpm install
git submodule update --init --recursive
```

Create a local frontend variables file from the example:

```bash
cp .dev.vars.example .dev.vars
```

Set the local API URL and any other required values in `.dev.vars`. Start the web application:

```bash
pnpm dev
```

The frontend expects the API to be available at `http://localhost:8787` by default. To run the API locally, open a second terminal:

```bash
cd api
pnpm install
cp .dev.vars.example .dev.vars
pnpm dev
```

Fill in the API's required local settings, including a PostgreSQL connection and authentication configuration, before starting it. Keep `.dev.vars` files and all credentials out of version control.

## Project commands

Run these commands from the repository root:

| Command          | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `pnpm dev`       | Start the Astro development server                 |
| `pnpm build`     | Build the web application                          |
| `pnpm preview`   | Preview the production build locally               |
| `pnpm lint`      | Run ESLint                                         |
| `pnpm typecheck` | Run Astro and TypeScript checks                    |
| `pnpm deploy`    | Build and deploy the web application with Wrangler |

The API is maintained in its own repository and has separate scripts and dependencies. See the [API repository](https://github.com/komikhq/api) and its [deployment guide](https://github.com/komikhq/api/blob/main/DEPLOYMENT.md) for API commands and deployment information. For web deployment details, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## Policies and contact

KomikHQ's reader-facing policies and contact information are available on the website:

- [Terms of Service](https://komikhq.com/terms)
- [Privacy Policy](https://komikhq.com/privacy)
- [Copyright and DMCA](https://komikhq.com/dmca)
- [Contact KomikHQ](https://komikhq.com/contact)

---

## Contributing

Bug reports and ideas that improve the reader experience are welcome through [GitHub Issues](https://github.com/komikhq/komikhq/issues). For code changes, open a pull request with a clear description of the change and the checks you ran. Do not include private user data, credentials, or copyrighted comic content in issues or pull requests.

---

<div align="center">

<sub>Built for readers by the KomikHQ team.</sub>

</div>
