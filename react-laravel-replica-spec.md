# Inofarma Storefront Replica Spec — Warehouse Theme → React + Laravel

Goal: rebuild this Shopify "Warehouse" theme's storefront pixel-for-pixel in a
React frontend + Laravel backend, then wire it to Shopify (Storefront API)
once the UI matches. This doc is the source of truth extracted directly from
the live theme files in this repo (`config/settings_data.json`,
`snippets/css-variables.liquid`, `assets/theme.css`, `sections/*.liquid`,
`templates/*.json`).

---

## 1. Architecture

```
┌─────────────┐      GraphQL (Storefront API)      ┌──────────────┐
│   React SPA │ ───────────────────────────────────▶│   Shopify    │
│ (this spec) │◀─────────────────────────────────── │  (products,  │
└──────┬──────┘                                      │  collections,│
       │ REST/JSON (your own endpoints)              │  cart, etc.) │
       ▼                                              └──────────────┘
┌─────────────┐
│   Laravel   │  — auth, orders proxy/cache, content (FAQ, testimonials,
│   backend   │    apotek locations), server-side Storefront API calls
└─────────────┘    (keep the Storefront token off the client if desired),
                    webhooks receiver for Shopify events.
```

- **Phase 1 (this spec):** build the React UI against static/mock data that
  matches the shapes below. Get it visually identical.
- **Phase 2:** Laravel exposes `/api/*` endpoints that proxy Shopify's
  Storefront GraphQL API (products, collections, cart mutations) so the
  Storefront access token never ships to the browser, and so Laravel can
  cache/merge in its own data (apotek branch locations, custom FAQ content,
  testimonials) that isn't naturally "product" data in Shopify.
- **Phase 3:** swap the cart drawer to Shopify's real Cart API, then launch
  the **fully custom checkout** described in §8B instead of redirecting to
  Shopify Checkout — Shopify is used only for product/inventory reads and
  order creation after payment succeeds.

---

## 2. Design tokens

### 2.1 Colors (live values from `config/settings_data.json`)

| Token | Hex | Usage |
|---|---|---|
| `heading` | `#0900aa` | headings, also header background |
| `text` | `#677279` | body copy |
| `accent` / `link` | `#24ce30` | links, eyebrows, primary button bg |
| `border` | `#e1e3e4` | hairlines, card borders |
| `background` | `#f3f5f6` | page background |
| `secondary-background` | `#ffffff` | cards, header/footer panels |
| `error` | `#ff0000` | form errors (bg = error @ 7% alpha) |
| `success` | `#00aa00` | success alerts (bg = success @ 11% alpha) |
| `primary-button-bg` | `#24ce30` | primary CTA background |
| `primary-button-text` | `#ffffff` | primary CTA text |
| `secondary-button-bg` | `#1e2d7d` | secondary CTA background (blue) |
| `secondary-button-text` | `#ffffff` | secondary CTA text |
| `header-bg` | `#0900aa` | header + announcement bar |
| `header-text` | `#ffffff` | header text |
| `header-light-text` | `#a3afef` | header secondary/muted text |
| `header-accent` | `#24ce30` | header active/hover accents |
| `footer-bg` | `#f3f5f6` | footer background |
| `footer-heading` | `#1e2d7d` | footer column titles |
| `footer-body` | `#677279` | footer copy |
| `footer-accent` | `#00badb` | footer links/accents |
| `product-on-sale` | `#ee0000` | sale badge |
| `product-in-stock` | `#008a00` | stock indicator |
| `product-low-stock` | `#ee0000` | low stock indicator |
| `product-sold-out` | `#8a9297` | sold out indicator |
| `custom-label-1-bg` | `#008a00` | product badge 1 |
| `custom-label-2-bg` | `#00a500` | product badge 2 |
| `review-star` | `#ffbd00` | rating stars |

Reproduce these as CSS custom properties (`:root { --heading: #0900aa; ... }`)
or a Tailwind theme extension — either way, name them 1:1 so future
Shopify-driven theming (merchant changes color in Shopify admin) can be
synced without a rename.

### 2.2 Typography

- Font family: **Barlow** for both headings and body (Google Fonts).
  - Heading weight: **500**
  - Body weight: **400**
  - "Bolder" weight (buttons, emphasis, eyebrows): **600**
- Base body font size: **16px** (live setting; theme schema default is 15px —
  use 16px, that's what's actually deployed)
- Underlined links: **on** (`text-decoration: underline` on inline links by
  default)
- Load via `<link>` to Google Fonts or self-hosted woff2:
  `Barlow:wght@400;500;600` (+ italic weights if you reproduce the popup's
  `<em>` emphasis style)

### 2.3 Spacing / layout

- Container max-width: **1480px**
- Container gutter: **20px mobile / 40px desktop**
- Container variants: `--medium` 1150px, `--narrow` 800px,
  `--extra-narrow` 630px, `--giga-narrow` 520px
- Buttons: `border-radius: 2px`, `line-height: 48px`, `padding: 0 30px`,
  `font-weight: 600` (the "bolder" weight) — theme uses **sharp, mostly
  square corners**, not pill buttons. Cards generally use `2px–4px` radius.

