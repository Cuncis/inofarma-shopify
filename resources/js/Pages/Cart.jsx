import { useState } from 'react';
import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
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

export default function Cart() {
    const { items, updateQty, removeItem } = useCart();
    const [notesOpen, setNotesOpen] = useState(false);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <StorefrontLayout>
            <Head title="Keranjang Belanja" />

            <div className="bg-background">
                <div className="mx-auto max-w-container px-5 py-8 lap:px-10">
                    <h1 className="text-2xl font-medium text-heading">
                        {items.length === 0 ? 'Keranjang Belanja' : 'Keranjang saya'}
                    </h1>

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 py-24 text-center">
                            <Icon name="cart" className="h-16 w-16 text-heading" />
                            <p className="text-xl font-medium text-heading">Keranjang Anda kosong</p>
                            <a
                                href="/collections/semua-produk"
                                className="inline-flex h-12 items-center rounded-sm bg-primary-button-bg px-8 font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                            >
                                Belanja produk kami
                            </a>
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 gap-8 lap:grid-cols-3">
                            <div className="rounded border border-border bg-secondary-background lap:col-span-2">
                                <div className="hidden grid-cols-[2fr_1fr_1fr] gap-4 border-b border-border px-5 py-3 text-sm text-text tablet:grid">
                                    <span>Produk</span>
                                    <span>Kuantitas</span>
                                    <span className="text-right">Total</span>
                                </div>

                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-1 gap-4 border-b border-border px-5 py-4 last:border-b-0 tablet:grid-cols-[2fr_1fr_1fr] tablet:items-center">
                                        <div className="flex gap-3">
                                            <PlaceholderImage label={item.image} className="h-16 w-16 flex-shrink-0" />
                                            <div>
                                                {item.vendor && <span className="text-xs uppercase text-text">{item.vendor}</span>}
                                                <p className="text-sm text-heading">{item.title}</p>
                                                <p className="text-sm font-semibold text-accent">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-border transition-colors hover:border-heading"
                                                    aria-label="Kurangi jumlah"
                                                >
                                                    <Icon name="minus" className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center">{item.qty}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-border transition-colors hover:border-heading"
                                                    aria-label="Tambah jumlah"
                                                >
                                                    <Icon name="plus" className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="mt-2 text-sm text-text underline transition-colors hover:text-error"
                                            >
                                                Menghapus
                                            </button>
                                        </div>

                                        <div className="text-right font-semibold text-heading">
                                            {formatPrice(item.price * item.qty)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-fit rounded border border-border bg-secondary-background p-5">
                                <div className="flex items-baseline justify-between border-b border-border pb-4">
                                    <span className="text-lg font-medium text-heading">Total</span>
                                    <span className="text-xl font-semibold text-heading">{formatPrice(total)}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setNotesOpen((open) => !open)}
                                    className="flex w-full items-center justify-between py-4 text-sm font-medium text-heading"
                                >
                                    Instruksi pemesanan
                                    <Icon name={notesOpen ? 'minus' : 'plus'} className="h-3.5 w-3.5" />
                                </button>
                                {notesOpen && (
                                    <textarea
                                        rows={3}
                                        placeholder="Catatan untuk pesanan Anda"
                                        className="mb-4 w-full rounded-sm border border-border p-2 text-sm focus:border-heading focus:outline-none"
                                    />
                                )}

                                <p className="text-sm text-text">Pajak dan ongkos kirim dihitung saat pembayaran</p>

                                <button
                                    type="button"
                                    className="mt-4 h-12 w-full rounded-sm bg-primary-button-bg font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                                >
                                    Check-out
                                </button>
                            </div>
                        </div>
                    )}

                    {items.length > 0 && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text">
                            <Icon name="lock" className="h-4 w-4" />
                            Pembayaran 100% Aman
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
