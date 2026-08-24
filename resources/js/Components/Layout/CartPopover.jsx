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
    const { items, isOpen, close, removeItem, updateQty } = useCart();

    if (!isOpen) {
        return null;
    }

    const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <div className="fixed right-5 top-28 z-50 w-[calc(100%-2.5rem)] max-w-sm lap:right-10">
            <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-border bg-secondary-background" />

            <div className="relative rounded border border-border bg-secondary-background shadow-xl">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <h2 className="font-medium text-heading">Keranjang Belanja</h2>
                    <button type="button" onClick={close} aria-label="Tutup keranjang">
                        <Icon name="close" className="h-4 w-4 text-text" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 p-8 text-center">
                        <Icon name="cart" className="h-8 w-8 text-border" />
                        <p className="text-sm text-text">Keranjang belanja Anda masih kosong.</p>
                        <a href="/collections/semua-produk" className="text-sm font-semibold text-accent hover:underline">
                            Jelajahi Produk
                        </a>
                    </div>
                ) : (
                    <>
                        <ul className="max-h-80 space-y-4 overflow-y-auto p-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-3">
                                    <PlaceholderImage label={item.image} className="h-16 w-16 flex-shrink-0" />
                                    <div className="flex flex-1 flex-col">
                                        <span className="text-sm text-heading">{item.title}</span>
                                        <span className="mt-1 text-sm font-semibold text-heading">
                                            {formatPrice(item.price)}
                                        </span>
                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                                className="flex h-6 w-6 items-center justify-center rounded-sm border border-border"
                                                aria-label="Kurangi jumlah"
                                            >
                                                <Icon name="minus" className="h-3 w-3" />
                                            </button>
                                            <span className="w-6 text-center text-sm">{item.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                                className="flex h-6 w-6 items-center justify-center rounded-sm border border-border"
                                                aria-label="Tambah jumlah"
                                            >
                                                <Icon name="plus" className="h-3 w-3" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="ml-auto text-xs text-text hover:text-error"
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
                            <button
                                type="button"
                                className="mt-3 h-12 w-full rounded-sm bg-primary-button-bg font-semibold text-primary-button-text hover:opacity-90"
                            >
                                Checkout
                            </button>
                            <a href="/cart" className="mt-2 block text-center text-sm text-accent hover:underline">
                                Lihat keranjang lengkap
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