### 2.4 Breakpoints

| Breakpoint | Meaning |
|---|---|
| `max-width: 480px` | small mobile |
| `max-width: 640px` / `min-width: 641px` | mobile ↔ tablet (most common cutoff) |
| `max-width: 999px` / `min-width: 1000px` | tablet ↔ desktop ("lap-and-up") |
| `min-width: 1280px` | large desktop |
| `min-width: 1440px` | extra-large desktop |

Use these exact pixel values in your CSS/Tailwind config so responsive
behavior matches (e.g. mobile nav vs desktop nav switches at 1000px, not the
Tailwind default 1024px).

### 2.5 Icons

Theme uses **inline SVG** (not an icon font, not a sprite `<use>` — each icon
is a literal `<svg>` block), `fill="currentColor"` / `stroke="currentColor"`
so icons inherit text color. ~70 icons exist; the ones you'll actually need
for parity:

`hamburger`, `hamburger-mobile`, `search`, `cart`, `big-cart`, `close`,
`account`, `heart`, `plus`/`minus`, `arrow-left/right/bottom`, `check`,
`newsletter`, `email`, `rating-star`/`rating-star-half`, `sale`, `filter`,
`grid`, `list`, social icons (`facebook`, `instagram`, `pinterest`, `tiktok`,
`threads`), business-info icons prefixed `bi-` (`bi-delivery`, `bi-returns`,
`bi-customer-support`, `bi-secure-payment`, `bi-shop`, `bi-shield`, etc. —
used in the FAQ/contact section).

Recommendation: use an SVG icon library (e.g. Lucide/Feather) for generic
icons and hand-port the handful of brand-specific ones (logo, mascot,
business-info icons) as React components.

---

## 3. Global layout

### 3.1 Page shell

```
<body>
  <a class="skip-to-content" href="#main">
  <AnnouncementBar />         ← top strip
  <Header />                  ← logo, nav, search, account, cart
  <main id="main">
    {page content — section stack, see §5}
  </main>
  <Footer />
  <CartDrawer />              ← popover, not full slide-in (see §6)
</body>
```

### 3.2 Announcement bar

Thin bar above the header.
- Background `#0900aa` (site's `header-bg`), white text.
- Left: announcement text (optionally a link), configurable left/center
  alignment (desktop only — always centered on mobile).
- Right (desktop only, `hidden-phone`): a button/link. On this site it's been
  repurposed from a newsletter-signup toggle into a plain link labeled
  **"Tentang Kami"** → `https://info.inofarma.com/` (opens new tab).
- (Original theme behavior, for reference if you want the full feature: this
  button used to toggle a newsletter-signup panel with an email capture form
  posting `contact[tags]=newsletter`. Not needed for the replica unless you
  want that flow back.)

### 3.3 Header

Structure (desktop, `desktop_navigation_layout: "condensed"` — the mode this
site uses):

```
<header>
  [hamburger: mobile nav trigger — hidden ≥1000px]     ← .header__mobile-nav
  [hamburger: desktop condensed-nav trigger]            ← .header__desktop-nav
     (NOTE: both hamburgers are CSS-hidden on this live site — see
     assets/theme.css .header__mobile-nav / .header__desktop-nav rules.
     Decide whether your replica keeps them hidden or restores them —
     currently there is NO way to open site navigation on this live theme.)
  [logo]                                                 ← centered/left, img
  [search bar — expandable, product-type filter dropdown, AJAX results]
  [action icons]
    - locale selector (popover)
    - country selector (popover) — disabled on this site
    - account link
    - cart icon + item count badge → opens mini-cart popover
</header>
[optional secondary nav-bar row if layout === "inline" — not used here]
```

Logo sizing: `logo_max_width: 140px` desktop, `mobile_logo_max_width: 100px`.

Header settings worth reproducing as config (in case you want a Shopify
admin-editable header later): sticky header toggle, logo, logo widths, nav
menus (desktop/mobile), navigation layout (`condensed`/`inline`), hover vs.
click to open dropdown, phone number + email shown in nav
(`0812-1401-8964` / `cs@inofarma.com` — currently configured, verify these
are still current before hardcoding), mega-menu blocks (menu item + 2
image/heading/text/link promo tiles).

### 3.4 Footer

```
<footer>
  [optional "text-with-icons" strip — 4x icon+title+text trust badges]
     (currently DISABLED on this site — skip unless re-enabled)
  <FooterMain>
    column: "text" block  — e.g. "Tentang Apotek Inofarma" + rich text
    column: "links" block — menu (main-menu)
    column: "newsletter" block — "Info Sehat dan Hemat" + email capture
    [social icons row]        ← if show_social_media
    [payment icons row]       ← if show_payment_icons
    [locale/country selectors]← if enabled
    [copyright line]
  </FooterMain>
</footer>
```

Footer background `#f3f5f6`, column headings `#1e2d7d`, body text `#677279`,
accent/link color `#00badb`.

---

## 4. Homepage section stack (exact live order)

Reproduce as an ordered list of React section components — this is a direct
port of `templates/index.json`'s `order` array:

1. **Hero slideshow** (`slideshow`) — full-width image carousel, 3 slides
   (`hero_banner_1/2/3.png`), autoplay, no title/button text set (image-only
   banners with optional overlay CTA button per slide — currently blank).
2. **Logo/category list** (`logo-list`) — row of 8 category icons + labels
   linking to collections (Kesehatan, Kebutuhan Keluarga, Alat Kesehatan,
   Perawatan Tubuh, Obat Tradisional, Vitamin & Suplemen, Obat Bebas, Semua
   Produk).
3. **Second slideshow** (`slideshow`) — 2-slide promo banner with
   desktop/mobile image variants (`pb_1/pb_2`).
4. ~~Image-with-text-overlay~~ — **disabled**, skip.
5. **Featured collection ×3** — "Rekomendasi Untukmu" (vitamin-suplemen),
   "Produk Kesehatan Terbaru" (kesehatan), "Produk Terlaris Kami"
   (alat-kesehatan). Each: horizontal product carousel, 12 products, vertical
   card layout, quick-buy enabled.
6. **Collection list** (`collection-list`) — "Brand Terlaris", 10 image
   tiles linking to collections.
7. **Collection list #2** (`collection-list`) — "Keuntungan Belanja di
   Inofarma", 9 value-prop tiles with icons (cheapest products, daily
   savings, complete products, 24-hour pharmacy, 24-hour delivery, easy to
   reach, free consultation, member benefits, easy shopping).
