import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import Breadcrumb from '@/Components/Collection/Breadcrumb';
import FilterSidebar from '@/Components/Collection/FilterSidebar';
import Toolbar from '@/Components/Collection/Toolbar';
import Pagination from '@/Components/Collection/Pagination';
import ProductCard from '@/Components/UI/ProductCard';

export default function Collection({ collection }) {
    const { handle, title, products, pagination, sort, perPageOptions, facets, filters } = collection;

    const navigate = (params) => {
        router.get(`/collections/${handle}`, {
            page: params.page ?? 1,
            per_page: params.perPage ?? pagination.perPage,
            sort: params.sort ?? sort.current,
            availability: params.availability ?? filters.availability,
            min_price: params.minPrice ?? filters.minPrice ?? undefined,
            max_price: params.maxPrice ?? filters.maxPrice ?? undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['collection'],
        });
    };

    return (
        <StorefrontLayout>
            <Head title={title} />

            <div className="mx-auto max-w-container px-5 py-6 lap:px-10">
                <Breadcrumb title={title} />

                <h1 className="mt-4 text-2xl font-medium text-heading">{title}</h1>

                <div className="mt-6 flex flex-col gap-8 lap:flex-row">
                    <aside className="lap:w-64 lap:flex-shrink-0">
                        <FilterSidebar
                            facets={facets}
                            filters={filters}
                            onChange={(nextFilters) => navigate({
                                page: 1,
                                availability: nextFilters.availability,
                                minPrice: nextFilters.minPrice,
                                maxPrice: nextFilters.maxPrice,
                            })}
                        />
                    </aside>

                    <div className="min-w-0 flex-1">
                        <Toolbar
                            pagination={pagination}
                            sort={sort}
                            perPageOptions={perPageOptions}
                            onSortChange={(value) => navigate({ page: 1, sort: value })}
                            onPerPageChange={(value) => navigate({ page: 1, perPage: value })}
                        />

                        {products.length > 0 ? (
                            <div
                                key={`${pagination.currentPage}-${sort.current}-${JSON.stringify(filters)}`}
                                className="mt-6 grid animate-fade-in-up grid-cols-2 overflow-hidden rounded border border-border tablet:grid-cols-3 xl:grid-cols-4"
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} showQuickBuy={false} variant="table" />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-10 text-center text-sm text-text">
                                Tidak ada produk yang sesuai dengan filter yang dipilih.
                            </p>
                        )}

                        <Pagination pagination={pagination} onNavigate={(page) => navigate({ page })} />
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
