---
title: 'Feature Flags Without Overengineering'
description: 'When a feature flag earns its keep, how to build a minimal one in TypeScript, and why half the job is deleting it on time. Includes a Friday-deploy story.'
pubDate: '2026-10-05'
heroImage: '/blog/feature-flags-without-overengineering.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 5
featured: false
---
Every feature flag tutorial opens the same way: a polished dashboard, user segmentation, and a monthly invoice. For most of the projects I work on — a freelance engagement with one pair of hands, or a small product run by three people — that's pure overengineering. What you actually need is simpler: turn a feature on or off without pushing another deploy, ideally on a Friday at 6:40 pm, without breaking a sweat.

Here's the minimal system I use today: one typed config file, a helper of about ten lines, and the rule almost nobody tells you: flags are written to be deleted.

## 1. The Friday a flag would have saved

Last year I rewrote the invoice form for a client and, with the code finished and the tests green, I deployed on a Friday evening. Classic. Around 7:15 the client's accountant messaged me: invoices with a coupon discount showed a badly rounded total. The fix itself was three lines, but the only complete rollback was `git revert` and redeploying the previous version — twenty minutes with the client on the other side of the chat, asking whether their sales were being recorded incorrectly.

A flag would have turned all of that into a two-minute call: `FLAG_NEW_INVOICE_LAYOUT=off`, done. Nobody sees the new form until Monday, when I fix the rounding with a clear head and release it properly. The lesson wasn't "write more tests"; it was that deploying and releasing don't have to be the same act.

## 2. When a flag earns its keep — and when it doesn't

A flag is a temporary door that exists to separate deploy from release. It earns its keep when:

- The feature can break more than it fixes: checkout, payments, invoicing, data imports.
- You want to activate gradually: the internal team first, then a percentage of users, then everyone.
- The release depends on something you don't control yet: a migration that runs the next day, a provider that hasn't finished their side.

Skip it when:

- You're naming permanent configuration. The app's language or a plan's limits never get switched off or given a death date: that's config, not a flag.
- The risk is low and you can verify it in staging. A flag there is technical debt for free.
- It has been at 100% for two months. That's not a flag anymore; it's a corpse with production permissions.

Practical rule: if you can't picture the moment you'll delete it, don't create it.

## 3. The implementation: one file

First, what the problem usually looks like:

```ts
// Bad: the decision lives scattered around and hard-coded
if (user.id === "42" || req.headers.get("x-beta") === "1") {
  renderNewForm(); // and if it has to go off... where was this if again?
}
```

The version I use is a single module with three states per flag: `on`, `off`, or a percentage:

```ts
// src/lib/flags.ts
export type FlagValue = "on" | "off" | `${number}`;

const defaults = {
  newInvoiceLayout: "off", // born 2026-09-08; ships in v2.14, then gets deleted
  csvExport: "off", // born 2026-09-20
} satisfies Record<string, FlagValue>;

export type FlagName = keyof typeof defaults;
export type FlagContext = { userId: string };

function envKey(flag: FlagName): string {
  return `FLAG_${flag.replace(/(?=[A-Z])/g, "_").toUpperCase()}`;
}

function parseFlag(raw?: string): FlagValue | undefined {
  if (!raw) return undefined;
  if (raw === "on" || raw === "off") return raw;
  const n = Number(raw);
  const valid = Number.isInteger(n) && n >= 0 && n <= 100;
  return valid ? (`${n}` as FlagValue) : "off";
}

export function isEnabled(flag: FlagName, ctx: FlagContext): boolean {
  const value = parseFlag(process.env[envKey(flag)]) ?? defaults[flag];
  if (value === "on") return true;
  if (value === "off") return false;
  return bucket(`${flag}:${ctx.userId}`) < Number(value);
}
```

And at the call site it reads like a sentence:

```tsx
if (isEnabled("newInvoiceLayout", { userId: user.id })) {
  return <NewInvoiceForm />;
}
```