8. **Collection list — rectangle image** (`collection-list-rectangle-image`)
   — "Apotek Inofarma Terdekat", 4 branch tiles (Jengki, Kayu Manis,
   Pisangan Lama, Kalisari) each linking to
   `/pages/apotek-detail?apotek=apotekN`.
9. **Blog posts** (`blog-posts`) — "Artikel Kesehatan", 3 posts from the
   `news` blog, shows category/author/date, no excerpt.
10. **Third slideshow** (`slideshow`) — 3-slide banner (`bb_1/2/3.png`).
11. **Testimonials** (`testimonials`) — "Testimoni Sobat Ino", 4 reviews with
    circular avatar, arrows + dots, auto-rotate.
12. **Rich text ×2** — "Apotek Inofarma: Solusi Kesehatan Terhemat dan
    Terlengkap" and "Belanja Obat Praktis dengan Layanan Antar 24 Jam" —
    centered narrow-width marketing copy blocks.
13. **FAQ** (`faq`) — accordion + a "Hubungi Inofarma Kapan Saja" contact
    panel with two contact-info cards (customer service: email/WhatsApp/
    phone; consumer complaints: agency name + WhatsApp).

(A handful of sections after this — `offers`, `mosaic`, `rich-text`,
`collection-with-image`, `featured-product`, `quick-links` — exist in the
JSON but are **disabled**; ignore them.)

**Site-wide notice banner** (recently added, not part of the original
theme): a full-width amber warning strip rendered just above the hero on
every page — warning icon + "Layanan pemesanan melalui website saat ini
belum beroperasi. Kami mohon maaf atas ketidaknyamanannya. Untuk info
seputar Inofarma, silakan kunjungi info.inofarma.com." linking to
`info.inofarma.com`. Reproduce this as a global `<SiteNotice>` component
above `<main>`'s children, styled `background:#fff8e1; border-bottom:1px
solid #f5c400; color:#8a6d00`.

---

## 5. Other page templates

