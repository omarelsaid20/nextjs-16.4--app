# Growth Wave — Home & Contact Us Pages · Design Spec

- **Date:** 2026-10-15
- **Status:** Draft — awaiting review
- **Source brief:** *AIHI Front-End Development Task* (PDF), 2 working days
- **Visual reference:** https://growthwave-sa.com/home and https://growthwave-sa.com/contact-us

---

## 1. Goal

Build the **Home** and **Contact Us** pages of the Growth Wave website as a Next.js app that follows Growth Wave's own visual identity and content, supports **Arabic (RTL)** and **English (LTR)**, and passes all five acceptance criteria of the brief. The code is an assessment of the author's front-end skill, so every part must be readable, explainable, and intentionally structured.

**Success =** all acceptance criteria met (§15), clean reviewable code and git history, a README that lets a reviewer run it in minutes, and a live preview URL.

## 2. Requirements (from the brief)

**Home page:** responsive header + navigation · hero introducing Growth Wave · services overview · About section · clients/partners/achievements · clear call-to-action · professional footer with company info and useful links.

**Contact Us page:** form with Full Name, Email, Phone, Subject, Message · front-end validation · success and error messages · form ready for API integration · company email, phone, location · social links · Google Maps section or placeholder.

**Technical:** fully responsive (desktop/tablet/mobile) · clean, modern UI · Arabic RTL + English LTR · reusable components · clean structure · optimized images and loading · major modern browsers · avoid hardcoded content.

**Deliverables:** source code · both pages functional · responsive · validated, submission-ready form · local run instructions · code pushed to the assigned repository.

## 3. Reference-site findings

| Item | Finding | Consequence for us |
|---|---|---|
| Framework | Angular 17.3 | Nothing to reuse code-wise; we reproduce the design only |
| Primary color | `#0047AB` | Brand token |
| Footer | Navy `#0E3274` | Token |
| Section/card tints | `#F5F9FF`, `#EBEFFA` | Tokens |
| Text | Headings `#000A18`, body `#585858`, muted `#777` | `#777` fails WCAG AA on white (4.48:1) → we use `#6B6B6B` |
| Font | Madani Arabic (commercial, NamelaType/MyFonts; demo is personal-use only) | Replaced by **Readex Pro** (OFL, Google Fonts) |
| i18n | Arabic default; EN toggle stored in `localStorage`; same URL | We use locale-prefixed routes instead (no direction flash, SEO-friendly) |
| Home sections | Header → Hero (photo + wave) → About (+3 feature cards) → Services (3 cards) → Courses (6 cards) → Partners (3 logos) → CTA → Footer | Same order and structure |
| Contact page | Hero + 3-field form (name, email, message) + info card; no map | We implement the brief's 5 fields + map |
| Images | Large PNGs (about photo 2.4 MB, course image 1.4 MB), empty `alt` everywhere | `next/image` (AVIF/WebP, responsive sizes) + meaningful `alt` text |
| Buttons | "Company Profile" opens `/assets/pdfs/CompanyProfile.pdf` (1.6 MB); "Discover More" → About; "Click Here" → Contact; course buttons → Courses/details | Link map in §6.6 |

## 4. Decisions log

