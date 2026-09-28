---
title: 'Astro and bilingual sites: structuring a corporate site in Spanish and English'
description: 'A bilingual site is more than translated copy. In Astro you can split language-prefixed routes, content collections, and middleware so the experience stays coherent. Here is how we approach it on a real corporate site.'
pubDate: 'Sep 28 2026'
heroImage: '/blog/astro_and_bilingual_sites.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 3
---
When a corporate site needs to live in **Spanish** and **English**, the hard part is not only translating copy. You have to decide how URLs are structured, where content lives, what happens when someone lands without a language segment, and how you keep one language’s blog from leaking into the other.

At **CROBF** we solved this with **Astro**: a single project, language-prefixed routes, and separate content collections. This post walks through the approach we use and why it scales better than hand-duplicating the whole site.

## Why Astro fits

Astro shines when most of the site is content (landing, about, blog) and only a few islands need interactivity. For a bilingual site that helps because:

- You can ship pages per language without dragging a heavy client framework into every view.
- Content can live in **Markdown/MDX** behind a typed schema.
- Folder structure makes it obvious what belongs to `es` and what belongs to `en`.

You do not need a monorepo with two apps (“Web” and “Blog”) just because of language. One Astro app is enough if routes and content are modeled clearly.

## The pattern: language prefix in the URL

The foundation is simple: **every real route lives under `/{lang}/...`**, where `lang` is `es` or `en`.

Examples:

- `/es` — Spanish home
- `/en` — English home
- `/es/blog` — blog index
- `/es/blog/my-article` — a post

The root `/` does not try to guess endlessly: it redirects to the default language (in our case, **Spanish**).

That prefix does three things at once:

1. Makes the language **explicit** (good for SEO and shareable links).
2. Simplifies routing: the first URL segment is the source of truth.
3. Lets you filter content collections by language without clever hacks.

## Content collections: one blog, two folders

In Astro the blog is not a database: it is files. We use:

```text
src/content/blog/es/...
src/content/blog/en/...
```

Each post has frontmatter (`title`, `pubDate`, `author`, `tags`, and so on) plus a Markdown or MDX body. The schema (Zod) keeps posts from landing without a title or a date.

Practical upsides:

- A writer can edit only the language they own.
- You can ship one language first and fill in the other later (yes, that happens).
- The blog index filters by `lang` and you are done: English posts do not show up under `/es/blog`.

Tip: agree on filename and frontmatter conventions (`author: 'Juan Beresiarte'`, readable dates, consistent tags). A small script that refreshes `description`, `tags`, and `readingTime` saves a lot of drift.

## UI strings vs editorial content

Not everything is a post. Buttons, “Back to blog”, share labels, and empty states live in an **i18n** module (`es`/`en` dictionaries), not in Markdown.

Practical rule:

- **Editorial content** (articles, bios, long pages) → `src/content/...`
- **UI chrome** (labels, short CTAs) → `src/i18n/...`

Mixing the two leads to half-translated screens and PRs that are painful to review.

## Middleware: remember the visitor’s language

On top of the URL prefix, we use middleware that:

- Reads a language-preference cookie.
- If someone hits a path without a valid language, redirects to the preferred or default language.
- Allows a one-off override with `?lang=en` without immediately overwriting the cookie.

The goal is not to fight the visitor: once they chose English, internal links and redirects should not bounce them back to Spanish by accident.

Watch out for assets: images, `_astro`, `robots.txt`, and similar paths must **not** go through that redirect logic. Otherwise you end up “translating” a `.png`.

## Checklist before you add a language (or a post)

1. Does the route include `/{lang}/`?
2. Is editorial content in the correct language folder?
3. Do UI strings exist in both dictionaries?
4. Is frontmatter still valid (title, date, author)?
5. Did you run the build (`pnpm build`)? Schema typos and broken imports show up there.

## Common mistakes

- **Duplicating the entire project** per language. Double maintenance, asymmetric bugs.
- **Translating only the home** and leaving the blog monolingual without saying so.
- **Reusing filenames across languages without a strategy**. Filenames may differ (`astro-y-sitios-bilingues` vs `astro-and-bilingual-sites`); what matters is that list and detail views filter by language.
- **Hardcoding UI copy in components** “for later”. Later never comes.
- **Forgetting the default language** in redirects and SEO.

## Conclusion

A bilingual Astro site works when language is part of the **architecture**, not an afterthought:

- Language-prefixed URLs `/{lang}`
- Content collections per language
- Dictionaries for UI chrome
- Middleware that respects visitor preference

That is what let us unify the corporate site and the blog in a single Astro repo, with Spanish as the primary language and English as a first-class citizen.

If you are building something similar and get stuck on routing or content modeling, at CROBF we like to settle those decisions early: they are cheaper than poorly translating two hundred components later.