| Page | Section stack |
|---|---|
| Product (`product.json`) | main product (gallery, title, price, variant selector, quantity, buy buttons) → product-recommendations → recently-viewed-products |
| Collection (`collection.json`) | main collection (filters, sort, product grid) → recently-viewed-products |
| Cart (`cart.json`) | main cart → recently-viewed-products (fallback full page; see §6 for the drawer that's actually used) |
| Search | main search results |
| Blog / Article | standard blog listing / article body |
| 404 | main only |
| Static pages | mostly a rich-text/contact-form/FAQ/team section mix per page (contact, FAQ, career, team, policies, generic content pages) |

---

## 6. Cart behavior

**Not** a full slide-in drawer — it's a **popover attached to the cart
icon** in the header (small triangle-pointer callout, `aria-hidden` toggled
open/closed). Contents:

- Empty state: icon + "browse products" CTA
- Free-shipping progress bar (if a threshold is configured — currently
  disabled on this site)
- Line items: image, title, variant, unit price, quantity stepper, remove
  button
- Subtotal + checkout button

A separate full `/cart` page also exists as a fallback/direct-link target
(reachable e.g. from a "view full cart" link inside the popover).

For the React build: implement as a `<CartPopover>` anchored to the header
cart icon (not a modal/backdrop drawer), with a `useCart()` hook backed by
Shopify's Storefront Cart API once you're in Phase 2/3. In Phase 1, mock it
with local state.

---

## 7. Section component → data shape reference

Build each homepage section as a typed React component. Suggested prop
shapes (mirrors the Shopify section "settings" schema so mapping real
Shopify data in later is mechanical):

```ts
// Slideshow / hero
type SlideshowSection = {
  autoplay: boolean;
  cycleSpeed: number; // seconds
  paginationType: 'dots' | 'arrows' | 'both' | 'none';
  slides: {
    image: string;
    mobileImage?: string;
    title?: string;
    content?: string;
    contentPosition: 'middle_center' | /* ... */ string;
    showButton: boolean;
    buttonText?: string;
    link?: string;
  }[];
};

// Logo/category list
type LogoListSection = {
  title?: string;
  items: { image: string; text: string; link: string }[];
};

// Featured collection (product carousel)
type FeaturedCollectionSection = {
  title: string;
  collectionHandle: string;
  productsCount: number;
  layout: 'vertical' | 'horizontal';
  showQuickBuy: boolean;
  linkTitle?: string;
};

// Collection list (image tiles)
type CollectionListSection = {
  title: string;
  linkTitle?: string;
  link?: string;
  roundImages: boolean;
  showCollectionTitle: boolean;
  items: { image: string; customTitle?: string; link: string }[];
};

// Blog posts
type BlogPostsSection = {
  title: string;
  blogHandle: string;
  postsCount: number;
  showCategory: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showExcerpt: boolean;
};

// Testimonials
type TestimonialsSection = {
  title: string;
  autoRotate: boolean;
  rotateSpeed: number;
  items: { image: string; title: string; content: string; author: string }[];
};

// Rich text
type RichTextSection = {
  title: string;
  content: string; // HTML
  textAlign: 'left' | 'center' | 'right';
  textWidth: 'narrow' | 'medium' | 'wide';
  buttonText?: string;
  buttonLink?: string;
};

// FAQ
type FaqSection = {
  items: { question: string; answer: string }[];
  showContactInfo: boolean;
  contactInfoHeading?: string;
  contactInfoText?: string;
  contacts: { icon: string; heading: string; text: string }[];
};
```

---

## 8. Shopify integration plan (Phase 2/3)

1. **Auth model**: keep the Shopify Storefront API access token server-side
   in Laravel (`.env`), never in the React bundle. React calls Laravel's own
   `/api/*` routes; Laravel proxies to Shopify's GraphQL Storefront API.
2. **Products/collections**: Laravel endpoints wrapping Storefront GraphQL
   queries — `GET /api/collections/{handle}`, `GET /api/products/{handle}`,
   `GET /api/search?q=`. Cache responses (Redis/DB) with a short TTL to
   avoid hammering Shopify on every page load.
3. **Cart**: use Shopify's Cart API (`cartCreate`, `cartLinesAdd`,
   `cartLinesUpdate`, `cartLinesRemove`) — either call it directly from
   React with a public Storefront token scoped to cart-only, or proxy
   through Laravel for consistency with the rest of the API surface. Persist
   the cart ID in a cookie/localStorage.
4. **Checkout**: **not** Shopify-hosted. Checkout is fully custom — built,
   designed, and rendered entirely by this React/Laravel app, with payment
   collected via a local Indonesian gateway (not Shopify Payments). Shopify's
   cart/checkout object is not used at all here; Shopify is invoked only for
   product/inventory reads and for `orderCreate` once payment succeeds. See
   **§8B** for the full design.
5. **Content that ISN'T product data** (testimonials, FAQ, apotek branch
   locations, the site notice banner text, announcement bar text): model
   these as Laravel-managed content (DB tables + a simple admin CRUD, or
   just config/JSON files to start) rather than trying to force them into
   Shopify metafields — they map to this theme's custom sections, not to
   Shopify's commerce primitives.
6. **Webhooks**: if you need inventory/price to stay fresh without polling,
   register Shopify webhooks (`products/update`, `inventory_levels/update`)
   pointing at a Laravel endpoint that invalidates your cache.
7. **Customer accounts**: Shopify's Customer Account API (new, OAuth-based)
   or classic multipass/customer login — decide based on whether you want
   Shopify-hosted login pages or a fully custom login UI in React.

---

## 8B. Custom checkout architecture (Phase 3)

Checkout is **fully custom** — no Shopify Checkout, no Checkout
Extensibility. Shopify stays the system of record for products/inventory
and becomes the order ledger (via `orderCreate`) after payment succeeds, but
the checkout UI, address/shipping flow, and payment collection are all owned
by this app.

### 8B.0 Hard constraint

**Laravel/React never captures, transmits, stores, or logs raw card numbers,
CVV, or full expiry.** All card entry happens inside DOKU's hosted payment
UI (DOKU Checkout / Jokul redirect or popup). Laravel only ever receives a
**token, a transaction reference, and a status** — never the PAN. This is
what keeps the stack out of full PCI-DSS scope (SAQ A / A-EP territory
instead of SAQ D). Do not build a custom card-number `<input>` anywhere —
that alone would blow PCI scope wide open. E-wallet/QRIS/bank-VA/
Indomaret-Alfamart methods carry no card data at all.