| # | Area | Decision | Rejected alternatives (why) |
|---|---|---|---|
| D1 | Design fidelity | Faithful to Growth Wave identity, polished (spacing, hover/focus states, subtle motion, a11y) | Pixel clone (copies weak spots, shows less judgment); new layout (risks criterion 1) |
| D2 | Unbuilt nav pages | Keep all 7 nav labels; unbuilt pages render one localized **Coming soon** page | Anchor-only nav; linking out to the live site |
| D3 | Login / Sign Up | Keep in header → Coming soon; move into mobile drawer below `lg` | Drop them |
| D4 | Courses section | Include, 6-card responsive grid | Carousel (extra lib + RTL edge cases); skip |
| D5 | Achievements | Partners section satisfies "clients, partners, or achievements"; **no stats strip** (would require invented numbers) | — |
| D6 | Font | **Readex Pro** via `next/font/google` (Arabic + Latin, variable) | IBM Plex Sans Arabic, Alexandria, Tajawal; licensing Madani Arabic |
| D7 | Styling | **Tailwind CSS v4** with CSS-first `@theme` tokens and logical utilities | CSS Modules + SCSS; mixed |
| D8 | UI primitives | **shadcn/ui** (Radix-based, code owned in repo) | gentleduck UI; hand-rolled |
| D9 | i18n | **next-intl 4** | Hand-rolled dictionaries; client-only toggle |
| D10 | Locale URLs | Arabic default, **always prefixed** (`/` → `/ar`, or `/en` by `Accept-Language`/cookie) | Unprefixed default locale; English default |
| D11 | Forms | **react-hook-form + zod 4** via `@hookform/resolvers` | Server Action + `useActionState`; TanStack Form |
| D12 | Submit target | Mock **`POST /api/contact`** Route Handler sharing the zod schema; endpoint is a single `CONTACT_ENDPOINT` constant in `contact-service.ts` (**no env var**) | Client-only mock; real email provider |
| D13 | Phone validation | **Saudi mobile only, regex** (`05XXXXXXXX` or `+9665XXXXXXXX`), spaces/dashes stripped first | libphonenumber-js; loose regex |
| D14 | Subject | Free-text input | Topic dropdown |
| D15 | Map | **Lazy Google Maps embed** iframe (no API key). Fallback to click-to-load facade **only if** it produces console errors | Facade first; Leaflet/OSM |
| D16 | Motion | **CSS transitions + one `useInView` hook**; honors `prefers-reduced-motion` | `motion` library; none |
| D17 | Assets | **Growth Wave's own** logo, photos, partner logos, company-profile PDF (each file listed with size before download) | Stock photos |
| D18 | Lint/format | **ESLint** (`eslint-config-next`) + **Prettier** (+ `prettier-plugin-tailwindcss`) | Biome |
| D19 | Tests | **Vitest** (schema + translation parity) + **Playwright** smoke (Chromium, Firefox, WebKit) | Playwright only; none |
| D20 | Delivery | Assigned repo + **Vercel** preview + **GitHub Actions** CI | Repo only |

### Versions (checked on npm, 2026-10-15)

`next 16.4.1` · `react 19.3.1` · `typescript` (strict) · `tailwindcss 4.3.3` · `next-intl 4.14.9` · `react-hook-form 7.90.0` · `zod 4.6.7` · `@hookform/resolvers 5.9.1` · `shadcn 4.21.5` (CLI) · `sonner 2.0.8` · `lucide-react 1.57.0` · `vitest 5.0.4` · `@playwright/test 1.64.1` · ESLint at the version supported by `eslint-config-next@16`. Package manager: **pnpm 11**. Runtime: Node 24.

## 5. Architecture

### 5.1 Folder structure

```
src/
├─ proxy.ts                      # Next 16 "proxy" (formerly middleware): next-intl locale detection/redirect
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx              # <html lang dir>, font, providers, Header, Footer, Toaster
│  │  ├─ page.tsx                # Home — composes section components only
│  │  ├─ contact/page.tsx        # Contact Us
│  │  ├─ [slug]/page.tsx         # Coming soon — statically generated for known slugs only
│  │  ├─ error.tsx               # localized error boundary (client)
│  │  └─ not-found.tsx           # localized 404
│  ├─ api/contact/route.ts       # mock POST endpoint
│  └─ globals.css                # Tailwind v4 + @theme tokens + shadcn variables
├─ i18n/
│  ├─ routing.ts                 # defineRouting({ locales: ['ar','en'], defaultLocale: 'ar', localePrefix: 'always' })
│  ├─ navigation.ts              # createNavigation(routing) → Link, usePathname, useRouter, redirect
│  └─ request.ts                 # getRequestConfig: resolve locale, load messages
├─ messages/
│  ├─ ar.json
│  └─ en.json
├─ content/
│  ├─ site.ts                    # contact info, socials, nav + footer link definitions, map query, PDF path
│  ├─ services.ts
│  ├─ courses.ts
│  └─ partners.ts
├─ components/
│  ├─ ui/                        # shadcn: button, input, textarea, label, sheet, sonner
│  ├─ layout/                    # Header, HeaderShell, NavLinks, MobileNav, LocaleSwitcher, Footer
│  ├─ home/                      # Hero, AboutSection, ServicesSection, CoursesSection, PartnersSection, CtaSection
│  ├─ contact/                   # ContactForm, ContactInfo, MapEmbed
│  ├─ shared/                    # Container, SectionHeading, PageHero (wave), Reveal, SocialLinks, CourseCard, FeatureCard, ServiceCard
│  └─ icons/                     # brand SVG icons (X, Facebook, Instagram, LinkedIn) — lucide has no brand icons
├─ lib/
│  ├─ contact-schema.ts          # zod schema + types + error-key constants
│  ├─ contact-service.ts         # CONTACT_ENDPOINT constant + submitContact(): fetch wrapper returning a typed result
│  └─ utils.ts                   # cn()
├─ hooks/
│  └─ use-in-view.ts             # IntersectionObserver hook for Reveal
└─ global.d.ts                   # next-intl AppConfig augmentation (Locale + Messages types)
public/
├─ images/                       # downloaded Growth Wave assets
└─ files/CompanyProfile.pdf
tests/
├─ unit/                         # Vitest
└─ e2e/                          # Playwright
```