How it works: the defaults live in the code, which makes them the source of truth — every flag is born `off`, the safe state. The env var (`FLAG_NEW_INVOICE_LAYOUT=on` or `=25`) only overrides. A misspelled value falls back to `off` instead of half-enabling something. This runs server-side as-is (Node, Astro in SSR mode, an API route); if the UI needs the value, pass the resolved flags down as props instead of reading `process.env` in the browser.

## 4. Gradual rollout, no surprises

With `FLAG_CSV_EXPORT=25`, 25% of users see the feature. Which ones? Always the same ones. The percentage is evaluated with a deterministic hash of the userId, because `Math.random()` would flip the feature on and off between requests — impossible to support ("I can see it, my teammate can't").

```ts
// 32-bit FNV-1a, written by hand: zero dependencies
function bucket(key: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % 100;
}
```

The same user always walks through the same door, and growth is monotonic: going from 25 to 50 keeps everyone who already saw it while letting the rest in progressively; lowering the percentage only trims the tail. The `` `${flag}:` `` salt separates each flag's draw: a person can be in the 25% of one flag and out of another, and that means nothing. If you have no userId (anonymous traffic), use the session id — but accept that the same visitor can change doors if their session is regenerated.

And if something breaks mid-rollout: set the env to `0`. Kill switch, zero new code.

## 5. The part nobody does: deleting

A flag has three moments: it's born, it's released, and it dies. The third is the one everyone skips, which is why every repo has a flag from 2019 that nobody dares to touch. Every living flag is two code paths to maintain: tests double, reviews slow down, and six months later nobody remembers why it's off.

The loop I use, in this order:

1. **Born**: default `off`, a comment with the date and the reason. No death date, no merge.
2. **Released**: `on` in the env; once you're confident, the default becomes `on`, keeping the override for a quick rollback for one more cycle.
3. **Deleted**: a couple of weeks after reaching 100%, remove the key from `defaults`, delete the old path and the env var.

TypeScript does the dirty work here: since `FlagName` is `keyof typeof defaults`, removing the key makes every lingering `isEnabled("csvExport", …)` stop compiling. Your cleanup list is literal, self-updating, and impossible to half-do. A `grep -rn "csvExport" src/` catches what the types can't see: strings in tests, comments, docs.

## 6. Common mistakes

- **Unsafe default.** Setting `on` in the code "because it'll probably work". The day the env is missing — a deploy on another machine, someone who didn't know the variable existed — you release half of something you thought was off.
- **Flags that are actually config.** `isPro`, `locale`, `maxItemsPerPlan`: those never get switched off or deleted; they're typed configuration. Handle them separately, without percentages or `FLAG_` prefixes.
- **Tinkering with the hash during an active rollout.** Changing the salt or the algorithm while a flag sits at 30% re-buckets every user: people who could see the feature suddenly can't, halfway through. The salt is born and dies with the flag.
- **Flag on top of flag.** `isEnabled("newFlow", …) && isEnabled("newPricing", …) && !user.isAdmin`: combinations nobody tested, cases nobody saw turn on or off. One flag decides one thing; if you think you need two, write down why.
- **"I'll keep it just in case."** A flag held at 100% for three months, or off for two, protects nothing anymore: it's dead code with a nice name. It gets deleted, not retired.

## 7. Checklist

- [ ] Safe default: `off` in the code; only the env can enable.
- [ ] A single decision point: `isEnabled`; a `grep` for `FLAG_` outside the module returns zero hits.
- [ ] Deterministic, monotonic rollout: same user, same answer, in any request order.
- [ ] Death date and reason written next to the flag itself.
- [ ] A minimal test per flag: `on`, `off`, and exactly the percentage edge.
- [ ] At 100%: default `on`, a one-cycle grace period, and the deletion scheduled — not "when there's time".

The code is the smallest part. What saves your Friday evening is the habit: separate deploy from release, keep the decision in one file, and delete without mercy. How many dead flags does your repo have right now? I counted mine while writing this and regretted it halfway down the list. Small, boring decisions like these — an afternoon of work that gives you whole nights of sleep back — are the ones we keep writing about here at CROBF.