### 8B.1 Gateway — DOKU

Payment gateway: **DOKU** (`createTransaction()`/`verifyWebhookSignature()`/
`getStatus()` wrapped behind a `PaymentGatewayInterface` — keep the adapter
even with a single provider, so a second gateway can be added later without
touching checkout/order logic). DOKU supports cards, VA/bank transfer,
e-wallets (OVO, DANA, ShopeePay, LinkAja), QRIS, and Indomaret/Alfamart cash
payment — covers customers without a card, which matters for a pharmacy
audience. Normalize DOKU's response/webhook payload into an internal status
enum (`pending`/`paid`/`failed`/`expired`/`refunded`) immediately on
ingestion — don't let DOKU's payload shape leak into checkout logic.

Integration specifics to implement against DOKU's API:
- **Auth**: Client ID + Secret Key (sandbox vs. production keys), used to
  generate a request signature per DOKU's signature spec (HMAC-SHA256 over a
  canonical string built from Client-Id, Request-Id, Request-Timestamp,
  and the request body digest) — sign every outbound API call, not just
  webhooks.
- **Checkout creation**: DOKU's Checkout API (`/checkout/v1/payment`) returns
  a hosted payment URL — redirect or embed it, don't try to render DOKU's
  own payment method list yourself.
- **Webhook (notification)**: DOKU posts a notification to a configured URL
  on status change; verify its signature the same way as outbound requests
  before trusting it (§8B.8).

### 8B.2 End-to-end flow

```
[Cart popover, §6]
        │  "Checkout" click
        ▼
POST /api/checkout
  Laravel re-fetches current price/stock from Shopify (never trusts the
  client's cart snapshot), creates a `checkouts` row (status=started) and
  `inventory_holds` rows (soft, ~15 min TTL)
        │
        ▼  React: address + shipping step
PATCH /api/checkout/{ref}/address
PATCH /api/checkout/{ref}/shipping
  Laravel recalculates subtotal/shipping/total server-side on every step —
  totals are never taken from the client
        │
        ▼  React: payment method select → "Pay"
POST /api/checkout/{ref}/pay
  Laravel re-validates the hold hasn't expired, re-checks stock, calls
  DOKU createTransaction() with idempotency key = checkout reference,
  returns DOKU's hosted payment URL / QR to React
        │
        ▼
[Customer pays on DOKU-hosted UI — card, VA, e-wallet, QRIS, or Indomaret/Alfamart]
        │
        ├── async, authoritative ────────────────────────────────────┐
        │                                                             ▼
        │                                     POST /api/webhooks/payment/{gateway}
        │                                       verify signature → idempotent
        │                                       upsert on payments.gateway_ref
        │                                       if status=paid AND not yet
        │                                       processed:
        │                                         a) re-check inventory hold /
        │                                            Shopify stock
        │                                         b) call Shopify orderCreate
        │                                            (idempotent, §8B.5)
        │                                         c) mark checkout=completed
        │                                         d) queue confirmation email
        ▼
React redirected to /order/{ref}/status (informational only)
GET /api/checkout/{ref}/status — polls Laravel's DB state, which is driven
  by the webhook, not by this redirect. Show "processing" until the webhook
  flips status.
```

**Key principle:** the webhook is the source of truth for "did payment
succeed" — the browser redirect is only a UX nicety. A customer can close
the tab mid-payment and the order must still be created correctly once the
webhook arrives.

### 8B.3 Inventory correctness

- `inventory_holds` (checkout-scoped, ~15 min TTL) is a **local, advisory**
  reservation — Shopify has no generic "reserve without selling" API for
  this use case, so it's not a hard guarantee.
- Re-check available stock (Shopify level minus other active holds) at every
  mutating checkout step, not just once at the start.
- Only decrement real Shopify inventory by **creating the order** after the
  payment webhook confirms success — never decrement speculatively at
  checkout start. A scheduled job sweeps expired holds.
- **Oversell case** (paid, but stock sold out elsewhere before order
  creation): still create the Shopify order — the customer already paid,
  don't drop it — tag it (e.g. `OVERSOLD_BACKORDER`), alert ops, and support
  an explicit, idempotent partial-refund flow via the gateway's refund API
  if the item can't be fulfilled. Never silently take payment without
  delivering or refunding.

### 8B.4 Shipping & tax — Biteship

Bypassing Shopify Checkout means losing Shopify's `availableShippingRates` —
**Laravel owns shipping logic**, via **Biteship** as the courier aggregator
(single API covering JNE, SiCepat, AnterAja, and instant/same-day couriers
like GoSend/Grab in one integration — no need to integrate each courier
separately).