### 5.2 Rendering model

- **Server Components by default.** Client components are limited to: `HeaderShell`, `NavLinks`, `MobileNav`, `LocaleSwitcher`, `ContactForm`, `Reveal` (and the shadcn primitives they use), plus `error.tsx` (required to be client).
- **Header split:** `Header` is a Server Component that renders the logo and buttons and passes them as `children` into the client `HeaderShell` (which only tracks scroll position to toggle the shadow). `NavLinks` is a small client component because highlighting the active link needs the current pathname.
- **Static generation:** `generateStaticParams` in `[locale]/layout.tsx` returns both locales; `setRequestLocale(locale)` is called in every layout/page to enable static rendering. `[slug]/page.tsx` sets `dynamicParams = false` and generates only the known slugs, so unknown paths 404.

### 5.3 Routes

| URL (`{l}` = `ar`\|`en`) | Renders |
|---|---|
| `/` | proxy redirect → `/ar` (or `/en` via `NEXT_LOCALE` cookie / `Accept-Language`) |
| `/{l}` | Home |
| `/{l}/contact` | Contact Us |
| `/{l}/about`, `/consultations`, `/training`, `/courses`, `/resources`, `/terms`, `/privacy`, `/login`, `/signup` | Coming soon (title from `ComingSoon.pages.<slug>`) |
| anything else under `/{l}/…` | localized 404 |
| `POST /api/contact` | mock endpoint (excluded from proxy matcher) |

## 6. Pages & components

### 6.1 Header (all pages)

- Sticky, white; gains a subtle shadow after scrolling.
- **≥ `lg` (1024px):** logo (start) · 7 nav links (active = brand color) · language pill (shows the *other* locale, e.g. "EN" on Arabic pages) · Login (outline) · Sign Up (filled).
- **< `lg`:** logo · language pill · hamburger → shadcn **Sheet** opening from the inline-start edge (right in RTL, left in LTR) containing nav links + Login/Sign Up. Closes on link click and `Esc`; focus is trapped while open; trigger has `aria-label`, `aria-expanded`.
- Nav items come from `content/site.ts` (`{ key, href }`), labels from `Nav.<key>`.

### 6.2 Home sections (in order)

| Component | Content | Layout |
|---|---|---|
| `Hero` (uses `PageHero`) | Title, subtitle, "Company Profile" button | Full-bleed photo + dark overlay; centered text; white wave SVG at the bottom edge. Hero image is preloaded (LCP). |
| `AboutSection` | Eyebrow "About Growth Wave", title "Why Growth Wave?", subheading + paragraph, photo, 3 `FeatureCard`s (Tailored Programs, Measurable Impact, Expert Guidance), "Discover More" button | Text + photo two columns ≥ `lg`, stacked below; cards 3 → 1 columns |
| `ServicesSection` | Eyebrow "Our Services", title, intro, 3 `ServiceCard`s (Consulting, Training, eLearning) | Outlined cards with a brand-colored icon tab on the top inline-end corner; 3 → 1 columns |
| `CoursesSection` | Eyebrow "Most Demanded Courses", title, intro, 6 `CourseCard`s (image, title, category, description, "Course Overview"), "Discover more courses" button | Tinted band; 3 (`lg`) → 2 (`md`) → 1 columns |
| `PartnersSection` | Eyebrow "Our Partners", title, intro, 3 partner logos (BSI, National eLearning Center, TVTC) | Rounded logo "pills", centered, wrapping |
| `CtaSection` | Eyebrow "Contact Us", title, text, "Click Here" button | Text + oval-masked photo two columns ≥ `lg`, stacked below; tinted background |

