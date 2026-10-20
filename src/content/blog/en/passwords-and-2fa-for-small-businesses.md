---
title: 'Passwords and 2FA for small businesses: the minimum that keeps a stolen login from sidelining you'
description: 'A team password manager, two-factor authentication on the accounts that matter, and a plan for when someone leaves: small, cheap changes that stop one compromised login from locking your business out.'
pubDate: '2026-10-20'
heroImage: '/blog/passwords-and-2fa-for-small-businesses.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 7
featured: false
---
I work with small companies, and whenever security comes up the conversation starts the same way: "we're too small to be a target." I get the logic, but it misses how this plays out: nobody really picks you. A weak password, reused for years, ends up in someone else's hands. Avoiding that takes no IT knowledge; it takes order in two or three places.

## 1. It's almost never a genius hacker

When a small company gets locked out of its own accounts, the explanation is usually mundane:

- **Reused passwords.** The same key on email, banking and a service that had a breach. You reuse out of convenience, and somebody else's leak becomes your problem.
- **Passwords shared over chat.** The social media login rotating on WhatsApp among three people. Every send leaves copies in chats nobody deletes; when someone leaves they take the key with them — or leave it, forever.
- **Passwords written down.** Writing them isn't the problem; the location is: a notebook at the counter, or a "passwords.xls" file in the shared folder.

People who break into accounts rarely guess: they try credentials that already leaked from other services, betting on reuse. That's called credential stuffing, and it's one of the most common attacks. Without repetition, and with a second factor where it matters, that attack stops working. It doesn't make you untouchable (more on what can get past a code below), but it takes you out of the pile of easy targets.

## 2. One password manager for the whole team

A password manager is a vault: each person signs in with their master password and, from there, uses the work passwords they need. Bitwarden and 1Password are the best known; anything similar works to start. The brand matters less than the setup:

- **A personal vault per person.** Their master password is private; nobody else should know it.
- **A shared vault per area.** Billing, social media, operations: whatever the team shares goes there, not in chats.
- **Few hands administering.** One or two people with permission to invite, remove and create vaults.

What goes in? Passwords, and whatever lives in that loose spreadsheet: a note per service (owner, contact), security question answers, recovery codes for your other services. The manager's own recovery codes are the exception: those live outside it, printed or somewhere else safe, because if you lose access to the manager you won't be able to open it to look them up. And one rule that shifts the culture: nothing in the vault goes over chat; the vault exists so nothing has to be sent.

## 3. Two-factor: where to turn it on first

Two-factor adds "something you have" — a rotating code on your phone, or a physical key — to "something you know," the password. A stolen password stops being enough on its own.

Where to start, in order:

1. **Company email.** Whoever controls your inbox resets the rest through "forgot password." First, no debate.
2. **Banking and invoicing.** Whatever moves money directly.
3. **Domain and hosting.** Whoever takes the domain gets your website and, along the way, your email; getting it back is a chore.
4. **Social media and ad accounts.** Recovering a hijacked account is slow and sometimes impossible: better that nobody gets in.
5. **The password manager itself.** If its master password is the only barrier, add the factor.

**Authenticator app or SMS?** An authenticator app (Google Authenticator, Microsoft Authenticator, and others) generates the code on your phone itself. SMS depends on the number still being yours, and that's its weak spot. The main risk is SIM swapping: someone talks your carrier into moving your number to another SIM, and from then on your codes go to them. On top of that, if a line is cancelled or reassigned, the code can end up on somebody else's phone. Where you can choose, app; SMS only when there's no alternative.

**What two-factor stops, and what it doesn't.** It's very good against credential stuffing: a leaked password alone isn't enough. But an app code can be bypassed. With real-time phishing, a fake page asks for your password and code and replays them on the real site within seconds. With push or notification fatigue, attackers flood your phone with "is this you?" prompts until someone taps "approve" just to make it stop. The defense is habit: never type a code into a page you reached from a link in an email or chat, and never approve a sign-in you didn't start. What resists phishing best are hardware keys and passkeys, because they only answer to the real site.