> **Do not install Biteship's Shopify App Store plugin.** That packaged
> integration's headline feature is "auto-calculated shipping rates at your
> Shopify checkout page" — i.e. it hooks into Shopify's own checkout via the
> Carrier Service API, which is why Shopify requires it be gated to a
> **Grow-plan-or-higher** store even though the app itself is free/low-cost.
> This project's checkout is fully custom (§8B) and never touches Shopify's
> checkout page, so that feature — and its plan requirement — is irrelevant
> here. Instead, sign up for a **plain Biteship account/API key directly at
> biteship.com** (independent of Shopify entirely) and call their REST API
> from `BiteshipClient.php` in Laravel, per the design below. Rate lookup,
> AWB/label generation, tracking, multi-origin, custom pricing, and instant
> couriers (Grab/Gojek/Lalamove) are all available through that raw API with
> no Shopify plan dependency. This means **Shopify Basic is sufficient** —
> the only reason a higher plan was ever needed was the App Store plugin's
> in-checkout rate feature, which this architecture doesn't use. (Storefront
> API reads and Admin API `orderCreate` — the only two things this project
> actually needs from Shopify — are both available on Basic.)

- **Branch pickup**: built directly from the 9 real branches already
  hardcoded in `templates/page.apotek.liquid` (Jengki, Kayu Manis, Pisangan
  Lama, Kalisari, Johar Baru, Jembatan Besi, Koja, Tanah Pasir, Warakas —
  each with `nomor_sia`, `nomor_sipa`, `nama_apoteker`, address, gmaps link,
  hours) — migrate this into a Laravel `branches` table and reuse it as
  pickup-location options. Pickup doesn't call Biteship at all.
- **Live courier rates via Biteship**: at `GET
  /api/checkout/{ref}/shipping-options`, Laravel calls Biteship's rate-check
  endpoint with the selected branch's address as origin and the customer's
  address as destination + package weight/dimensions (derived from the
  checkout line items), and returns the quoted services (regular, same-day,
  instant) as selectable shipping methods. Because Biteship is a single
  integration, live rates don't need to wait for a later phase the way a
  hand-rolled per-courier integration would — flat-rate tiers are still
  worth keeping as a fallback if a Biteship rate lookup fails or times out.
- **Order handoff**: once an order is paid and created in Shopify (§8B.5),
  create the corresponding Biteship shipment/order (courier + rate id
  selected at checkout) to get a tracking number/AWB; store it against the
  `checkouts`/order record and surface it to the customer on the
  confirmation page. Matches the homepage's existing "24-hour delivery" /
  "24-hour pharmacy" copy (`templates/index.json` collection-list section).
- **Delivery status updates**: Biteship supports webhook notifications on
  shipment status changes (picked up, in transit, delivered) — register a
  receiver (`POST /api/webhooks/biteship`) to keep order status in sync
  without polling, verified the same way as the payment webhook (§8B.8).
- **Tax**: `sections/main-cart.liquid` confirms the current cart is
  **tax-inclusive** (`cart.taxes_included`, `taxes_included_but_shipping_at_checkout`
  string). Preserve that convention — no separate tax engine needed unless a
  specific SKU is tax-exclusive, in which case add a per-line tax rate
  field rather than one global rate.

### 8B.5 Order creation & idempotency

- Persist a `reference` UUID on `checkouts` at creation; pass it as the
  gateway's external/order ID so the webhook can be joined back to exactly
  one checkout.
- Before calling Shopify `orderCreate` (GraphQL mutation — preferred over
  the legacy REST orders endpoint), do a DB-transaction check-and-set:
  `UPDATE checkouts SET shopify_order_creation_status='in_progress' WHERE id=?
  AND shopify_order_creation_status='not_started'`. Zero rows affected means
  another worker/webhook-retry already claimed it — return early.
- Store the returned `shopify_order_id` immediately on success so any retry
  short-circuits by checking "does this checkout already have an order?"
  before calling the mutation again.
- Webhook delivery is at-least-once (gateways and Shopify both retry on
  non-2xx/timeout) — the handler must be safe to run twice concurrently via
  the row-lock above, not just an in-memory guard.

### 8B.6 Data model (Laravel — purpose, not full migrations)

| Table | Purpose | Key columns |
|---|---|---|
| `checkouts` | one row per checkout attempt | `reference` (UUID), `customer_id` (nullable — guest checkout supported), `status`, `subtotal_cents`, `shipping_cents`, `tax_cents`, `total_cents`, `shopify_order_id`, `shopify_order_creation_status`, `expires_at` |
| `checkout_line_items` | snapshotted cart lines at checkout time | `shopify_variant_id`, `sku`, `qty`, `unit_price_cents` (server-fetched), `line_total_cents` |
| `shipping_addresses` | delivery address or selected pickup branch | `type` (`delivery`/`pickup`), address fields (incl. `area_id`/postal code for Biteship rate lookups), `branch_id` (FK, when `type=pickup`) |
| `branches` | the 9 physical locations, migrated out of `page.apotek.liquid` | `handle`, `name`, `full_address`, `gmaps_link`, `nomor_sia`, `nomor_sipa`, `nama_apoteker`, `hours_text`, `is_active` |
| `shipping_methods` | flat-rate tiers, pickup, and cached Biteship quotes selected at checkout | `code`, `label`, `type` (`flat`/`pickup`/`biteship`), `price_cents`, `min_subtotal_cents`, `biteship_courier_code`, `biteship_rate_id` |
| `payments` | one row per DOKU transaction attempt | `gateway` (`doku`), `gateway_ref` (unique), `method`, `status`, `amount_cents`, `raw_payload` (JSON), `paid_at` |
| `inventory_holds` | soft, TTL'd reservation | `shopify_variant_id`, `qty`, `expires_at` |
| `webhook_events` | dedupe/audit of every inbound webhook (DOKU payment + Biteship shipment + optional Shopify) | `source` (`doku`/`biteship`/`shopify`), `event_id`, `payload` (JSON), `processed_at`, `signature_valid` — insert-first, process-second |
| `refunds` | oversell/cancellation refund attempts | `payment_id`, `amount_cents`, `reason`, `status`, `gateway_refund_ref` |
| `shipments` | Biteship shipment created after order payment | `checkout_id`, `biteship_order_id`, `courier_code`, `tracking_number` (AWB), `status`, `last_status_at` |