All section headings use the shared `SectionHeading` (eyebrow with a brand-colored inline-start bar, title, optional intro). Sections fade/slide in via `Reveal`.

### 6.3 Footer (all pages)

Navy background. Column 1: white logo, tagline, social icons (circles). Column 2: "Quick Links" in two sub-columns (Home, Training Areas, About Us, Knowledge Resources, Training, Consulting, Terms and Conditions, Privacy Policy, Contact Us). Column 3: "Contact Us" — location, phone (`tel:`), email (`mailto:`). Bottom bar: "Growth Wave © {current year} All rights reserved". Columns stack on mobile.

### 6.4 Contact Us page

1. `PageHero` with contact photo, title "Contact Us", subtitle.
2. Bordered container with two areas: **`ContactForm`** and **`ContactInfo`** (intro text, location, phone, email, `SocialLinks`). Side by side ≥ `lg`; on mobile the **form comes first**.
3. **`MapEmbed`**: full-width rounded card with a lazy Google Maps iframe centered on Riyadh (`title` attribute set for a11y) and an "Open in Google Maps" link.

### 6.5 Coming soon (`[slug]`) and 404

Compact branded page: localized title (e.g. "About Us — coming soon"), one sentence, buttons "Back to home" and "Contact us". 404 uses the same layout with "Page not found" copy. Both include header and footer.

### 6.6 Link map (acceptance criterion 3)

| Element | Target |
|---|---|
| Nav: Home / About / Consultations / Training / Training Areas / Resources / Contact | `/` `/about` `/consultations` `/training` `/courses` `/resources` `/contact` (locale-prefixed via next-intl `Link`) |
| Login / Sign Up | `/login`, `/signup` |
| Hero "Company Profile" | `/files/CompanyProfile.pdf`, new tab, `rel="noopener"` |
| About "Discover More" | `/about` |
| Course "Course Overview" + "Discover more courses" | `/courses` |
| CTA "Click Here" | `/contact` |
| Footer quick links | as nav, plus `/terms`, `/privacy` |
| Social icons | x.com/growthwavesa, facebook.com/growthwavesa, instagram.com/growthwavesa, linkedin.com/company/growthwavesa — new tab, `rel="noopener noreferrer"`, `aria-label` |
| Phone / email | `tel:0558045586`, `mailto:info@growthwave-sa.com` |
| Language pill | same pathname in the other locale |

## 7. Content & i18n model

- **All user-visible strings** live in `messages/{ar,en}.json`, namespaced: `Metadata`, `Nav`, `Header`, `Hero`, `About`, `Services`, `Courses`, `Partners`, `Cta`, `Footer`, `Contact` (hero, info, form labels/placeholders, errors, toasts, map), `ComingSoon`, `NotFound`, `Error`.
- **Copy source:** Growth Wave's live site in both languages (captured during research). Contact-form labels/errors/toasts are written fresh in both languages.
- **Typed messages:** `global.d.ts` augments next-intl's `AppConfig` with `Locale` (from `routing.locales`) and `Messages` (from `en.json`), so a wrong key is a type error.
- **Structural data** (`content/*.ts`) holds ids, hrefs, icons, image paths, and alt-text keys — never prose. Pattern:

  ```ts
  export const services = [
    { id: 'consulting', icon: ConsultingIcon, href: '/consultations' },
    { id: 'training', icon: TrainingIcon, href: '/training' },
    { id: 'elearning', icon: ELearningIcon, href: '/training' },
  ] as const satisfies readonly Service[];
  // component: t(`Services.items.${id}.title`)
  ```