**Physical keys.** For the most critical logins — the email admin, the manager's owner — there's the physical key: a small device you plug in over USB or, if it supports NFC, tap against your phone when signing in. Passkeys, which more and more services offer, follow the same idea using your own phone or computer, with no codes to type. It's not urgent for the whole team, but it's worth it for the two or three accounts you can't afford to lose.

**Recovery codes.** Enabling it also gives you backup codes for when the phone isn't there. Store them in the vault or printed in an envelope, but not in the inbox they protect: the day you lose it is exactly the day you can't get back in there. The same goes for the manager, and it's the case people forget most: its recovery codes can't live inside the manager. Print them and keep them somewhere safe and separate that doesn't depend on it.

## 4. People joining and leaving: what to change when someone leaves

If shared passwords lived in the team vault, a departure is a short to-do list: remove their access, rotate the passwords from there, and the rest of the team barely notices. If they lived in that person's personal vault — or worse, on their WhatsApp — the last day gets tense.

Offboarding checklist:

- [ ] List everything they used: email, manager, social media, invoicing, everyday tools.
- [ ] Remove their access from the manager and move whatever the team still needs into the shared vault.
- [ ] Change the password of every shared account they knew, and save the new one in the vault (if it wasn't there yet, now's the time).
- [ ] Sign their active sessions out of sensitive accounts.
- [ ] Check they're no longer an owner or admin on the domain, social media or ad campaigns.
- [ ] Unlink their phone from two-factor before they leave, and link the replacement's.
- [ ] Decide what happens with their mailbox: forward it or close it.

Onboarding runs the same logic in reverse from day one: their own account (never a shared login), access to their team's vault, two-factor on, and a named owner per account.

## 5. Common mistakes

Everything above comes undone in familiar ways:

- **A weak or shared master password.** It opens everything else: unique, long, and known by exactly one person.
- **Two-factor everywhere except email.** The rest gets recovered through email; if it falls, it all falls.
- **Recovery codes stored in the inbox they protect, or the manager's codes inside the manager.** That's leaving the spare keys inside the locked safe.
- **"I'll just send it over WhatsApp."** If it's in the vault, there's nothing to send.
- **One person knows it all.** Master password, factor and codes on one phone are a single point of failure; keep a documented alternative, however rarely used.
- **Key accounts on personal emails.** A domain registered to the personal email of whoever set it up becomes a problem at exactly the wrong moment.
- **Measures that last a week.** If the process is more annoying than the risk, the team goes back to chat. Choose frictions your day-to-day can live with, and hold them.

## 6. A realistic starting point: one afternoon

Instead of an annual plan, book one afternoon. By the end of it, email, money and everything critical are tidy and behind two factors.

1. **List the accounts (half an hour).** Email, bank, invoicing, domain, social media, ads, everyday tools. Longer than you expected; that's fine.
2. **Pick the manager and create the team vault (one hour).** One shared vault is enough; split by area later.
3. **Move those passwords in (one hour).** Change the important ones as you go, so nobody keeps the old ones.
4. **Two-factor on company email (twenty minutes).** With an authenticator app and the recovery codes in the vault.
5. **Two-factor on the rest (whatever's left of the afternoon).** Bank, domain, social media and the manager, in that order. The manager's recovery codes get printed and kept outside it.
6. **Note who owns each account (fifteen minutes).** A small spreadsheet or a note in the vault is enough.
7. **Leave the leftovers in writing.** Whatever didn't fit goes on a list for next week, with names attached — not filed under "someday."

## To wrap up

None of this makes a company bulletproof, and I don't buy the promises that claim it does. But there's an enormous difference between a stolen login taking your business out of the game and the same theft costing you an afternoon of cleanup. A vault, a second factor and a named owner per account rank among the cheapest, least glamorous things you'll do this year, and they're exactly what prevents the big bad day. There's always more to do after that; start with email on Monday — that one covers most of the ground. And if you ever want a second pair of eyes on your setup, that's what CROBF is for.