### 8B.7 API endpoints

```
POST   /api/checkout                       create checkout session, snapshot prices/stock, create holds
GET    /api/checkout/{ref}                 fetch current checkout state (resume on refresh)
PATCH  /api/checkout/{ref}/address          set shipping address or pickup branch
GET    /api/checkout/{ref}/shipping-options list available shipping methods (flat/pickup + live Biteship quotes)
PATCH  /api/checkout/{ref}/shipping         select shipping method, server recalculates total
POST   /api/checkout/{ref}/pay              initiate payment via DOKU, returns hosted payment URL / QR
GET    /api/checkout/{ref}/status           poll payment/order/shipment status for the confirmation page
POST   /api/webhooks/payment/doku           DOKU payment notification receiver, signature-verified, idempotent
POST   /api/webhooks/biteship                Biteship shipment status webhook, signature-verified, idempotent
POST   /api/webhooks/shopify/{topic}        (optional) Shopify webhook receiver
```

Rate-limit `POST /api/checkout` and `POST /api/checkout/{ref}/pay` — the two
endpoints most attractive for hold-exhaustion or payment-spam abuse.

### 8B.8 Security

- **Webhook signature verification is mandatory**: verify DOKU's HMAC-SHA256
  request signature (§8B.1) on every inbound payment notification, and
  Biteship's webhook signature (per their webhook-secret/HMAC scheme) on
  every shipment status update. Reject anything that doesn't verify with a
  401 — but still log it to `webhook_events` for forensics.
- If Shopify webhooks are used, verify `X-Shopify-Hmac-SHA256` the same way.
- Dedupe on `(gateway, gateway_ref, status)` with a DB unique constraint so
  redelivery is a no-op at the DB layer, not just app logic.
- **Never trust client-submitted totals** — every price is recalculated
  server-side at each step, especially right before calling the gateway.
- Store `raw_payload` for audit, but never persist PAN even if a response
  happens to include masked card data.
- Consider a client-generated idempotency key on the "Pay" click to guard
  against a double-tap creating two gateway transactions for one checkout.

### 8B.9 What you lose vs. Shopify Checkout (explicit tradeoff)

- **Abandoned checkout recovery** — build your own "started but not
  completed after N hours" email job off the `checkouts` table.
- **Shop Pay** and its cross-store autofill — build your own
  address/payment-method-remember UX.
- **Shopify's fraud analysis** — doesn't run on orders not paid through
  Shopify Checkout; you inherit whatever the gateway exposes and are on the
  hook for your own velocity/heuristic checks if desired.
- **Automatic tax jurisdiction handling** — bypassed; mitigated somewhat
  since Indonesian PPN is comparatively simpler than multi-state US sales
  tax, but still your responsibility.
- **PCI scope reduction** is *mostly* preserved (§8B.0) as long as you stick
  to gateway-hosted payment pages, but you still own more compliance surface
  than Shopify Checkout gives you for free (webhook/secret hygiene, TLS).
- **Continuously A/B-tested checkout UX** — Shopify invests heavily here; a
  custom checkout starts from zero on conversion tuning.
- **Multi-currency/Shopify Markets** — irrelevant for a single-currency IDR
  store today, but note it'd need rebuilding if you ever sell internationally.

Net effect: full design/UX control and more native Indonesian payment
methods (QRIS, Indomaret/Alfamart, bank VA), at the cost of owning fraud,
abandoned-cart recovery, tax, and checkout QA yourself.

### 8B.10 Phased rollout

- **Phase A (MVP)**: DOKU as the only payment gateway, branch-pickup +
  flat-rate shipping only (Biteship integration not wired yet), guest
  checkout, manual ops review for oversell edge cases, email confirmation
  only. This fully replaces Shopify Checkout and removes the need for the
  site's current "ordering unavailable" notice banner (`layout/theme.liquid`
  `.site-notice`).
- **Phase B**: wire up Biteship for live courier rates + shipment
  creation/tracking webhooks, customer accounts + checkout history,
  abandoned-checkout recovery emails.