- **Direction:** `layout.tsx` sets `lang` and `dir` (`ar` → `rtl`) on `<html>` server-side. Styling uses logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`); directional icons flip with `rtl:-scale-x-100`. Phone numbers, emails and the email/phone inputs carry `dir="ltr"` to avoid bidi reordering.
- **Locale switching:** `LocaleSwitcher` uses next-intl's `useRouter().replace(pathname, { locale })`; next-intl persists the choice in the `NEXT_LOCALE` cookie.
- **Metadata:** per-page `generateMetadata` with localized `title`/`description`, `alternates.languages` (hreflang `ar`/`en`), and Open Graph basics.

## 8. Contact form

### 8.1 Schema (`lib/contact-schema.ts`)

Errors are returned as **message keys** (e.g. `errors.phone.invalid`), translated in the UI, so one schema serves client, server, and tests.

| Field | Rule | Error keys |
|---|---|---|
| `fullName` | trim; 3–80 chars; `^[\p{L}\s'.-]+$` (Unicode letters, Arabic and Latin) | `required`, `tooShort`, `tooLong`, `invalid` |
| `email` | trim; valid email (`z.email()`); ≤ 254 chars | `required`, `invalid` |
| `phone` | strip spaces/dashes; `^(?:05\d{8}|\+9665\d{8})$` | `required`, `invalid` |
| `subject` | trim; 3–100 chars | `required`, `tooShort`, `tooLong` |
| `message` | trim; 10–1000 chars; live counter `n/1000` | `required`, `tooShort`, `tooLong` |

### 8.2 Flow

```
ContactForm  (react-hook-form, zodResolver, mode: 'onTouched')
  │  validates a field on blur, then re-validates on change; on submit focuses the first invalid field
  ▼
contact-service.ts → submitContact(values)
  │  POST to CONTACT_ENDPOINT (const = '/api/contact'), JSON body, 10 s AbortSignal timeout
  │  returns { ok: true } | { ok: false; reason: 'validation' | 'server' | 'network'; fieldErrors?: Partial<Record<Field, ErrorKey>> }
  ▼
app/api/contact/route.ts  (mock)
     malformed JSON → 400 · schema failure → 422 { fieldErrors } · otherwise ~800 ms delay → 200 { ok: true }
```

### 8.3 UI states

| State | Behaviour |
|---|---|
| Idle | Labels above inputs, required markers, placeholders with realistic examples |
| Invalid field | Red border, error text under the field (`aria-invalid`, `aria-describedby`) |
| Submitting | Button shows spinner + "Sending…", disabled (no double submit); form `aria-busy` |
| Success | Sonner success toast; form resets |
| Server validation error | Field errors mapped onto inputs via `setError`; values kept |
| Server/network error | Sonner error toast ("Couldn't send your message. Try again."); values kept |

Inputs: `noValidate` on the form; `autoComplete` = `name`, `email`, `tel`; `inputMode="tel"` on phone; Name + Email share a row and Phone + Subject share a row ≥ `md`, Message full width.

## 9. Styling & responsiveness

### 9.1 Tokens (`globals.css`, Tailwind v4 `@theme`, also mapped to shadcn CSS variables)

| Token | Value |
|---|---|
| `--color-brand` / `--color-brand-hover` | `#0047AB` / `#003A8C` |
| `--color-navy` | `#0E3274` |
| `--color-tint-50` / `--color-tint-100` | `#F5F9FF` / `#EBEFFA` |
| `--color-ink` | `#000A18` |
| `--color-body` | `#585858` |
| `--color-muted` | `#6B6B6B` |
| `--color-line` | `#D4D4D4` |
| `--font-sans` | Readex Pro (`next/font/google`, subsets `arabic` + `latin`, variable, `display: swap`) |
| Radius | cards `1rem`, buttons/inputs `0.5rem` |
| Container | max-width `75rem` (1200px), inline padding 1rem / 1.5rem (`md`) / 2rem (`lg`) |

### 9.2 Responsiveness

Mobile-first with Tailwind default breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Verified at **375 / 768 / 1440 px** in both RTL and LTR. No horizontal overflow at any width.

### 9.3 Motion

`Reveal` wraps sections: opacity/translate transition triggered once by `useInView` (IntersectionObserver). Disabled under `prefers-reduced-motion: reduce`. Cards and buttons get CSS hover/focus transitions.

## 10. Performance & compatibility

- Statically generated pages for both locales; minimal client JS (see §5.2).
- `next/image` for all raster images: AVIF/WebP, `sizes` per layout, hero preloaded, others lazy. Partner logos stay SVG.
- Fonts self-hosted by `next/font`; no layout shift.
- Map iframe `loading="lazy"`.
- **Targets (Lighthouse, mobile):** Performance ≥ 90; Accessibility, Best Practices, SEO ≥ 95. Results recorded in the README.
- **Browsers:** current Chrome, Edge, Firefox, Safari — verified by running Playwright on Chromium, Firefox and WebKit.

## 11. Accessibility

Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, logical heading order; meaningful `alt` text for every image (translated); visible `focus-visible` rings; keyboard-operable drawer; labelled icon-only buttons and social links; form errors announced via `aria-describedby`; toasts in a live region (Sonner); AA color contrast (see muted token change).

## 12. Testing

### 12.1 Unit (Vitest)

- `contact-schema.test.ts`: valid payload passes; each field's boundary and invalid cases; phone normalization (`055 804 5586`, `+966 55 804 5586` pass; `0158045586`, `+96655804558` fail); Arabic and Latin names pass.
- `messages.test.ts`: `ar.json` and `en.json` have identical key sets.

### 12.2 End-to-end (Playwright: Chromium, Firefox, WebKit)

1. `/ar`, `/en`, `/ar/contact`, `/en/contact`, one Coming soon page per locale: load, correct `lang`/`dir`, **zero console errors**.
2. Every internal header, footer and in-page link (including the company-profile PDF) responds with a non-404 status in both locales. External social links are asserted by `href`/`target`/`rel` only, not fetched, to keep tests independent of third-party sites.
3. Form: empty submit shows all 5 errors; invalid phone shows phone error; valid submit shows success toast and resets; `/api/contact` intercepted with 500 shows the error toast and keeps values.
4. Mobile (375px): drawer opens, navigates, closes. Locale switcher keeps the current page.
5. No horizontal overflow at 375 / 768 / 1440.

## 13. Delivery

- **Git:** small conventional commits per feature, pushed to the assigned repository.
- **No environment variables:** the project runs with zero configuration (`pnpm install && pnpm dev`). Connecting a real backend = changing `CONTACT_ENDPOINT` in `lib/contact-service.ts`; the README documents this.
- **README:** live URL, overview, stack + rationale (condensed §4), prerequisites (Node 24, pnpm), `pnpm install` / `pnpm dev` / `pnpm build` / `pnpm start`, test commands, project structure, how to add/edit copy and add a locale, Lighthouse results, screenshots.
- **CI (GitHub Actions):** on push/PR — install → lint → typecheck → unit tests → build → Playwright (with browser cache).
- **Vercel:** project prepared to deploy with zero config; the author connects the Vercel account and repository.
- **Housekeeping:** `.playwright-mcp/` (research screenshots) deleted before scaffolding and added to `.gitignore`.

## 14. Out of scope

Real authentication, About/Training/Courses/Resources/Terms/Privacy page content, course detail pages, CMS integration, real email delivery, dark mode, analytics, cookie banner.

## 15. Acceptance-criteria traceability

| # | Criterion | Covered by |
|---|---|---|
| 1 | Follows Growth Wave's visual identity | D1, D6, D17, §3, §6, §9.1 |
| 2 | Both pages fully responsive | §6 layouts, §9.2, e2e #4–5 |
| 3 | All buttons and navigation links work | D2, D3, §5.3, §6.6, e2e #2 |
| 4 | Contact form validates inputs correctly | §8, unit schema tests, e2e #3 |
| 5 | No major UI issues or console errors | §10, §11, D15 fallback, e2e #1 (three engines) |

## 16. Open items (resolved before/while implementing)

1. **Assigned repository URL** — needed before the first commit (decides whether we clone it or `git init` and add it as a remote).
2. **Asset list** — exact files (logo variants, hero/about/CTA/contact photos, partner SVGs, course image, company-profile PDF) listed with sizes for approval before downloading.
3. **Service icons** — closest lucide-react equivalents to Growth Wave's three service icons, chosen during implementation.
