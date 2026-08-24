import { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import Breadcrumb from '@/Components/Collection/Breadcrumb';
import FilterSidebar from '@/Components/Collection/FilterSidebar';
import Toolbar from '@/Components/Collection/Toolbar';
import Pagination from '@/Components/Collection/Pagination';
import ProductCard from '@/Components/UI/ProductCard';

export default function Search({ results }) {
    const { query, products, pagination, sort, perPageOptions, facets, filters, pageResults } = results;
    const [term, setTerm] = useState(query);
    const isFirstRender = useRef(true);

    const navigate = (params) => {
        router.get('/search', {
            q: params.q ?? query,
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
            only: ['results'],
        });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return undefined;
        }

        const timeout = setTimeout(() => {
            navigate({ q: term, page: 1 });
        }, 350);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term]);

    return (
        <StorefrontLayout>
            <Head title={`Pencarian: ${pagination.total} hasil ditemukan untuk "${query}"`} />

            <div className="mx-auto max-w-container px-5 py-6 lap:px-10">
                <Breadcrumb title={`Hasil pencarian untuk "${query}"`} />

                <form
                    onSubmit={(event) => { event.preventDefault(); navigate({ q: term, page: 1 }); }}
                    className="mt-4 flex max-w-md gap-2"
                >
                    <input
                        type="search"
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Cari Produk Kesehatan di Inofarma"
                        className="h-11 flex-1 rounded-sm border border-border px-3 text-sm transition-colors focus:border-heading focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="h-11 rounded-sm bg-primary-button-bg px-6 text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                    >
                        Cari
                    </button>
                </form>

                <h1 className="mt-4 text-2xl font-medium text-heading">
                    {`Produk untuk "${query}"`}
                </h1>

                {query === '' ? (
                    <p className="mt-6 text-sm text-text">Masukkan kata kunci untuk mencari produk.</p>
                ) : (
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
                                    key={`${query}-${pagination.currentPage}-${sort.current}-${JSON.stringify(filters)}`}
                                    className="mt-6 grid animate-fade-in-up grid-cols-2 gap-4 tablet:grid-cols-3 xl:grid-cols-4"
                                >
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} showQuickBuy={false} />
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-10 text-center text-sm text-text">
                                    Tidak ada produk yang cocok dengan pencarian Anda.
                                </p>
                            )}

                            <Pagination pagination={pagination} onNavigate={(page) => navigate({ page })} />
                        </div>
                    </div>
                )}

                {pageResults.length > 0 && (
                    <div className="mt-10 rounded border border-border bg-secondary-background p-5">
                        <h2 className="text-lg font-medium text-heading">
                            {`Halaman dan postingan blog untuk "${query}"`}
                        </h2>
                        <ul className="mt-3 space-y-2">
                            {pageResults.map((page) => (
                                <li key={page.link}>
                                    <a href={page.link} className="text-sm text-accent hover:underline">
                                        {page.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
