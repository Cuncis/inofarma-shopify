import { Link } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import Icon from '@/Components/UI/Icon';

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
                    <label className="relative flex">
                        <span className="sr-only">Cari produk</span>
                        <input
                            type="search"
                            placeholder="Cari Produk Kesehatan di Inofarma"
                            className="h-11 w-full max-w-xl rounded-l-sm border-0 bg-white px-4 text-sm text-heading placeholder:text-text focus:outline-none"
                        />
                        <button
                            type="button"
                            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-r-sm bg-primary-button-bg text-primary-button-text hover:opacity-90"
                            aria-label="Cari"
                        >
                            <Icon name="search" className="h-4 w-4" />
                        </button>
                    </label>
                </div>

                <div className="ml-auto flex items-center gap-6">
                    <Link href="/account" className="hidden flex-col text-right tablet:flex">
                        <span className="text-xs text-header-light-text">Masuk / Daftar</span>
                        <span className="text-sm font-semibold text-header-text">Akun saya</span>
                    </Link>

                    <button
                        type="button"
                        onClick={toggle}
                        className="flex items-center gap-2 text-header-text hover:text-header-accent"
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
                <label className="relative flex">
                    <span className="sr-only">Cari produk</span>
                    <input
                        type="search"
                        placeholder="Cari Produk Kesehatan di Inofarma"
                        className="h-11 w-full rounded-l-sm border-0 bg-white px-4 text-sm text-heading placeholder:text-text focus:outline-none"
                    />
                    <button
                        type="button"
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-r-sm bg-primary-button-bg text-primary-button-text hover:opacity-90"
                        aria-label="Cari"
                    >
                        <Icon name="search" className="h-4 w-4" />
                    </button>
                </label>
            </div>
        </header>
    );
}
