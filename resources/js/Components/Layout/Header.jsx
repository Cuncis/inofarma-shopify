import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useCart } from '@/Contexts/CartContext';
import Icon from '@/Components/UI/Icon';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

function SearchForm({ className = '' }) {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const containerRef = useRef(null);
    const requestId = useRef(0);

    useEffect(() => {
        const query = term.trim();

        if (query === '') {
            setResults(null);
            setLoading(false);

            return undefined;
        }

        setLoading(true);
        const id = ++requestId.current;

        const timeout = setTimeout(() => {
            axios.get('/search/predictive', { params: { q: query } })
                .then((response) => {
                    if (id === requestId.current) {
                        setResults(response.data);
                    }
                })
                .finally(() => {
                    if (id === requestId.current) {
                        setLoading(false);
                    }
                });
        }, 250);

        return () => clearTimeout(timeout);
    }, [term]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submit = (event) => {
        event.preventDefault();
        setFocused(false);
        router.get('/search', { q: term });
    };

    const showDropdown = focused && term.trim() !== '';

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <form onSubmit={submit} className="relative flex">
                <span className="sr-only">Cari produk</span>
                <input
                    type="search"
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="Cari Produk Kesehatan di Inofarma"
                    className="h-11 w-full rounded-l-sm border-0 bg-white px-4 text-sm text-heading placeholder:text-text focus:outline-none"
                />
                <button
                    type="submit"
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-r-sm bg-primary-button-bg text-primary-button-text transition-opacity hover:opacity-90"
                    aria-label="Cari"
                >
                    <Icon name="search" className="h-4 w-4" />
                </button>
            </form>

            {showDropdown && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 animate-fade-in-up overflow-hidden rounded-sm border border-border bg-secondary-background text-left shadow-xl">
                    {loading && !results && (
                        <p className="p-4 text-sm text-text">Mencari...</p>
                    )}

                    {results && results.products.length === 0 && (
                        <p className="p-4 text-sm text-text">
                            {`Tidak ada produk yang cocok dengan "${results.query}".`}
                        </p>
                    )}

                    {results && results.products.length > 0 && (
                        <>
                            <ul className="max-h-96 overflow-y-auto">
                                {results.products.map((product) => (
                                    <li key={product.id}>
                                        <a
                                            href={product.link}
                                            className="flex items-center gap-3 border-b border-border p-3 transition-colors last:border-b-0 hover:bg-background"
                                        >
                                            <PlaceholderImage label={product.image} className="h-12 w-12 flex-shrink-0" />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm text-heading">{product.title}</span>
                                                <span className="block text-sm font-semibold text-accent">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={`/search?q=${encodeURIComponent(results.query)}`}
                                className="block bg-background p-3 text-center text-sm font-semibold text-accent transition-colors hover:underline"
                            >
                                {`Lihat semua ${results.total} hasil untuk "${results.query}"`}
                            </a>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Header({ header }) {
    const { items, toggle } = useCart();
    const itemCount = items.reduce((total, item) => total + item.qty, 0);

    return (
        <header className="bg-header-bg">
            <div className="mx-auto flex max-w-container items-center gap-4 px-5 py-4 lap:px-10">
                <Link href="/" className="flex-shrink-0" style={{ maxWidth: header.logo.maxWidth }}>
                    <img src={header.logo.image} alt="Apotek Inofarma" className="h-auto w-full" />
                </Link>

                <div className="hidden flex-1 tablet:block">
                    <SearchForm className="max-w-xl" />
                </div>

                <div className="ml-auto flex items-center gap-6">
                    <Link href="/account" className="hidden flex-col text-right tablet:flex">
                        <span className="text-xs text-header-light-text">Masuk / Daftar</span>
                        <span className="text-sm font-semibold text-header-text">Akun saya</span>
                    </Link>

                    <button
                        type="button"
                        onClick={toggle}
                        className="flex items-center gap-2 text-header-text transition-colors hover:text-header-accent"
                        aria-label="Keranjang"
                    >
                        <span className="relative">
                            <Icon name="cart" className="h-6 w-6" />
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-header-accent text-[10px] font-semibold text-white">
                                {itemCount}
                            </span>
                        </span>
                        <span className="hidden text-sm tablet:inline">Keranjang</span>
                    </button>
                </div>
            </div>

            <div className="px-5 pb-4 tablet:hidden">
                <SearchForm />
            </div>
        </header>
    );
}
