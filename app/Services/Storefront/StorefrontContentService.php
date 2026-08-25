<?php

namespace App\Services\Storefront;

use Illuminate\Support\Str;

/**
 * Mock content sourced directly from the live inofarma.myshopify.com storefront
 * (product names/prices/images, section copy, real CDN asset URLs) so Phase 1
 * renders as a faithful visual clone rather than placeholder content. Phase 2
 * swaps the product/collection methods to call ShopifyStorefrontClient instead.
 */
class StorefrontContentService
{
    private const CDN = 'https://inofarma.com/cdn/shop/files/';

    private const ARTICLES_CDN = 'https://inofarma.com/cdn/shop/articles/';

    /**
     * Full real product catalog captured from the live store, keyed by handle.
     *
     * @var array<string, array{vendor: string, title: string, price: int, image: string, soldOut: bool}>
     */
    private const PRODUCT_CATALOG = [
        'adem-sari-sachet' => ['vendor' => 'INOFARMA', 'title' => 'Adem Sari Sachet', 'price' => 16100, 'image' => 'ID100217-2_22082025_25afdfa2-2da4-4f58-acde-0e449bd91c4e.jpg', 'soldOut' => false],
        'maltofer-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Maltofer Sirup', 'price' => 88200, 'image' => 'ID112319-1_02092025_5a26c345-dd20-4c3b-bdf2-6419ba0171d8.png', 'soldOut' => false],
        'maltofer-drops' => ['vendor' => 'INOFARMA', 'title' => 'Maltofer Drops', 'price' => 78100, 'image' => 'ID112318-1_02092025_31e6e7e3-a32c-44df-a2a0-3433e13e1245.png', 'soldOut' => false],
        'pedialyte-larutan-elektrolit' => ['vendor' => 'INOFARMA', 'title' => 'Pedialyte (Aroma Bubble Gum) Larutan Elektrolit', 'price' => 44000, 'image' => 'ID116086-1_11092025_42361e91-464b-41b0-b5ee-fac82bea5a29.png', 'soldOut' => false],
        'lacidofil-serbuk' => ['vendor' => 'INOFARMA', 'title' => 'Lacidofil Serbuk', 'price' => 390600, 'image' => 'ID111083-2_26082025_3e7bffe0-d0af-4b66-826b-3811acf458e5.jpg', 'soldOut' => false],
        'interlac-serbuk' => ['vendor' => 'INOFARMA', 'title' => 'Interlac Serbuk', 'price' => 421800, 'image' => 'ID109447-3_26082025_ca0f15ec-6efb-4b9f-9f07-5b5bbea6300c.png', 'soldOut' => false],
        'interlac-drops' => ['vendor' => 'INOFARMA', 'title' => 'Interlac Drops', 'price' => 369100, 'image' => 'ID109447-2_26082025_687a7967-d18f-408b-a7a2-688a76dc9666.png', 'soldOut' => false],
        'immu-cea-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Immu-Cea Sirup', 'price' => 128500, 'image' => 'ID109211-2_26082025_e5704648-dc02-4967-98dc-4b27cf1a2350.png', 'soldOut' => false],
        'imboost-kids-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Imboost Kids Sirup', 'price' => 63200, 'image' => 'ID109200-1_26082025_e017772b-0e72-46cc-a5f5-cf44ccd91b88.png', 'soldOut' => false],
        'gabumin-kapsul' => ['vendor' => 'INOFARMA', 'title' => 'Gabumin Kapsul', 'price' => 75900, 'image' => 'ID106995-1_25082025_e5808e36-d918-4999-bf62-261715cd67f9.jpg', 'soldOut' => false],
        'ferriz-strawberry-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Ferriz Rasa Strawberry Sirup', 'price' => 45100, 'image' => 'ID106331-1_26082025_7560faef-cfbf-4622-83a8-3892a762a037.png', 'soldOut' => false],
        'ferriz-strawberry-drops' => ['vendor' => 'INOFARMA', 'title' => 'Ferriz Rasa Strawberry Drops', 'price' => 44900, 'image' => 'ID106329-1_26082025_f047eb2c-60ba-4867-868b-ac3174fcd943.png', 'soldOut' => false],
        'bufect-suspensi' => ['vendor' => 'INOFARMA', 'title' => 'Bufect Suspensi', 'price' => 21800, 'image' => 'ID102759-1_19082025_ddf78b0a-21b3-4cd0-8593-aabbe165113b.jpg', 'soldOut' => false],
        'actifed-sirup-kuning' => ['vendor' => 'INOFARMA', 'title' => 'Actifed Sirup (Kuning)', 'price' => 64000, 'image' => 'ID100167-2_22082025_04479fa2-8f27-4b96-abcc-487aa093c38d.jpg', 'soldOut' => false],
        'actifed-plus-expectorant-sterling-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Actifed Plus Expectorant Sterling Sirup', 'price' => 64000, 'image' => 'ID100166-2_22082025_e9e9ddad-d142-46b7-9563-27ee0b69f7f0.jpg', 'soldOut' => false],
        'obh-combi-anak-batuk-plus-flu-apel-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Obh Combi Anak Batuk Plus Flu Rasa Apel Sirup', 'price' => 18700, 'image' => 'ID115135-1_03092025_482b47a4-86a4-43c2-9cae-1107e6558026.jpg', 'soldOut' => true],
        'alco-flu-plus-batuk-sirup' => ['vendor' => 'INOFARMA', 'title' => 'Alco Flu Plus Batuk Sirup', 'price' => 67400, 'image' => 'ID100420-2_22082025_fe217348-2417-4224-91e4-687c12d1e8c5.jpg', 'soldOut' => false],
        'zincpro-drops' => ['vendor' => 'INOFARMA', 'title' => 'Zincpro Drops', 'price' => 35400, 'image' => 'ID123054-1_19092025_9e91668e-52a4-4534-8858-c15bfd633960.jpg', 'soldOut' => false],
        'thromecon-gel' => ['vendor' => 'INOFARMA', 'title' => 'Thromecon Gel 200 Iu/G', 'price' => 39900, 'image' => 'ID120824-1_18092025_dd608505-0025-42c0-bfe4-14c80953ac76.png', 'soldOut' => false],
        'antimo-anak-strawberry-suspensi' => ['vendor' => 'INOFARMA', 'title' => 'Antimo Anak (Rasa Strawberry) Phapros Suspensi', 'price' => 22700, 'image' => 'ID101116-1_19082025_b3e1671c-633f-46a0-82c9-3b7d0536c73d.png', 'soldOut' => false],
        'alloris-sirup-5mg' => ['vendor' => 'INOFARMA', 'title' => 'Alloris Sirup 5 Mg', 'price' => 80000, 'image' => 'ID100515-1_22082025_d486d04b-1a66-4b99-9dec-8e3508aceb18.jpg', 'soldOut' => false],
        'infeld-gel' => ['vendor' => 'INOFARMA', 'title' => 'Infeld Gel', 'price' => 58000, 'image' => 'ID109326-2_26082025_b3c42193-0136-49e1-b0d9-a812f88186a2.png', 'soldOut' => false],
        'obat-anak-sumang-cap-pedang-serbuk' => ['vendor' => 'INOFARMA', 'title' => 'Obat Anak Sumang Cap Pedang Serbuk 150 Mg', 'price' => 79300, 'image' => 'ID115056-1_03092025_3f1a7e94-8d33-4dc5-9b7b-1a0b05ef71c7.jpg', 'soldOut' => false],
        'kompolax-ifars-emulsi' => ['vendor' => 'INOFARMA', 'title' => 'Kompolax Ifars Emulsi', 'price' => 12300, 'image' => 'ID110803-1_26082025_2d0f5f11-37ee-461b-8ed4-5fd53ced88eb.jpg', 'soldOut' => false],
        'onemed-medicrepe-elastic-bandage-3-inch' => ['vendor' => 'INOFARMA', 'title' => 'Onemed Medicrepe One Elastic Bandage 3 Inch', 'price' => 11300, 'image' => 'ID108776-1_02092025_63802ea9-2be3-4f73-b89c-645d86644184.jpg', 'soldOut' => false],
        'betadine-salep' => ['vendor' => 'INOFARMA', 'title' => 'Betadine Salep', 'price' => 39300, 'image' => 'ID102067-7_19082025_8d614647-a8b9-41d8-ba3b-ae68b203a4bd.jpg', 'soldOut' => false],
        'betadine-salep-15g' => ['vendor' => 'INOFARMA', 'title' => 'Betadine Salep', 'price' => 39300, 'image' => 'ID102067-7_19082025_d8c6830d-3689-42cb-9743-16ac8c7e554e.jpg', 'soldOut' => false],
        'onemed-medicrepe-elastic-bandage-6-inch' => ['vendor' => 'INOFARMA', 'title' => 'Onemed Medicrepe One Elastic Bandage 6 Inch', 'price' => 21800, 'image' => 'ID108778-1_02092025_e39335f1-c1ae-4ed6-a582-14263ec1e9df.jpg', 'soldOut' => false],
    ];

    private const COLLECTIONS = [
        'rekomendasi-untukmu' => [
            'adem-sari-sachet', 'maltofer-sirup', 'maltofer-drops', 'pedialyte-larutan-elektrolit',
            'lacidofil-serbuk', 'interlac-serbuk', 'interlac-drops', 'immu-cea-sirup',
            'imboost-kids-sirup', 'gabumin-kapsul', 'ferriz-strawberry-sirup', 'ferriz-strawberry-drops',
        ],
        'produk-kesehatan-terbaru' => [
            'bufect-suspensi', 'actifed-sirup-kuning', 'actifed-plus-expectorant-sterling-sirup',
            'obh-combi-anak-batuk-plus-flu-apel-sirup', 'alco-flu-plus-batuk-sirup', 'zincpro-drops',
            'thromecon-gel', 'antimo-anak-strawberry-suspensi', 'alloris-sirup-5mg', 'infeld-gel',
            'obat-anak-sumang-cap-pedang-serbuk', 'kompolax-ifars-emulsi',
        ],
        'produk-terlaris-kami' => [
            'onemed-medicrepe-elastic-bandage-3-inch', 'betadine-salep', 'betadine-salep-15g',
            'onemed-medicrepe-elastic-bandage-6-inch',
        ],
    ];

    /**
     * Friendly titles for collection handles reachable from the header/homepage
     * nav links. Every collection currently browses the same real product
     * catalog (Phase 1 has no real per-category product mapping scraped yet)
     * — Phase 2 replaces this with real Storefront API collection queries.
     *
     * @var array<string, string>
     */
    private const COLLECTION_TITLES = [
        'kesehatan' => 'Kesehatan',
        'kebutuhan-keluarga' => 'Kebutuhan Keluarga',
        'alat-kesehatan' => 'Alat Kesehatan',
        'perawatan-tubuh' => 'Perawatan Tubuh',
        'obat-tradisional' => 'Obat Tradisional',
        'vitamin-suplemen' => 'Vitamin & Suplemen',
        'obat-bebas' => 'Obat Bebas',
        'semua-produk' => 'Semua Produk',
        'rekomendasi-untukmu' => 'Rekomendasi Untukmu',
        'produk-kesehatan-terbaru' => 'Produk Kesehatan Terbaru',
        'produk-terlaris-kami' => 'Produk Terlaris Kami',
    ];

    private const SORT_OPTIONS = [
        'featured' => 'Unggulan',
        'best-selling' => 'Produk terlaris',
        'title-ascending' => 'Berdasarkan abjad, A-Z',
        'title-descending' => 'Berdasarkan abjad, Z-A',
        'price-ascending' => 'Berdasarkan harga, rendah ke tinggi',
        'price-descending' => 'Berdasarkan harga, tinggi ke rendah',
        'created-ascending' => 'Berdasarkan tanggal, lama ke baru',
        'created-descending' => 'Berdasarkan tanggal, baru ke lama',
    ];

    private const PER_PAGE_OPTIONS = [24, 36, 48];

    /**
     * @return array{message: string, link: string}
     */
    public function siteNotice(): array
    {
        return [
            'message' => 'Layanan pemesanan melalui website saat ini belum beroperasi. '
                .'Kami mohon maaf atas ketidaknyamanannya. Untuk info seputar Inofarma, '
                .'silakan kunjungi info.inofarma.com.',
            'link' => 'https://info.inofarma.com/',
        ];
    }

    /**
     * @return array{text: string, buttonText: string, buttonLink: string}
     */
    public function announcementBar(): array
    {
        return [
            'text' => 'Belanja di Apotek Inofarma, Lebih Hemat Lebih Lengkap!',
            'buttonText' => 'Tentang Kami',
            'buttonLink' => 'https://info.inofarma.com/',
        ];
    }

    /**
     * @return array{logo: array{image: string, maxWidth: int, mobileMaxWidth: int}}
     */
    public function header(): array
    {
        return [
            'logo' => [
                'image' => self::CDN.'logo_biru-cropped_140x@2x.png',
                'maxWidth' => 140,
                'mobileMaxWidth' => 100,
            ],
        ];
    }

    /**
     * @return array{
     *     textColumn: array{heading: string, content: string},
     *     linksColumn: array{heading: string, items: array<int, array{label: string, link: string}>},
     *     newsletterColumn: array{heading: string, content: string},
     *     copyright: string,
     * }
     */
    public function footer(): array
    {
        return [
            'textColumn' => [
                'heading' => 'Tentang Apotek Inofarma',
                'content' => 'Temukan Solusi Kesehatan Terhemat dan Terlengkap yang Selalu Dekat '
                    .'untuk Masyarakat.',
            ],
            'linksColumn' => [
                'heading' => 'Main Menu',
                'items' => [
                    ['label' => 'Home', 'link' => '/'],
                    ['label' => 'Semua Produk', 'link' => '/collections/semua-produk'],
                    ['label' => 'Tentang Kami', 'link' => 'https://info.inofarma.com/'],
                    ['label' => 'Karir', 'link' => '/pages/karir'],
                    ['label' => 'Hubungi Kami', 'link' => '/pages/hubungi-kami'],
                ],
            ],
            'newsletterColumn' => [
                'heading' => 'Info Sehat dan Hemat',
                'content' => 'Dapatkan informasi kesehatan, program serta penawaran menarik '
                    .'terbaru setiap hari dengan memasukkan email Anda di sini.',
            ],
            'copyright' => '© All rights reserved. '.date('Y').' inofarma.com',
        ];
    }

    /**
     * Ordered homepage section stack, matching the live site's DOM section order.
     *
     * @return array<int, array<string, mixed>>
     */
    public function homepageSections(): array
    {
        return [
            $this->heroSlideshow(),
            $this->categoryLogoList(),
            $this->promoSlideshow(),
            $this->featuredCollection('Rekomendasi Untukmu', 'rekomendasi-untukmu'),
            $this->featuredCollection('Produk Kesehatan Terbaru', 'produk-kesehatan-terbaru'),
            $this->featuredCollection('Produk Terlaris Kami', 'produk-terlaris-kami'),
            $this->brandCollectionList(),
            $this->valuePropCollectionList(),
            $this->apotekCollectionList(),
            $this->blogPosts(),
            $this->bannerSlideshow(),
            $this->testimonials(),
            $this->richText(
                'Apotek Inofarma: Solusi Kesehatan Terhemat dan Terlengkap',
                'Apotek Inofarma hadir sebagai solusi kesehatan terpercaya dengan jaringan '
                .'apotek yang mudah dijangkau dan layanan yang selalu mengutamakan kebutuhan '
                .'pelanggan. Kami menyediakan produk kesehatan terlengkap, vitamin, suplemen, '
                .'dan perawatan diri dengan harga terhemat dan layanan yang bersahabat. Apotek '
                .'Inofarma juga memberikan konsultasi obat gratis dan cek kesehatan dasar '
                .'dengan apoteker profesional. Kami berkomitmen untuk selalu menghadirkan '
                .'program dan penawaran menarik, siap membantu Anda menjaga kesehatan dengan '
                .'cara yang mudah, aman, dan praktis.',
            ),
            $this->richText(
                'Belanja Obat Praktis dengan Layanan Antar 24 Jam',
                'Belanja produk kesehatan kini lebih mudah bersama Apotek Inofarma. Dengan '
                .'layanan apotek buka 24 jam dan antar obat gratis*, kami siap memenuhi '
                .'kebutuhan kesehatan Anda kapan saja, di mana saja. Pemesanan obat dapat '
                .'dilakukan dengan mudah melalui WhatsApp, sehingga Anda dapat menerima obat '
                .'dengan cepat tanpa repot. Apotek Inofarma juga menyediakan tes darah cepat '
                .'(asam urat, gula darah, kolesterol total) dengan harga terjangkau untuk '
                .'membantu Anda memantau kesehatan secara berkala. Selain itu, pelanggan setia '
                .'Sobat Ino dapat menikmati berbagai benefit member eksklusif (untuk pembelian '
                .'di outlet). Semua produk dijamin asli, terdaftar BPOM, dan berkualitas '
                .'tinggi. Bersama Apotek Inofarma, kesehatan selalu lebih dekat, hemat, dan '
                .'bersahabat.',
                '*S&K berlaku',
            ),
            $this->faq(),
        ];
    }

    private function heroSlideshow(): array
    {
        return [
            'type' => 'slideshow',
            'variant' => 'hero',
            'autoplay' => true,
            'cycleSpeed' => 5,
            'paginationType' => 'dots',
            'slides' => [
                ['image' => self::CDN.'hero_banner_1.png', 'contentPosition' => 'middle_center', 'showButton' => false],
                ['image' => self::CDN.'hero_banner_2.png', 'contentPosition' => 'middle_center', 'showButton' => false],
                ['image' => self::CDN.'hero_banner_3.png', 'contentPosition' => 'middle_center', 'showButton' => false],
            ],
        ];
    }

    private function categoryLogoList(): array
    {
        $categories = [
            ['text' => 'Kesehatan', 'image' => 'KESEHATAN.png', 'link' => '/collections/kesehatan'],
            ['text' => 'Kebutuhan Keluarga', 'image' => 'KEBUTUHAN_KELUARGA.png', 'link' => '/collections/kebutuhan-keluarga'],
            ['text' => 'Alat Kesehatan', 'image' => 'ALAT_KESEHATAN.png', 'link' => '/collections/alat-kesehatan'],
            ['text' => 'Perawatan Tubuh', 'image' => 'PERAWATAN_TUBUH.png', 'link' => '/collections/perawatan-tubuh'],
            ['text' => 'Obat Tradisional', 'image' => 'OBAT_TRADISIONAL.png', 'link' => '/collections/obat-tradisional'],
            ['text' => 'Vitamin & Suplemen', 'image' => 'VITAMIN_SUPLEMEN.png', 'link' => '/collections/vitamin-suplemen'],
            ['text' => 'Obat Bebas', 'image' => 'OBAT_BEBAS.png', 'link' => '/collections/obat-bebas'],
            ['text' => 'Semua Produk', 'image' => 'SEMUA_KATEGORI.png', 'link' => '/collections/semua-produk'],
        ];

        return [
            'type' => 'logo-list',
            'items' => array_map(fn (array $category) => [
                'image' => self::CDN.$category['image'],
                'text' => $category['text'],
                'link' => $category['link'],
            ], $categories),
        ];
    }

    private function promoSlideshow(): array
    {
        return [
            'type' => 'slideshow',
            'variant' => 'promo',
            'autoplay' => true,
            'cycleSpeed' => 6,
            'paginationType' => 'none',
            'slides' => [
                ['image' => self::CDN.'pb_1_Desktop.png', 'mobileImage' => self::CDN.'pb_1_mobile.png', 'contentPosition' => 'middle_left', 'showButton' => false],
                ['image' => self::CDN.'pb_2_Desktop.png', 'mobileImage' => self::CDN.'pb_2_mobile.png', 'contentPosition' => 'middle_left', 'showButton' => false],
            ],
        ];
    }

    private function bannerSlideshow(): array
    {
        return [
            'type' => 'slideshow',
            'variant' => 'banner',
            'autoplay' => true,
            'cycleSpeed' => 5,
            'paginationType' => 'both',
            'slides' => [
                ['image' => self::CDN.'bb_1.png', 'contentPosition' => 'middle_center', 'showButton' => false],
                ['image' => self::CDN.'bb_2.png', 'contentPosition' => 'middle_center', 'showButton' => false],
                ['image' => self::CDN.'bb_3.png', 'contentPosition' => 'middle_center', 'showButton' => false],
            ],
        ];
    }

    private function featuredCollection(string $title, string $collectionHandle): array
    {
        return [
            'type' => 'featured-collection',
            'title' => $title,
            'collectionHandle' => $collectionHandle,
            'layout' => 'horizontal',
            'showQuickBuy' => true,
            'linkTitle' => 'Lihat Semua',
            'products' => $this->collectionProducts($collectionHandle),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function collectionProducts(string $collectionHandle): array
    {
        $handles = self::COLLECTIONS[$collectionHandle] ?? [];

        return array_values(array_filter(array_map(
            fn (string $handle) => $this->productSummary($handle),
            $handles,
        )));
    }

    private function productSummary(string $handle): ?array
    {
        $product = self::PRODUCT_CATALOG[$handle] ?? null;

        if ($product === null) {
            return null;
        }

        return [
            'id' => $handle,
            'vendor' => $product['vendor'],
            'title' => $product['title'],
            'price' => $product['price'],
            'compareAtPrice' => null,
            'image' => self::CDN.$product['image'],
            'badge' => null,
            'available' => ! $product['soldOut'],
            'link' => "/products/{$handle}",
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function productDetail(string $handle): ?array
    {
        $product = self::PRODUCT_CATALOG[$handle] ?? null;

        if ($product === null) {
            return null;
        }

        $summary = $this->productSummary($handle);

        return [
            ...$summary,
            'handle' => $handle,
            'sku' => strtoupper(Str::substr(Str::slug($handle, ''), 0, 10)),
            'images' => [$summary['image']],
            'description' => '<p>'.$product['title'].' adalah produk kesehatan pilihan dari Apotek '
                .'Inofarma, tersedia dengan jaminan keaslian dan terdaftar BPOM.</p>'
                .'<ul><li>Aman digunakan sesuai anjuran</li>'
                .'<li>Terdaftar di BPOM</li><li>Tersedia di seluruh cabang Apotek Inofarma</li></ul>',
            'options' => [
                ['name' => 'Kemasan', 'values' => ['Standar']],
            ],
            'variants' => [
                [
                    'id' => "{$handle}-default",
                    'optionValues' => ['Standar'],
                    'title' => 'Standar',
                    'price' => $product['price'],
                    'compareAtPrice' => null,
                    'stockStatus' => $product['soldOut'] ? 'sold_out' : 'in_stock',
                ],
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function productRecommendations(string $handle, int $count = 8): array
    {
        $handles = array_diff(array_keys(self::PRODUCT_CATALOG), [$handle]);

        return array_values(array_filter(array_map(
            fn (string $productHandle) => $this->productSummary($productHandle),
            array_slice($handles, 0, $count),
        )));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function recentlyViewedProducts(int $count = 8): array
    {
        $handles = array_slice(array_keys(self::PRODUCT_CATALOG), -$count, $count);

        return array_values(array_filter(array_map(
            fn (string $handle) => $this->productSummary($handle),
            $handles,
        )));
    }

    /**
     * @param  array{page?: int, perPage?: int, sort?: string, availability?: array<int, string>, minPrice?: int, maxPrice?: int}  $params
     * @return array<string, mixed>|null
     */
    public function browseCollection(string $handle, array $params = []): ?array
    {
        if (! isset(self::COLLECTION_TITLES[$handle])) {
            return null;
        }

        $all = $this->allProductSummaries();

        return [
            'handle' => $handle,
            'title' => self::COLLECTION_TITLES[$handle],
            ...$this->filterSortPaginate($all, $params),
        ];
    }

    /**
     * @param  array{page?: int, perPage?: int, sort?: string, availability?: array<int, string>, minPrice?: int, maxPrice?: int}  $params
     * @return array<string, mixed>
     */
    public function search(string $query, array $params = []): array
    {
        $needle = mb_strtolower(trim($query));

        $matches = $needle === '' ? [] : array_values(array_filter(
            $this->allProductSummaries(),
            fn (array $product) => str_contains(mb_strtolower($product['title']), $needle),
        ));

        return [
            'query' => $query,
            ...$this->filterSortPaginate($matches, $params),
            'pageResults' => $this->searchPages($needle),
        ];
    }

    /**
     * @return array<int, array{title: string, link: string}>
     */
    private function searchPages(string $needle): array
    {
        if ($needle === '') {
            return [];
        }

        $pages = [
            ['title' => 'Waspadai PCOS! Jangan Sepelekan Siklus Haid Tidak Teratur', 'link' => '/blogs/news/waspadai-pcos-jangan-sepelekan-siklus-haid-tidak-teratur'],
            ['title' => 'Jangan Asal Simpan! Ini Cara Tepat Menyimpan Obat-obatan', 'link' => '/blogs/news/jangan-asal-simpan-ini-cara-tepat-menyimpan-obat-obatan'],
            ['title' => 'Obat yang Wajib Ada dalam Kondisi Darurat', 'link' => '/blogs/news/obat-yang-wajib-ada-dalam-kondisi-darurat'],
            ['title' => 'Tentang Kami', 'link' => 'https://info.inofarma.com/'],
            ['title' => 'Karir', 'link' => '/pages/karir'],
            ['title' => 'Hubungi Kami', 'link' => '/pages/hubungi-kami'],
        ];

        return array_values(array_filter(
            $pages,
            fn (array $page) => str_contains(mb_strtolower($page['title']), $needle),
        ));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function allProductSummaries(): array
    {
        return array_values(array_filter(array_map(
            fn (string $productHandle) => $this->productSummary($productHandle),
            array_keys(self::PRODUCT_CATALOG),
        )));
    }

    /**
     * @param  array<int, array<string, mixed>>  $all
     * @param  array{page?: int, perPage?: int, sort?: string, availability?: array<int, string>, minPrice?: int, maxPrice?: int}  $params
     * @return array<string, mixed>
     */
    private function filterSortPaginate(array $all, array $params): array
    {
        $prices = array_column($all, 'price');
        $priceBounds = $prices === [] ? ['min' => 0, 'max' => 0] : ['min' => min($prices), 'max' => max($prices)];

        $availabilityFilter = array_values(array_intersect(
            $params['availability'] ?? [],
            ['in_stock', 'sold_out'],
        ));

        $filtered = array_values(array_filter($all, function (array $product) use ($availabilityFilter, $params) {
            if ($availabilityFilter !== []) {
                $status = $product['available'] ? 'in_stock' : 'sold_out';
                if (! in_array($status, $availabilityFilter, true)) {
                    return false;
                }
            }

            if (isset($params['minPrice']) && $product['price'] < $params['minPrice']) {
                return false;
            }

            if (isset($params['maxPrice']) && $product['price'] > $params['maxPrice']) {
                return false;
            }

            return true;
        }));

        $sort = $params['sort'] ?? 'featured';
        $filtered = $this->sortProducts($filtered, $sort);

        $perPage = in_array($params['perPage'] ?? null, self::PER_PAGE_OPTIONS, true)
            ? $params['perPage']
            : self::PER_PAGE_OPTIONS[0];

        $total = count($filtered);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = max(1, min($params['page'] ?? 1, $lastPage));

        $pageItems = array_slice($filtered, ($page - 1) * $perPage, $perPage);

        return [
            'products' => $pageItems,
            'pagination' => [
                'currentPage' => $page,
                'lastPage' => $lastPage,
                'perPage' => $perPage,
                'total' => $total,
                'from' => $total === 0 ? 0 : ($page - 1) * $perPage + 1,
                'to' => min($page * $perPage, $total),
            ],
            'sort' => [
                'current' => $sort,
                'options' => collect(self::SORT_OPTIONS)
                    ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
                    ->values()
                    ->all(),
            ],
            'perPageOptions' => self::PER_PAGE_OPTIONS,
            'facets' => [
                'availability' => [
                    'in_stock' => ['label' => 'Tersedia', 'count' => count(array_filter($all, fn (array $p) => $p['available']))],
                    'sold_out' => ['label' => 'Habis', 'count' => count(array_filter($all, fn (array $p) => ! $p['available']))],
                ],
                'price' => $priceBounds,
            ],
            'filters' => [
                'availability' => $availabilityFilter,
                'minPrice' => $params['minPrice'] ?? null,
                'maxPrice' => $params['maxPrice'] ?? null,
            ],
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $products
     * @return array<int, array<string, mixed>>
     */
    private function sortProducts(array $products, string $sort): array
    {
        usort($products, fn (array $a, array $b) => match ($sort) {
            'title-ascending' => $a['title'] <=> $b['title'],
            'title-descending' => $b['title'] <=> $a['title'],
            'price-ascending' => $a['price'] <=> $b['price'],
            'price-descending' => $b['price'] <=> $a['price'],
            'created-descending' => array_search($b['id'], array_keys(self::PRODUCT_CATALOG)) <=> array_search($a['id'], array_keys(self::PRODUCT_CATALOG)),
            default => 0,
        });

        return $products;
    }

    private function brandCollectionList(): array
    {
        $images = [
            'Brand_Terlaris_-_Mockup_Inofarma_Website.png', '2.png', '3.png', '4.png', '5.png',
            '6.png', '7.png', '8.png', '9.png', '10.png',
        ];

        return [
            'type' => 'collection-list',
            'title' => 'Brand Terlaris',
            'roundImages' => true,
            'showCollectionTitle' => false,
            'items' => array_map(fn (string $image, int $index) => [
                'image' => self::CDN.$image,
                'customTitle' => null,
                'link' => '/collections/brand-'.($index + 1),
            ], $images, array_keys($images)),
        ];
    }

    private function valuePropCollectionList(): array
    {
        $items = [
            ['image' => 'PRODUK_KESEHATAN_TERMURAH.png', 'title' => 'Produk Kesehatan Termurah'],
            ['image' => 'HEMAT_SETIAP_HARI.png', 'title' => 'Hemat Setiap Hari'],
            ['image' => 'PRODUK_LENGKAP.png', 'title' => 'Produk Lengkap'],
            ['image' => 'APOTEK_BUKA_24_JAM.png', 'title' => 'Apotek Buka 24 Jam'],
            ['image' => 'LAYANAN_ANTAR_24_JAM.png', 'title' => 'Layanan Antar 24 Jam'],
            ['image' => 'MUDAH_DIJANGKAU.png', 'title' => 'Mudah Dijangkau'],
            ['image' => 'KONSULTASI_GRATIS.png', 'title' => 'Konsultasi Gratis'],
            ['image' => 'BENEFIT_SOBAT_INO.png', 'title' => 'Benefit Sobat Ino'],
            ['image' => 'BELANJA_PRAKTIS.png', 'title' => 'Belanja Praktis'],
        ];

        return [
            'type' => 'collection-list',
            'title' => 'Keuntungan Belanja di Inofarma',
            'roundImages' => false,
            'showCollectionTitle' => true,
            'items' => array_map(fn (array $item) => [
                'image' => self::CDN.$item['image'],
                'customTitle' => $item['title'],
                'link' => null,
            ], $items),
        ];
    }

    private function apotekCollectionList(): array
    {
        $branches = [
            ['name' => 'Jengki', 'handle' => 'apotek1', 'image' => 'unnamed_7.png'],
            ['name' => 'Kayu Manis', 'handle' => 'apotek2', 'image' => 'unnamed_6.png'],
            ['name' => 'Pisangan Lama', 'handle' => 'apotek3', 'image' => 'unnamed_5.png'],
            ['name' => 'Kalisari', 'handle' => 'apotek4', 'image' => 'unnamed_4.png'],
        ];

        return [
            'type' => 'collection-list-rectangle-image',
            'title' => 'Apotek Inofarma Terdekat',
            'items' => array_map(fn (array $branch) => [
                'image' => self::CDN.$branch['image'],
                'customTitle' => 'Apotek Inofarma '.$branch['name'],
                'link' => '/pages/apotek-detail?apotek='.$branch['handle'],
            ], $branches),
        ];
    }

    private function blogPosts(): array
    {
        $posts = [
            [
                'title' => 'Waspadai PCOS! Jangan Sepelekan Siklus Haid Tidak Teratur',
                'category' => 'Kesehatan Wanita',
                'image' => 'image1.png',
            ],
            [
                'title' => 'Jangan Asal Simpan! Ini Cara Tepat Menyimpan Obat-obatan',
                'category' => 'Tips Kesehatan',
                'image' => 'image1_580c28c0-a8ee-4410-acff-245db3c45ec5.jpg',
            ],
            [
                'title' => 'Obat yang Wajib Ada dalam Kondisi Darurat',
                'category' => 'Kesehatan Umum',
                'image' => 'image1_c9353543-5367-4022-a143-293c2db7a7be.jpg',
            ],
        ];

        return [
            'type' => 'blog-posts',
            'title' => 'Artikel Kesehatan',
            'blogHandle' => 'news',
            'showCategory' => true,
            'showAuthor' => true,
            'showDate' => true,
            'showExcerpt' => false,
            'items' => array_map(fn (array $post) => [
                'image' => self::ARTICLES_CDN.$post['image'],
                'title' => $post['title'],
                'category' => $post['category'],
                'author' => 'Apotek Inofarma',
                'date' => '2025-10-17',
                'link' => '/blogs/news/'.Str::slug($post['title']),
            ], $posts),
        ];
    }

    private function testimonials(): array
    {
        $avatars = [self::CDN.'Coba_coba_banner_inofarma_enn_edit_2.png', self::CDN.'Coba_coba_banner_inofarma_enn_edit_1.png'];

        $items = [
            [
                'author' => 'Satara Jufry',
                'branch' => 'Apotek Inofarma Jengki',
                'content' => 'baru kali ini review apotek karena sangat impressed dengan '
                    .'pelayanannya! :) btw, saya beli online via chat customer care di WhatsApp.',
            ],
            [
                'author' => 'Irfan',
                'branch' => 'Apotek Inofarma Kayu Manis',
                'content' => 'Obat-obatannya lengkap, Banyak promo & Harganya sudah murah '
                    .'ditambah diskon lagi klo kita daftar jadi member, Gratis lagi cuma '
                    .'sebutkan nama dan nomer handphone, Cocok bgt buat langganan yg cari obat '
                    .'dengan resep dokter atau tanpa resep dokter.',
            ],
            [
                'author' => 'Jia Nur',
                'branch' => 'Apotek Inofarma Pisangan Lama',
                'content' => 'Pelayanan ramah dan cepat, farmasinya informatif dan membatu '
                    .'menjelaskan obat dengan jelas, stock juga cukup lengkap, bersih, dan '
                    .'sangat memudahkan saat butuh obat mendesak👍🏻',
            ],
            [
                'author' => 'Ismi Khairani',
                'branch' => 'Apotek Inofarma Kalisari',
                'content' => 'Suka banget belanja obat disini, pelayanannya ramah, apalagi '
                    .'kakak nya yang agak muda itu, ramah banget bintang 7 deh kalo bisa.',
            ],
        ];

        return [
            'type' => 'testimonials',
            'title' => 'Testimoni Sobat Ino',
            'autoRotate' => true,
            'rotateSpeed' => 6,
            'items' => array_map(fn (array $item, int $index) => [
                'image' => $avatars[$index % count($avatars)],
                'title' => $item['branch'],
                'content' => $item['content'],
                'author' => $item['author'],
            ], $items, array_keys($items)),
        ];
    }

    private function richText(string $title, string $content, ?string $note = null): array
    {
        return [
            'type' => 'rich-text',
            'title' => $title,
            'content' => '<p>'.$content.'</p>'.($note ? '<p><small>'.$note.'</small></p>' : ''),
            'textAlign' => 'center',
            'textWidth' => 'medium',
        ];
    }

    private function faq(): array
    {
        return [
            'type' => 'faq',
            'items' => [],
            'showContactInfo' => true,
            'contactInfoHeading' => 'Hubungi Inofarma Kapan Saja',
            'contactInfoText' => 'Hubungi kami untuk pertanyaan seputar produk, pesanan, maupun '
                .'layanan dari Apotek Inofarma. Kami selalu siap untuk membantu kebutuhan '
                .'kesehatan Anda.',
            'contacts' => [
                [
                    'icon' => 'bi-customer-support',
                    'heading' => 'Layanan Pelanggan Inofarma',
                    'text' => 'Email: cs@inofarma.com'.PHP_EOL.'WhatsApp: 0812-1401-8964'.PHP_EOL.'Phone: (021) 50959952',
                ],
                [
                    'icon' => 'bi-shield',
                    'heading' => 'Layanan Pengaduan Konsumen',
                    'text' => 'Direktorat Jenderal Perlindungan Konsumen Tertib Niaga'.PHP_EOL
                        .'Kementerian Perdagangan RI'.PHP_EOL.'WhatsApp: 0853-1111-1010',
                ],
            ],
        ];
    }
}
