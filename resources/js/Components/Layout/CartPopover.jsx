import { useEffect, useState } from 'react';
import { useCart } from '@/Contexts/CartContext';
import Icon from '@/Components/UI/Icon';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

function formatPrice(cents) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(cents);
}

export default function CartPopover() {
    const { items, isOpen, close, removeItem, updateQty, checkoutUrl } = useCart();
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            const raf = requestAnimationFrame(() => setVisible(true));

            return () => cancelAnimationFrame(raf);
        }

        setVisible(false);
        const timeout = setTimeout(() => setMounted(false), 200);

        return () => clearTimeout(timeout);
    }, [isOpen]);

    if (!mounted) {
        return null;
    }

    const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <div
            className={`fixed right-5 top-28 z-50 w-[calc(100%-2.5rem)] max-w-sm transition-all duration-200 ease-out lap:right-10 ${
                visible ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'
            }`}
        >
            <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-border bg-secondary-background" />

            <div className="relative rounded border border-border bg-secondary-background shadow-xl">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <h2 className="font-medium text-heading">Keranjang Belanja</h2>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Tutup keranjang"
                        className="transition-transform hover:rotate-90"
                    >
                        <Icon name="close" className="h-4 w-4 text-text" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 p-8 text-center">
                        <Icon name="cart" className="h-8 w-8 text-border" />
                        <p className="text-sm text-text">Keranjang belanja Anda masih kosong.</p>
                        <a href="/collections/semua-produk" className="text-sm font-semibold text-accent transition-colors hover:underline">
                            Jelajahi Produk
                        </a>
                    </div>
                ) : (
                    <>
                        <ul className="max-h-80 space-y-4 overflow-y-auto p-4">
                            {items.map((item) => (
                                <li key={item.lineId} className="flex animate-fade-in gap-3">
                                    <PlaceholderImage label={item.image} className="h-16 w-16 flex-shrink-0" />
                                    <div className="flex flex-1 flex-col">
                                        <span className="text-sm text-heading">{item.title}</span>
                                        <span className="mt-1 text-sm font-semibold text-heading">
                                            {formatPrice(item.price)}
                                        </span>
                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.lineId, item.qty - 1)}
                                                className="flex h-6 w-6 items-center justify-center rounded-sm border border-border transition-colors hover:border-heading"
                                                aria-label="Kurangi jumlah"
                                            >
                                                <Icon name="minus" className="h-3 w-3" />
                                            </button>
                                            <span className="w-6 text-center text-sm">{item.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.lineId, item.qty + 1)}
                                                className="flex h-6 w-6 items-center justify-center rounded-sm border border-border transition-colors hover:border-heading"
                                                aria-label="Tambah jumlah"
                                            >
                                                <Icon name="plus" className="h-3 w-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.lineId)}
                                                className="ml-auto text-xs text-text transition-colors hover:text-error"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-border p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-text">Subtotal</span>
                                <span className="font-semibold text-heading">{formatPrice(subtotal)}</span>
                            </div>
                            <a
                                href={checkoutUrl}
                                className="mt-3 flex h-12 w-full items-center justify-center rounded-sm bg-primary-button-bg font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                            >
                                Checkout
                            </a>
                            <a href="/cart" className="mt-2 block text-center text-sm text-accent transition-colors hover:underline">
                                Lihat keranjang lengkap
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
