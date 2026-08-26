# Apotek Inofarma — Storefront

A Laravel + Inertia.js + React rebuild of the Apotek Inofarma pharmacy storefront, originally a Shopify theme ("Warehouse"). The full spec this project was built from lives in [`react-laravel-replica-spec.md`](react-laravel-replica-spec.md).

## What this project is

This app reproduces the Shopify storefront's design and shopping flow (homepage, product/collection pages, search, cart, checkout, account) as a standalone Laravel application, using **Inertia.js** so React pages are server-routed by Laravel controllers instead of a separate SPA + REST API. There is no Shopify store connected today — product, collection, and homepage content is served from a single content service using realistic mock data shaped exactly like the eventual real data would be.

Two pieces of the checkout flow **are** wired up to real third-party APIs (see below): payment via DOKU and shipping rates via Biteship. Everything else (auth, profile, order history, product/collection/search content) is native to this Laravel app.

## How this relates to Shopify

The original spec (`react-laravel-replica-spec.md`, §1) describes a 3-phase plan:

1. **Phase 1 (current state):** build the React UI against static/mock data shaped like Shopify's data so the visual rebuild is pixel-accurate.
2. **Phase 2:** Laravel exposes endpoints that proxy Shopify's **Storefront GraphQL API** (products, collections, cart) so a Storefront access token never reaches the browser, merging in Laravel-native content (FAQ, testimonials, apotek branch locations) that isn't naturally "product" data in Shopify.
3. **Phase 3:** swap the mock cart for Shopify's real Cart API, keeping the custom checkout (already built, see below) instead of redirecting to Shopify Checkout — Shopify would then be used only for product/inventory reads and order sync, not for taking payment.

The app is already structured for that migration: `app/Services/Storefront/StorefrontContentService.php` is the single seam all storefront controllers (`Home`, `Product`, `Collection`, `Search`, `Cart`) call through. Its public methods (`homepageSections()`, `productDetail()`, `browseCollection()`, `search()`, etc.) return plain arrays already shaped like what a Shopify Storefront API response would be mapped into — swapping the internals to call a real `ShopifyStorefrontClient` later means no changes to any controller or React page.

Design tokens (colors, fonts, breakpoints, container widths) in `tailwind.config.js` are named 1:1 with the tokens in the original theme's `config/settings_data.json`, so a merchant's Shopify theme-setting change stays easy to sync manually or via API later.

## What's real (not mocked)

- **Payment — DOKU (Jokul Checkout):** `app/Services/Payments/DokuPaymentService.php` creates a real DOKU Checkout session (HMAC-SHA256 signed request) and redirects the customer to DOKU's hosted payment page. `app/Http/Controllers/Webhooks/DokuWebhookController.php` verifies DOKU's webhook signature and marks orders paid.
- **Shipping — Biteship:** `app/Services/Shipping/BiteshipService.php` calls Biteship's rates API live during checkout so the customer sees real courier options and prices for their postal code.
- **Auth, profile & orders:** standard Laravel auth (Breeze-based), extended with address fields on `User` so a logged-in customer's checkout form (contact + shipping address) is pre-filled automatically. Order history is stored in Laravel's own `orders`/`order_items` tables and shown on the account page.

Both DOKU and Biteship run against **sandbox/test credentials** configured via `.env` (`DOKU_*`, `BITESHIP_*` — see `.env.example`). Swap to production keys and set `DOKU_PRODUCTION=true` when ready to go live.

## Localization

The UI copy is Indonesian throughout. Framework-level messages (validation errors, auth failures, password reset flow) are translated in `lang/id/*.php`, with `APP_LOCALE=id` / `APP_FALLBACK_LOCALE=id` set in `.env`. If you add a new validated field, add its friendly name to the `attributes` array in `lang/id/validation.php` so error messages read naturally (e.g. "Kolom kode pos wajib diisi." instead of "Kolom postal_code wajib diisi.").

## Project layout

```
app/Http/Controllers/Storefront/   Home, Product, Collection, Search, Cart, Checkout
app/Http/Controllers/Webhooks/     DokuWebhookController
app/Services/Storefront/           StorefrontContentService — the Shopify-swap seam described above
app/Services/Payments/             DokuPaymentService
app/Services/Shipping/             BiteshipService
app/Models/                        User, Order, OrderItem
resources/js/Pages/                Inertia pages (Home, Product, Collection, Cart, Checkout, Profile, Auth)
resources/js/Components/Sections/  Homepage section components (slideshow, featured collection, FAQ, etc.)
resources/js/Contexts/CartContext  Client-side cart state (local only until Phase 3 wires up Shopify's Cart API)
lang/id/                           Indonesian translations for framework/validation messages
```

## Local development

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate

composer run dev   # serves app + queue + logs + vite together
```

Run tests with `php artisan test --compact`, and format PHP changes with `vendor/bin/pint --dirty`.

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.
