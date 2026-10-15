---
title: 'Domain and business email for small businesses: own the domain, get mail delivered'
description: 'A practical guide for small businesses: why your own domain and professional email matter, how to keep the domain in the company’s name, basic DNS, SPF/DKIM/DMARC, and common mistakes.'
pubDate: '2026-10-15'
heroImage: '/blog/domain-and-business-email-for-small-businesses.png'
author: 'Juan Beresiarte'
tags:
  - 'Software'
readingTime: 5
featured: false
---
Your customer emails `juan@gmail.com` and you reply from there. It works—until it doesn’t: a vendor walks away with the domain account, a former employee was the only one with the registrar password, or your quotes land straight in spam. The problem is rarely “we don’t have a website.” It’s not owning the business’s digital identity.

Your own domain and professional email aren’t a big-company luxury. They’re the internet address of the company: where people find you, write to you, and decide whether you look real. Here’s a practical guide so the domain is actually yours and your mail gets delivered.

## 1. Why @yourdomain.com is not the same as @gmail.com

Free email is fine to start. For a small business that invoices, quotes, and signs contracts, it sends a different signal:

- **Trust.** `sales@yourcompany.com` reads as a company. `yourcompany.sales99@gmail.com` reads as improvised.
- **Continuity.** When someone leaves, the company mailbox stays. The personal mailbox does not.
- **Brand.** The domain shows up on the site, invoices, signatures, and search. It’s the name you control.

You don’t need an on-prem mail server. Most small businesses use a professional email provider tied to the domain. The brand of the provider matters less than this: **the domain is in your name**, and you can switch providers if you need to.

## 2. The domain must belong to the company, not “whoever registered it”

This is the expensive mistake I see most often: the domain was registered by the designer, the cousin who “knew computers,” or an employee who already left. While everything works, nobody notices. The day you need to renew, migrate, or recover access, you discover the registrar account isn’t yours.

Ownership checklist:

- [ ] The registrar account (where you pay for the domain) is in the company’s or a partner’s name—not an outside vendor’s
- [ ] More than one person has access (or credentials live in the company’s shared password manager)
- [ ] The registrar contact email is a company address, not someone’s personal Gmail
- [ ] You know the expiry date and auto-renew is on
- [ ] You have invoices or receipts showing you pay for the domain

If the domain currently “lives” in a third party’s account, transfer it. It’s a boring process and worth more than any site redesign.

## 3. Renewal: an expired domain is a lost domain

Domains aren’t forever. They renew yearly (sometimes longer). If one expires and nobody notices, it can enter a grace period, then an expensive redemption phase, then become available to anyone—including a competitor or a squatter.

Minimum practices:

1. Turn on **auto-renew** at the registrar
2. Put a calendar reminder 30 days before expiry (in case payment fails)
3. Use a payment method that won’t silently expire
4. Once a year, review who still has access to that account

The cost of renewing a `.com` is tiny next to the cost of recovering a lost domain. This is not where you save attention.

## 4. DNS in plain language: A, CNAME, and MX

DNS is the internet’s address book. Your domain isn’t the website or the email—it *points* to them with records. The three that matter most:

- **A:** says “this name (for example `yourdomain.com` or `www`) lives at this IP address.” Typical for the website.
- **CNAME:** says “this name is an alias of another name.” Useful for `www` pointing at the same place as the root, or for third-party services.
- **MX:** says “mail for this domain is handled by this server.” Wrong or missing MX means mail doesn’t arrive (or arrives in the wrong place).

You don’t need to memorize the RFC. You need to know **who administers DNS** (sometimes the registrar, sometimes the host) and be able to log into that panel. If you can’t get in, you don’t really control the domain.

When you change hosting or email, you’ll almost always touch these records. Ask the new provider for the exact list and change them one at a time, calmly. A bad MX can leave the company without email in minutes.

## 5. SPF, DKIM, and DMARC: why your mail goes to spam

Here’s the frustration I hear most: “We have our own domain and we still land in spam.” Mail authentication is usually missing. In plain terms:

- **SPF:** a public list of who is allowed to send mail as your domain.
- **DKIM:** a cryptographic signature the server adds to each message to prove it wasn’t altered.
- **DMARC:** the policy for what to do when SPF or DKIM fail, and (optionally) where to send reports.

Without these records, Gmail, Outlook, and friends treat your domain as suspicious. It isn’t personal—it’s basic internet hygiene.

Generic examples (replace `example.com` and the values with what your email provider gives you):

```text
; SPF — TXT at example.com
v=spf1 include:_spf.example-provider.com ~all

; DKIM — TXT at selector._domainkey.example.com
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...public-key...

; DMARC — TXT at _dmarc.example.com
v=DMARC1; p=none; rua=mailto:dmarc@example.com
```

Start DMARC with `p=none` to observe, then tighten to `quarantine` or `reject` once you’re sure all legitimate mail is authenticated. Your email provider almost always gives you the exact values—copy them; don’t invent them.

## 6. Personal mailboxes, aliases, and what happens when someone leaves

Don’t organize email only around people. Organize it around **roles**:

- `info@`, `sales@`, `support@`, `billing@` — aliases or shared mailboxes that survive hiring and exits
- `firstname.lastname@` — personal mailboxes for day-to-day work

When someone leaves:

1. Revoke access the same day (password, 2FA, devices)
2. Forward or share the mailbox for as long as you need
3. Remove that person from the registrar, DNS, and email admin panel
4. Check signatures, distribution lists, and automatic forwards

Email offboarding matters as much as collecting the laptop. If access stays live, the domain is “yours” only on paper.

## 7. Quick checklist (one afternoon is enough)

- [ ] Domain registered under the company’s name/account
- [ ] Registrar access documented and shared with more than one person
- [ ] Auto-renew ON + reminder 30 days before expiry
- [ ] You know where DNS is edited
- [ ] A/CNAME records point to the right site
- [ ] MX records point to the current email provider
- [ ] SPF, DKIM, and DMARC published per the provider
- [ ] Role mailboxes (`info@`, `sales@`, etc.) in addition to personal ones
- [ ] Exit procedure: revoke access + redirect mail

## 8. Common mistakes

- **Leaving the domain in the web vendor’s account “because they handle it.”** They can help; ownership should be yours.
- **One human with every password.** Vacation, resignation, or a lost phone becomes an incident.
- **Buying the domain and never setting SPF/DKIM/DMARC.** A pretty domain doesn’t help if mail doesn’t arrive.
- **Using only personal mailboxes.** The day “sales” leaves, customer memory leaves with them.
- **Changing hosts and forgetting MX.** The new site works; email dies quietly.
- **Turning off auto-renew “to control spend.”** You control spend; you lose the domain.

## Closing

Your own domain and business email aren’t a marketing project—they’re small infrastructure with large consequences. If you still depend on a personal Gmail, a registrar you don’t own, or DNS nobody can edit, you don’t need a full redesign. You need to fix ownership, renewal, and authentication.

If you want a second pair of eyes on how your domain and company email are set up, at CROBF we see these issues often with small businesses that prefer clarity before something breaks. The best time to sort it out is a quiet Tuesday—not the Friday the domain expired.