- **Phase C**: saved/tokenized payment methods for one-click reorder (DOKU
  tokenization only — Laravel still never touches raw PAN), loyalty/
  member-benefit integration, automated oversell/refund handling.

---

## 9. Suggested project structure

```
frontend/ (React)
  src/
    components/
      layout/        Header, AnnouncementBar, Footer, SiteNotice, CartPopover
      sections/       Slideshow, LogoList, FeaturedCollection, CollectionList,
                      CollectionListRectangleImage, BlogPosts, Testimonials,
                      RichText, Faq
      ui/            Button, Badge, IconSvg, ProductCard, RatingStars
    hooks/           useCart, useCollection, useProduct, useSearch
    lib/             api-client.ts (calls Laravel), format helpers
    styles/          tokens.css (design tokens from §2), globals.css
    pages/           Home, Product, Collection, Cart, Search, Blog, Article,
                      Faq/Contact/Team/Career (static pages), ApotekDetail

backend/ (Laravel)
  app/Http/Controllers/Api/
    CollectionController.php
    ProductController.php
    CartController.php
    SearchController.php
    ContentController.php        ← testimonials/FAQ/apotek locations
    CheckoutController.php       ← §8B.7 checkout session endpoints
    PaymentWebhookController.php ← §8B.7/8B.8 DOKU webhook
    ShippingWebhookController.php← §8B.7/8B.8 Biteship webhook
  app/Services/
    ShopifyStorefrontClient.php     ← thin GraphQL client (reads)
    ShopifyAdminClient.php          ← orderCreate (§8B.5)
    Payments/
      PaymentGatewayInterface.php   ← §8B.1
      DokuGateway.php
    Shipping/
      BiteshipClient.php            ← rate lookup + shipment creation (§8B.4)
  app/Models/
    Checkout.php, CheckoutLineItem.php, ShippingAddress.php,
    Branch.php, ShippingMethod.php, Payment.php, InventoryHold.php,
    WebhookEvent.php, Refund.php, Shipment.php        ← §8B.6
  routes/api.php
```

---

## 10. Build checklist (Phase 1 — visual parity)

- [ ] Global tokens: colors, Barlow font, spacing, breakpoints (§2)
- [ ] `<SiteNotice>` banner (§4, bottom)
- [ ] `<AnnouncementBar>` (§3.2)
- [ ] `<Header>` incl. search, cart icon+badge, account, locale selector (§3.3)
- [ ] `<CartPopover>` with mock line items (§6)
- [ ] Homepage section stack, in exact order, with mock/sample data matching
      §7 shapes (§4)
- [ ] `<Footer>` (§3.4)
- [ ] Product page, Collection page, Cart page, Search, static pages (§5)
- [ ] Responsive check at each breakpoint in §2.4 against the live Shopify
      site side-by-side

## 11. Build checklist (Phase 2/3 — Shopify wiring)

- [ ] Laravel `ShopifyStorefrontClient` + `.env` token
- [ ] `/api/collections/*`, `/api/products/*`, `/api/search` endpoints,
      cached
- [ ] Cart API integration (create/add/update/remove), persisted cart ID
- [ ] Content endpoints for testimonials/FAQ/apotek locations
- [ ] Webhook receiver + cache invalidation (product/inventory sync)
- [ ] Customer accounts (decide API: Customer Account API vs. classic)
- [ ] Swap all mock data in Phase-1 components for live API data

## 12. Build checklist (Phase 3 — custom checkout, §8B)

- [ ] `branches` table migrated from `templates/page.apotek.liquid`'s 9
      hardcoded locations
- [ ] `checkouts`/`checkout_line_items`/`shipping_addresses`/
      `shipping_methods`/`payments`/`inventory_holds`/`webhook_events`/
      `refunds`/`shipments` migrations (§8B.6)
- [ ] `PaymentGatewayInterface` + `DokuGateway` implementation (Client ID/
      Secret Key config, request signing, hosted payment URL redirect)
- [ ] Checkout session endpoints (§8B.7): create, address, shipping-options,
      shipping, pay, status
- [ ] DOKU payment webhook receiver with signature verification + idempotent
      upsert (§8B.8)
- [ ] `ShopifyAdminClient::orderCreate` with the idempotency check-and-set
      (§8B.5)
- [ ] Inventory hold creation/re-check/expiry sweep job (§8B.3)
- [ ] Oversell path: order tagging + ops alert + partial-refund flow
- [ ] Flat-rate + branch-pickup shipping options wired to `branches`/
      `shipping_methods`
- [ ] `BiteshipClient`: rate lookup at `shipping-options`, shipment creation
      after payment, tracking-number storage on `shipments` (§8B.4)
- [ ] Biteship shipment-status webhook receiver with signature verification
      + idempotent upsert (§8B.8)
- [ ] Remove/replace the `.site-notice` "ordering unavailable" banner in
      `layout/theme.liquid` once checkout is live (only relevant if this
      Shopify theme stays live during the migration)
- [ ] Rate limiting on `POST /api/checkout` and `POST /api/checkout/{ref}/pay`
