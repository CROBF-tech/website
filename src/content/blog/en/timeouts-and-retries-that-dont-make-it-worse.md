---
title: 'API timeouts and retries that don''t make it worse'
description: 'A practical guide for small teams: how to set API timeouts and retries without making the failure worse, with exponential backoff and jitter, idempotency keys, and how to tell 429, 5xx and timeouts apart in TypeScript.'
pubDate: '2026-10-09'
heroImage: '/blog/timeouts-and-retries-that-dont-make-it-worse.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 4
featured: false
---
Every API call has a failure rate greater than zero. The network drops, the service on the other side deploys mid-call, your request lands in a saturated queue. That's normal, and it's never going to stop happening. What shouldn't be normal is what happens next: your system hanging forever, or retries multiplying the original damage — two charges, three emails, one stuck queue.

This post is the short, practical version of what I look at first when working with small teams: where to put timeouts, when to retry and when not to, and how to keep your retry function from being the most dangerous part of the system. None of this is advanced; it's the baseline you want settled before the first incident, not after.

## 1. Timeouts first, everything else after

An HTTP client without a timeout trusts that the other side will eventually answer. Sometimes it does. When it doesn't, your process waits forever and resources (connections, workers, concurrency limits) fill up until everything falls over together. The first change is always the same one:

```ts
// bad: if the other side freezes, so does your worker
const res = await fetch(url);
```

```ts
// good: explicit timeout, sized to a budget you can actually afford to wait
const res = await fetch(url, {
  signal: AbortSignal.timeout(3_000),
});
```

`AbortSignal.timeout` works in modern Node and in the browser, so you don't need to wire anything by hand. The hard part isn't the code, it's choosing the number. A simple rule I use: your timeout must be smaller than the timeout of whoever calls you. If your endpoint has a 10-second budget and you make three 10-second retries, that budget is already unmeetable. Work inside-out: internal retries always add up to less than the caller's timeout.

## 2. 429, 5xx and timeouts are not the same

The most common design mistake is treating every failure as "retry now". They're not equal:

- **429:** the other side is telling you "slow down". Retrying the next second is exactly the wrong move. If there's a `Retry-After` header, respect it.
- **5xx:** the server failed, often transiently. A retry candidate, with backoff and a bounded number of attempts.
- **Timeout:** the worst of the three, because the state is unknown. Your request may have arrived and been processed anyway. Retrying blind here is like swiping the card again without knowing whether it already went through.

A minimal classifier keeps all of this straight:

```ts
// good: decide based on the response, not on intuition
function retry(status: number): boolean {
  return status === 429 || status >= 500;
}
```

Anything outside that group (400, 401, 403, 404) should go straight to the error path: retrying it will fail exactly the same way five times.

## 3. Backoff with jitter, not retry bursts

The second classic mistake is retrying immediately, on a fixed cadence. When a service starts degrading, all your clients share the same clock: if ten thousand failed users retry a second later, you've built a second storm synced perfectly onto a service that was already struggling. Exponential backoff spaces out the wait; jitter adds randomness so nobody shares the same millisecond:

```ts
// bad: fixed wait, no jitter, everyone retries together
await sleep(1_000);
```

```ts
// good: exponential backoff + jitter
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withBackoff<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      const base = 500;
      await sleep(base * 2 ** i + Math.random() * base);
    }
  }
  throw new Error("out of attempts");
}
```

With three attempts plus jitter, ten thousand clients spread their retries across a window instead of stacking into one spike. It's one line of code that prevents an entire class of incidents.

## 4. Idempotency keys for POSTs

GETs are nearly free to retry, because reading twice changes nothing. POSTs aren't: creating twice means two resources. That's where the idempotency key comes in — you generate one key per business operation, send it in the header, and the other side can recognize it and return the same result instead of duplicating the work.

```ts
// good: one key per business transaction, not per retry
async function createOrder(customerId: string, cart: Item[]) {
  const idempotencyKey = crypto.randomUUID();

  return fetch("https://api.mypayments.dev/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    signal: AbortSignal.timeout(3_000),
    body: JSON.stringify({ customerId, cart }),
  });
}
```

Here's the detail that breaks everything most often: the key has to live at the level of the operation, not the retry. If you generate it inside the retry loop, every retry is a new order and you gained nothing. With this in place, your timeout stops being a bomb: if the response comes back late, the retry carrying the same key collides with the first one and duplicates nothing.

## 5. Three mistakes that make the failure worse

If I had to summarize where I've seen the most damage caused by retry "solutions", it's these three:

1. **Retrying non-idempotent writes.** A payment POST retried twice is two charges. If you can't use idempotency keys, don't auto-retry writes: show the error to the user and let them decide.
2. **Retries without jitter.** A fixed cadence syncs all your clients against the same struggling service. Jitter is one line that prevents an entire class of incidents.
3. **Infinite retry loops.** A `while (true)` with an empty `catch` turns a five-minute incident into a full outage. Every retry needs a ceiling: three attempts, a clear error, and a system that stays alive.

All three share the same root: mistaking "make it work again" for "make more attempts". Retrying doesn't fix the failure; it only decides how much you amplify it.

## Wrapping up

None of these pieces is complicated: a timeout, a bounded number of attempts, some jitter, an idempotency key. The hard part is agreeing that retries are part of your system's behavior, not a patch bolted on after an incident. If your team is building against APIs and you want to check how your retries look today, start with this question: what happens if the other side answers twice as slow as I expect? Your honest answer is usually the best place to start. And if you want to talk it through, that's exactly the kind of thing we enjoy at CROBF.