import { useMemo, useState } from 'react';
import { useCart } from '@/Contexts/CartContext';
import RatingStars from '@/Components/UI/RatingStars';
import Icon from '@/Components/UI/Icon';

function formatPrice(cents) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(cents);
}

const STOCK_LABELS = {
    in_stock: { label: 'Stok Tersedia', className: 'text-product-in-stock' },
    low_stock: { label: 'Stok Terbatas', className: 'text-product-low-stock' },
    sold_out: { label: 'Stok Habis', className: 'text-product-sold-out' },
};

export default function BuyBox({ product }) {
    const { addItem } = useCart();
    const [selectedValue, setSelectedValue] = useState(product.variants[0].optionValues[0]);
    const [qty, setQty] = useState(1);

    const variant = useMemo(
        () => product.variants.find((item) => item.optionValues[0] === selectedValue) ?? product.variants[0],
        [selectedValue, product.variants],
    );

    const stock = STOCK_LABELS[variant.stockStatus];
    const isSoldOut = variant.stockStatus === 'sold_out';

    const addToCart = () => {
        addItem(product.handle, qty);
    };

    return (
        <div>
            <h1 className="text-2xl font-medium text-heading">{product.title}</h1>

            {typeof product.rating === 'number' && (
                <div className="mt-2">
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                </div>
            )}

            <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-heading">{formatPrice(variant.price)}</span>
                {variant.compareAtPrice && (
                    <span className="text-text line-through">{formatPrice(variant.compareAtPrice)}</span>
                )}
            </div>

            <p className={`mt-2 text-sm font-semibold ${stock.className}`}>{stock.label}</p>

            <div className="mt-6">
                <span className="text-sm font-medium text-heading">{product.options[0].name}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                    {product.options[0].values.map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedValue(value)}
                            className={`rounded-sm border px-4 py-2 text-sm transition-all duration-200 ${
                                value === selectedValue
                                    ? 'border-heading bg-heading text-white'
                                    : 'border-border text-heading hover:border-heading hover:scale-105'
                            }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setQty((current) => Math.max(1, current - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-border transition-colors hover:border-heading"
                    aria-label="Kurangi jumlah"
                >
                    <Icon name="minus" className="h-4 w-4" />
                </button>
                <span className="w-10 text-center">{qty}</span>
                <button
                    type="button"
                    onClick={() => setQty((current) => current + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-border transition-colors hover:border-heading"
                    aria-label="Tambah jumlah"
                >
                    <Icon name="plus" className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 tablet:flex-row">
                <button
                    type="button"
                    disabled={isSoldOut}
                    onClick={addToCart}
                    className="h-12 flex-1 rounded-sm bg-primary-button-bg font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSoldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                </button>
                <button
                    type="button"
                    disabled={isSoldOut}
                    onClick={addToCart}
                    className="h-12 flex-1 rounded-sm bg-secondary-button-bg font-semibold text-secondary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Beli Sekarang
                </button>
            </div>

            <div
                className="mt-8 border-t border-border pt-6 text-sm text-text"
                dangerouslySetInnerHTML={{ __html: product.description }}
            />

            <p className="mt-4 text-xs text-text">SKU: {product.sku}</p>
        </div>
    );
}
