import ProductCard from '@/Components/UI/ProductCard';

export default function FeaturedCollection({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium text-heading">{section.title}</h2>
                {section.linkTitle && (
                    <a
                        href={`/collections/${section.collectionHandle}`}
                        className="text-sm font-semibold text-accent hover:underline"
                    >
                        {section.linkTitle}
                    </a>
                )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
                {section.products.map((product) => (
                    <div key={product.id} className="w-44 flex-shrink-0 tablet:w-52">
                        <ProductCard product={product} showQuickBuy={section.showQuickBuy} />
                    </div>
                ))}
            </div>
        </section>
    );
}
