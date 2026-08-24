import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import Gallery from '@/Components/Product/Gallery';
import BuyBox from '@/Components/Product/BuyBox';
import FeaturedCollection from '@/Components/Sections/FeaturedCollection';

export default function Product({ product, recommendations, recentlyViewed }) {
    return (
        <StorefrontLayout>
            <Head title={product.title} />

            <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
                <div className="grid grid-cols-1 gap-10 lap:grid-cols-2">
                    <Gallery images={product.images} />
                    <BuyBox product={product} />
                </div>
            </section>

            {recommendations.length > 0 && (
                <FeaturedCollection
                    section={{
                        title: 'Produk Terkait',
                        products: recommendations,
                        showQuickBuy: true,
                    }}
                />
            )}

            {recentlyViewed.length > 0 && (
                <FeaturedCollection
                    section={{
                        title: 'Baru Saja Dilihat',
                        products: recentlyViewed,
                        showQuickBuy: true,
                    }}
                />
            )}
        </StorefrontLayout>
    );
}
