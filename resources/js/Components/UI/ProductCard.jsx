import { useCart } from '@/Contexts/CartContext';
import Badge from '@/Components/UI/Badge';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';
import RatingStars from '@/Components/UI/RatingStars';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

export default function ProductCard({ product, showQuickBuy = false }) {
    const { addItem } = useCart();
    const isSoldOut = product.available === false;

    return (
        <div className="flex w-full flex-shrink-0 flex-col rounded border border-border bg-secondary-background p-3">
            <a href={product.link} className="relative block">
                <PlaceholderImage label={product.image} aspect="aspect-square" />
                {product.badge && (
                    <span className="absolute left-2 top-2">
                        <Badge label={product.badge} />
                    </span>
                )}
            </a>

            {product.vendor && (
                <span className="mt-3 text-xs uppercase text-text">{product.vendor}</span>
            )}

            <a href={product.link} className={`line-clamp-2 text-sm text-heading hover:underline ${product.vendor ? 'mt-1' : 'mt-3'}`}>
                {product.title}
            </a>

            {typeof product.rating === 'number' && (
                <div className="mt-2">
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                </div>
            )}

            <div className="mt-2 flex items-baseline gap-2">
                <span className="font-semibold text-accent">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                    <span className="text-xs text-text line-through">
                        {formatPrice(product.compareAtPrice)}
                    </span>
                )}
            </div>

            {showQuickBuy && (
                <button
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => addItem(product)}
                    className="mt-3 h-10 rounded-sm bg-primary-button-bg text-sm font-semibold text-primary-button-text hover:opacity-90 disabled:cursor-not-allowed disabled:bg-product-sold-out disabled:opacity-100"
                >
                    {isSoldOut ? 'Terjual Habis' : 'Tambah'}
                </button>
            )}
        </div>
    );
}
