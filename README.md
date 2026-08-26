# Apotek Inofarma — Storefront

A Laravel + Inertia.js + React rebuild of the Apotek Inofarma pharmacy storefront, originally a Shopify theme ("Warehouse"). The full spec this project was built from lives in [`react-laravel-replica-spec.md`](react-laravel-replica-spec.md).

## What this project is

This app reproduces the Shopify storefront's design and shopping flow (homepage, product/collection pages, search, cart, account) as a standalone Laravel application, using **Inertia.js** so React pages are server-routed by Laravel controllers instead of a separate SPA + REST API. Homepage/product/collection content is still served from a mock content service (see below), but **cart and checkout are wired to a real Shopify store** — this app never collects payment itself.

## How this relates to Shopify

This is a real Shopify store behind the scenes, and orders **must** go through Shopify's own hosted checkout — Shopify's API License and Terms of Use require orders fulfilled through a Shopify store to be paid via Shopify Checkout (or Shopify Plus Checkout Extensibility), not a third-party payment flow bolted on outside it. Earlier revisions of this app briefly built a fully custom checkout (DOKU payment + Biteship shipping); that was removed for exactly this reason before going live.

The current integration:

- **Cart is real, backed by Shopify's Storefront Cart API.** `app/Services/Shopify/ShopifyStorefrontClient.php` is a thin hand-rolled GraphQL client (`Http` facade, no SDK) wrapping `cartCreate`/`cartLinesAdd`/`cartLinesUpdate`/`cartLinesRemove`/`cart`. `app/Http/Controllers/Storefront/CartController.php` exposes this to the browser via `/api/cart*` JSON endpoints, keeping the Storefront access token server-side; the Shopify cart id is kept in the Laravel session (works for guests, no login required).
- **"Add to cart" resolves a real Shopify variant ID by product handle** (`ShopifyStorefrontClient::productVariantIdByHandle()`) at the moment an item is added — the homepage/product mock catalog (`StorefrontContentService`) doesn't carry real variant IDs itself, only handles, so this lookup is what bridges mock browsing to a real, working Shopify cart.
- **Checkout is a plain hand-off**, not a page in this app: "Proceed to checkout" links straight to the Shopify cart's own `checkoutUrl` (`resources/js/Pages/Cart.jsx`, `resources/js/Components/Layout/CartPopover.jsx`). Shopify's hosted checkout handles payment, shipping rates, and tax entirely — this app is not involved in that step at all.
- **Order history is a live read from Shopify**, not a local table. `app/Services/Shopify/ShopifyAdminClient.php` queries Shopify's Admin API for orders by the logged-in customer's email; `ProfileController::edit()` maps that straight into the account page's "Riwayat Pesanan" tab. There is no local `orders` table — Shopify is the only system of record for orders.

You'll need a Shopify custom app (Shopify Admin → Settings → Apps and sales channels → Develop apps) with Storefront API access and an Admin API token with `read_orders` scope; put the store domain and both tokens in `.env` (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_ADMIN_ACCESS_TOKEN` — see `.env.example`). Without these set, cart/checkout/order-history endpoints degrade gracefully (empty cart, empty order history) rather than erroring.

Product/collection/search browsing is still mock content from `app/Services/Storefront/StorefrontContentService.php`, matching the shape a real Shopify Storefront API response would have — see `react-laravel-replica-spec.md` §1/§8 for the original phased plan to swap that for live product reads too. Design tokens (colors, fonts, breakpoints, container widths) in `tailwind.config.js` are named 1:1 with the tokens in the original theme's `config/settings_data.json`, so a merchant's Shopify theme-setting change stays easy to sync manually or via API later.

## Localization

The UI copy is Indonesian throughout. Framework-level messages (validation errors, auth failures, password reset flow) are translated in `lang/id/*.php`, with `APP_LOCALE=id` / `APP_FALLBACK_LOCALE=id` set in `.env`. If you add a new validated field, add its friendly name to the `attributes` array in `lang/id/validation.php` so error messages read naturally (e.g. "Kolom kode pos wajib diisi." instead of "Kolom postal_code wajib diisi.").

## Project layout

```
app/Http/Controllers/Storefront/   Home, Product, Collection, Search, Cart (incl. /api/cart JSON endpoints)
app/Services/Storefront/           StorefrontContentService — mock product/collection/homepage content
app/Services/Shopify/              ShopifyStorefrontClient (cart), ShopifyAdminClient (order history)
app/Models/                        User (no local Order model — Shopify is the order system of record)
resources/js/Pages/                Inertia pages (Home, Product, Collection, Cart, Profile, Auth)
resources/js/Components/Sections/  Homepage section components (slideshow, featured collection, FAQ, etc.)
resources/js/Contexts/CartContext  Cart state backed by the /api/cart endpoints above
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
