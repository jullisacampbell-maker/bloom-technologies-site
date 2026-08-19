# Bloom Technologies Site — Architecture

> **Repository purpose:** Public corporate website for Bloom Technologies.  
> **Last reviewed:** August 2026

This repository is the **Bloom Technologies company marketing site** — not the customer-facing Bloom Family Tech product.

---

## What lives here

| Category | Examples |
|----------|----------|
| Company marketing | Home, About, Founder, Products, Contact, Blog (coming soon) |
| Brand & design | Forest green / navy / cream palette, editorial typography |
| Lead generation | Contact form, optional Founding Family waitlist component |
| Outbound links | Links to the live product at [bloom-dashboard](https://github.com/jullisacampbell-maker/bloom-dashboard) |

## What does NOT live here

The customer product — Bloom Family Tech, Bloom Home, Bloom Academy modules, Free Resource Vault, My School, Print + Prep, and related application state — lives in the separate **bloom-dashboard** repository, deployed at:

`https://jullisacampbell-maker.github.io/bloom-dashboard/`

Do not re-implement product dashboards, vaults, or family-app routes in this repo.

---

## Stack

| Tool | Role |
|------|------|
| React 19 | UI |
| React Router 7 | Client-side routing (`/`, `/products`, `/about`, `/founder`, `/blog`, `/contact`) |
| Vite 6 | Dev server and production build → `dist/` |

No backend, database, or authentication.

---

## Key files

| Path | Purpose |
|------|---------|
| `src/data/ecosystem.js` | Product copy, outbound URLs, company principles |
| `src/data/navigation.js` | Corporate nav links and primary product CTA |
| `public/assets/founder-cartoon.png` | Founder portrait |

Product URLs point to bloom-dashboard pages (resource vault, Bloom Home, Academy, Meals, Athletics, Family Fit).

---

## Relationship to Bloom Family Tech

```
Bloom Technologies (this repo — corporate site)
        ↓ links out to
Bloom Family Tech (bloom-dashboard — customer product)
        ↓ powered by
Bloom OS (described on both; experienced in bloom-dashboard)
```

---

## Deploy

Static hosting of the Vite `dist/` folder. No server-side rendering.
