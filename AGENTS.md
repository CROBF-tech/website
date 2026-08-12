# CROBF Website — Agent Notes

Repo: Astro 7 + React + Tailwind CSS v4 + Vercel. Bilingual (es/en) corporate site and blog in a single Astro app. The README still claims there is a separate `Blog` project — that is stale; the blog lives here under `src/pages/[lang]/blog`.

## Developer commands

- `pnpm install` — dependencies are managed with pnpm (lockfile `pnpm-lock.yaml`). npm in the README is outdated guidance.
- `pnpm dev` — dev server on `localhost:4321`.
- `pnpm build` — runs `astro check && astro build` (typecheck + build).
- `pnpm preview` — preview the production build.
- `node scripts/sync-blog-frontmatter.mjs` — regenerates blog frontmatter (`description`, `tags`, `readingTime`, `author`) in `src/content/blog/es` and `src/content/blog/en`.

## Project structure

- `src/pages/index.astro` — 301 redirect to `/es`.
- `src/pages/[lang]/` — all real routes. `lang` is `es` or `en`.
- `src/middleware.ts` — enforces language routing via cookie `prefered_language` and redirects root/unknown paths to the preferred language. Query `?lang=en` is a temporary override.
- `src/i18n/` — translation strings and `defaultLang = 'es'`.
- `src/content/blog/{es,en}/` — MD/MDX posts consumed via `src/content.config.ts`.
- `src/content/founder/{es,en}/` — founder profiles consumed the same way.
- `src/components/ui/` — shadcn-style React components.
- `src/styles/global.css` — Tailwind v4 entry with `@import "tailwindcss"` and `@import "tw-animate-css"`.

## Toolchain specifics

- Tailwind CSS v4 via `@tailwindcss/vite` plugin; no `tailwind.config.js`. Uses CSS-first configuration in `src/styles/global.css`.
- shadcn/ui configured with `radix-nova` style; aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.
- Sass is configured in Vite with the modern-compiler API (`api: "modern-compiler"`).
- Astro output is `server` and adapter is `@astrojs/vercel`.
- Contact form uses Web3Forms; `MAIL_KEY` is required at runtime. See `.env.example`.

## Code style

- 4-space indentation for everything (per `.editorconfig`).
- Single quotes for JS/TS/TSX; double quotes for HTML, CSS, and Astro.
- `max_line_length = 120`.
- Import aliases resolve through `src/*` (`@/*`).

## Writing and editing content

- Blog posts must live under `src/content/blog/es` or `src/content/blog/en` and follow the schema in `src/content.config.ts` (`title`, `pubDate`, etc.).
- Run `node scripts/sync-blog-frontmatter.mjs` after adding or heavily editing posts to keep `description`, `tags`, and `readingTime` in sync.
- Adding or renaming founder profiles: keep both `src/content/founder/es/` and `src/content/founder/en/` entries in sync, and follow the existing slug naming.

## Verification before committing

1. `pnpm build` (catches type errors via `astro check` and build failures).
2. `pnpm preview` if you changed routing or SSR behavior.

There are no unit tests, no lint script, and no CI workflow in this repo; `pnpm build` is the primary gate.

## Deploy

- Production target: Vercel (`@astrojs/vercel` adapter, `output: "server"`).
- No `Blog` sub-project to deploy separately anymore.

## Common mistakes to avoid

- Do not run `npm install`; use `pnpm install`.
- Do not look for a separate `Blog/` project at the root; the README is outdated.
- Do not import `@/*` aliases without confirming files are under `src/`; the tsconfig path maps to `src/*`.
- Do not change `defaultLang` lightly; middleware, redirects, and i18n fallbacks all depend on `es` being the default.
