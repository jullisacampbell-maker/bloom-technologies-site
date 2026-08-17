# Bloom Technologies Site — Architecture Documentation

> **Repository purpose:** Public company marketing website for Bloom Technologies.  
> **Version:** 1.0  
> **Last reviewed:** July 2026

This document describes the current state of the `bloom-technologies-site` repository. It is a **static, client-side marketing site** — not a product application.

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Frameworks Used](#frameworks-used)
3. [Dependencies](#dependencies)
4. [Database Connections](#database-connections)
5. [Authentication Setup](#authentication-setup)
6. [API Routes](#api-routes)
7. [Reusable Components](#reusable-components)
8. [What Belongs Here vs. Bloom HQ](#what-belongs-here-vs-bloom-hq)
9. [Future Integration Points](#future-integration-points)

---

## Current Architecture

### High-level overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
├─────────────────────────────────────────────────────────┤
│  index.html                                              │
│    └── src/main.jsx                                      │
│          └── App.jsx (React Router)                      │
│                ├── Navbar (global)                       │
│                ├── Pages (route-matched)                 │
│                └── Footer (global)                       │
├─────────────────────────────────────────────────────────┤
│  Data layer (static JS modules)                          │
│    src/data/navigation.js                                │
│    src/data/products.js                                  │
│    src/data/foundingFamily.js                            │
├─────────────────────────────────────────────────────────┤
│  Services (client-side placeholders)                     │
│    src/services/foundingFamilySubmission.js              │
│         └── localStorage (temporary)                     │
└─────────────────────────────────────────────────────────┘
```

### Application type

| Attribute | Value |
|-----------|-------|
| Architecture | Single-page application (SPA) |
| Rendering | Client-side only (CSR) |
| Backend | None |
| Server | Static file hosting (Vite build output → `dist/`) |
| State management | Local React `useState` per component |
| Routing | Client-side via React Router |

### Folder structure

```
bloom-technologies-site/
├── public/                  # Static assets served as-is
│   └── favicon.svg
├── src/
│   ├── assets/              # Reserved for future images/illustrations
│   ├── components/          # Reusable UI components
│   ├── data/                # Static content & configuration
│   ├── pages/               # Route-level page components
│   ├── services/            # Client-side service abstractions
│   ├── styles/              # Global design system (CSS)
│   ├── App.jsx              # Root layout + routing
│   └── main.jsx             # React entry point
├── docs/                    # Documentation
├── index.html               # HTML shell
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies & scripts
```

### Request / data flow

1. User visits a URL (e.g. `/products`).
2. Vite serves `index.html` and the JavaScript bundle.
3. React Router matches the path and renders the corresponding page component.
4. Page components compose reusable components and read from static data files.
5. Form submissions (Founding Family, Contact) are handled **entirely in the browser** — no network requests are made to a backend.

### Design system

Global styles live in `src/styles/global.css` and define:

- **Colors:** Forest green palette + cream backgrounds
- **Typography:** DM Sans (body), Instrument Serif (headlines) via Google Fonts
- **Layout utilities:** `.container`, `.section`, `.btn`, `.badge`
- **Animations:** Fade-in, float, smooth scroll

Component-specific styles are co-located as `.css` files next to each component or page.

---

## Frameworks Used

| Framework / Tool | Version | Role |
|------------------|---------|------|
| **React** | ^19.1.0 | UI component library |
| **React DOM** | ^19.1.0 | DOM rendering |
| **React Router DOM** | ^7.6.3 | Client-side routing |
| **Vite** | ^6.3.5 | Dev server, bundler, production build |
| **@vitejs/plugin-react** | ^4.5.2 | JSX/React support in Vite |

### What is NOT used

- No Next.js, Remix, or other meta-framework
- No CSS framework (Tailwind, Bootstrap, etc.)
- No UI component library (MUI, Chakra, etc.)
- No state management library (Redux, Zustand, etc.)
- No testing framework
- No TypeScript (plain JSX)

---

## Dependencies

### Production dependencies

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.3"
}
```

### Development dependencies

```json
{
  "@vitejs/plugin-react": "^4.5.2",
  "vite": "^6.3.5"
}
```

### External services (loaded at runtime, not npm packages)

| Service | Usage |
|---------|-------|
| Google Fonts | DM Sans + Instrument Serif typography |

### npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Local development server (default: `http://localhost:5173`) |
| `build` | `vite build` | Production build → `dist/` |
| `preview` | `vite preview` | Preview production build locally |

---

## Database Connections

**None.**

This repository has no database connection, ORM, or data persistence layer on the server.

### Current client-side storage (placeholder only)

| Storage | Key | Used by |
|---------|-----|---------|
| `localStorage` | `bloom_founding_families` | Founding Family signup form |

Founding Family submissions are appended to a JSON array in the browser's `localStorage`. This is a **temporary placeholder** intended to be replaced by an email marketing provider or backend API.

The Contact form does not persist data at all — it logs to `console.log` and shows a success message.

---

## Authentication Setup

**None.**

This site has:

- No user accounts
- No login / signup flows (beyond marketing waitlist forms)
- No session management
- No JWT, OAuth, or SSO
- No protected routes
- No role-based access control

All pages are publicly accessible.

---

## API Routes

**None.**

There is no backend server and no REST, GraphQL, or RPC API in this repository.

### Client-side routes (React Router)

These are **frontend navigation paths**, not server API endpoints:

| Path | Page component | Description |
|------|----------------|-------------|
| `/` | `Home.jsx` | Landing page with hero, products, mission, founder preview, waitlist |
| `/products` | `Products.jsx` | Detailed product sections |
| `/about` | `About.jsx` | Mission, vision, values, principles |
| `/founder` | `Founder.jsx` | Founder biography (first-person) |
| `/blog` | `Blog.jsx` | "Coming Soon" placeholder |
| `/contact` | `Contact.jsx` | Contact form placeholder |

### Hash anchors

| Anchor | Location |
|--------|----------|
| `/#founding-family` | Founding Family signup section on Home |
| `#follow-bloom` | Social links within waitlist success state |

### Planned integrations (not implemented)

Code comments reference future external integrations:

- Email provider for Founding Family signups (Kit, Mailchimp, ConvertKit, Resend)
- Email service for Contact form
- CMS for blog content

---

## Reusable Components

All reusable components live in `src/components/`.

### Layout & navigation

| Component | File(s) | Purpose | Key props / behavior |
|-----------|---------|---------|----------------------|
| **Navbar** | `Navbar.jsx`, `Navbar.css` | Fixed glassmorphism header with nav links, mobile menu, CTA button | Reads routes from `navigation.js`; highlights active route |
| **Footer** | `Footer.jsx`, `Footer.css` | Site footer with logo, nav, social links, legal placeholders | Uses `navLinks` and `SocialLinks` |

### Content sections

| Component | File(s) | Purpose | Key props |
|-----------|---------|---------|-----------|
| **Hero** | `Hero.jsx`, `Hero.css` | Page hero with headline, subheadline, CTAs, optional illustration | `headline`, `subheadline`, `primaryCta`, `secondaryCta`, `showIllustration`, `compact` |
| **SectionTitle** | `SectionTitle.jsx`, `SectionTitle.css` | Reusable section header | `label`, `title`, `subtitle`, `align`, `light` |
| **Mission** | `Mission.jsx`, `Mission.css` | Three-card mission section | None (self-contained) |
| **FounderSection** | `FounderSection.jsx`, `FounderSection.css` | Founder preview with portrait placeholder | `compact` (hides "Read Full Story" link) |

### Product & marketing

| Component | File(s) | Purpose | Key props |
|-----------|---------|---------|-----------|
| **ProductCard** | `ProductCard.jsx`, `ProductCard.css` | Product display card | `product` (from `products.js`), `detailed` (expanded layout) |
| **WaitlistForm** | `WaitlistForm.jsx`, `WaitlistForm.css` | Founding Family signup form + success state | None (self-contained; uses `foundingFamilySubmission` service) |
| **SocialLinks** | `SocialLinks.jsx`, `SocialLinks.css` | Social media icon links | `light` (for dark backgrounds) |

### Component dependency graph

```
App
├── Navbar
├── Footer
│     └── SocialLinks
└── Pages
      ├── Home
      │     ├── Hero
      │     ├── SectionTitle
      │     ├── ProductCard
      │     ├── Mission
      │     ├── FounderSection
      │     │     └── SectionTitle
      │     ├── WaitlistForm
      │     │     ├── SectionTitle
      │     │     └── SocialLinks
      │     └── SocialLinks
      ├── Products
      │     ├── Hero
      │     └── ProductCard
      ├── About
      │     ├── Hero
      │     └── SectionTitle
      ├── Founder
      │     ├── Hero
      │     └── SectionTitle
      ├── Blog
      └── Contact
            ├── Hero
            ├── SectionTitle
            └── SocialLinks
```

### Static data modules

| File | Exports | Used by |
|------|---------|---------|
| `data/navigation.js` | `navLinks`, `footerLinks`, `socialLinks` | Navbar, Footer, SocialLinks |
| `data/products.js` | `products`, `blogTopics`, `companyValues`, `companyPrinciples` | Home, Products, About, Blog |
| `data/foundingFamily.js` | Form options, benefits, initial form state | WaitlistForm |

### Services

| File | Function | Current behavior |
|------|----------|------------------|
| `services/foundingFamilySubmission.js` | `submitFoundingFamily(data)` | Saves to `localStorage`, logs to console |

---

## What Belongs Here vs. Bloom HQ

This repository is the **public company website**. Bloom HQ is the **product application** for home and family management. They serve different purposes and should remain separate codebases.

### ✅ Keep in `bloom-technologies-site`

| Category | Examples |
|----------|----------|
| **Company marketing pages** | Home, About, Founder, Products overview, Blog (coming soon), Contact |
| **Brand & design system** | Forest green / cream palette, typography, marketing components |
| **Public content** | Company mission, values, founder story, product descriptions (marketing copy) |
| **Lead generation** | Founding Family waitlist, contact form (marketing intent) |
| **Static assets** | Favicon, future marketing illustrations, brand photography |
| **SEO & meta** | Page titles, descriptions, future Open Graph tags |
| **Placeholder pages** | Careers, Investor, Privacy Policy, Terms (when added) |
| **Social links** | Company social media presence |

### ❌ Move to Bloom HQ (or other product repos)

| Category | Examples | Target repo |
|----------|----------|-------------|
| **User authentication** | Login, signup, password reset, sessions | Bloom HQ |
| **Family accounts** | Household creation, member invites, roles | Bloom HQ |
| **Home management features** | Routines, meals, chores, calendars, goals | Bloom HQ |
| **AI-powered organization** | Smart scheduling, meal planning logic, AI assistants | Bloom HQ |
| **User dashboards** | Family command center, settings, notifications | Bloom HQ |
| **Database & backend** | User data, family data, app state persistence | Bloom HQ |
| **API server** | REST/GraphQL endpoints for app functionality | Bloom HQ |
| **Real-time features** | Live sync, push notifications, websockets | Bloom HQ |
| **Product-specific UI** | Task lists, meal planners, routine builders | Bloom HQ |
| **Homeschool features** | Curriculum, lessons, progress tracking | Bloom Academy (separate repo) |
| **Child learning experiences** | Interactive AI learning, child-safe UI | Bloom Buds (separate repo) |

### Shared between repos (do not duplicate — link or reference)

| Item | Approach |
|------|----------|
| Product names & taglines | Marketing copy lives here; product apps use consistent naming |
| Brand colors & typography | Define once; product apps may import shared design tokens later |
| Founding Family emails | Waitlist captured here → synced to email provider → early access granted in Bloom HQ |
| Login / app entry | Marketing site links out to Bloom HQ app URL when launched |

### Decision rule

> If a feature requires a **logged-in user**, **persistent family data**, or **daily product interaction**, it belongs in a **product repo** (Bloom HQ, Bloom Academy, or Bloom Buds) — not here.

> If a feature helps a **visitor understand Bloom**, **join the waitlist**, or **learn about the company**, it belongs in **this repo**.

---

## Future Integration Points

Documented TODOs found in the codebase:

| Location | Planned integration |
|----------|---------------------|
| `services/foundingFamilySubmission.js` | Email provider (Kit, Mailchimp, ConvertKit, Resend) |
| `pages/Contact.jsx` | Email service for contact form |
| `pages/Blog.jsx` | CMS + blog engine |
| `components/Footer.jsx` | Privacy Policy and Terms pages |
| `data/navigation.js` | Careers page, Investor page |
| `components/ProductCard.jsx` | Individual product marketing landing pages |

When integrating email or CMS services, the recommended pattern is:

1. Add a serverless function (e.g. Vercel/Netlify API route) or external form endpoint.
2. Replace the body of `submitFoundingFamily()` — the `WaitlistForm` component should not need changes.
3. Keep this repo as a static frontend that calls external services.

---

## Summary

| Question | Answer |
|----------|--------|
| What is this repo? | Static marketing website for Bloom Technologies |
| Backend? | None |
| Database? | None (localStorage placeholder only) |
| Authentication? | None |
| API routes? | None (client-side React Router only) |
| Framework? | React 19 + Vite 6 + React Router 7 |
| Deploy target? | Static hosting (`dist/` folder) |
| Relationship to Bloom HQ? | Separate repo; this site links to and markets the product |
