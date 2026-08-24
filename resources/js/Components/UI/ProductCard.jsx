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
        <div className="group flex w-full flex-shrink-0 flex-col rounded border border-border bg-secondary-background p-3 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg">
            <a href={product.link} className="relative block">
                <PlaceholderImage label={product.image} aspect="aspect-square" zoom />
                {product.badge && (
                    <span className="absolute left-2 top-2 animate-fade-in">
                        <Badge label={product.badge} />
                    </span>
                )}
                {isSoldOut && !showQuickBuy && (
                    <span className="absolute right-2 top-2 animate-fade-in rounded-sm bg-product-on-sale px-2 py-1 text-xs font-semibold uppercase text-white">
                        Terjual Habis
                    </span>
                )}
            </a>

            {product.vendor && (
                <span className="mt-3 text-xs uppercase text-text">{product.vendor}</span>
            )}

            <a href={product.link} className={`line-clamp-2 text-sm text-heading transition-colors hover:text-accent hover:underline ${product.vendor ? 'mt-1' : 'mt-3'}`}>
                {product.title}
            </a>

            {typeof product.rating === 'number' && (
                <div className="mt-2">
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                </div>
            )}

            <div className="mt-2 flex items-baseline gap-2">
                <span className={`font-semibold ${isSoldOut ? 'text-product-sold-out' : 'text-accent'}`}>
                    {formatPrice(product.price)}
                </span>
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
                    className="mt-3 h-10 rounded-sm bg-primary-button-bg text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:bg-product-sold-out disabled:opacity-100 disabled:active:scale-100"
                >
                    {isSoldOut ? 'Terjual Habis' : 'Tambah'}
                </button>
            )}
        </div>
    );
}
