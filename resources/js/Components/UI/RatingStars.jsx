import Icon from '@/Components/UI/Icon';

export default function RatingStars({ rating, reviewCount }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars = Array.from({ length: 5 }, (_, index) => {
        if (index < full) {
            return 'rating-star';
        }

        if (index === full && half) {
            return 'rating-star-half';
        }

        return null;
    });

    return (
        <div className="flex items-center gap-1">
            <div className="flex text-review-star">
                {stars.map((name, index) => (
                    name
                        ? <Icon key={index} name={name} className="h-3.5 w-3.5" />
                        : <Icon key={index} name="rating-star" className="h-3.5 w-3.5 text-border" />
                ))}
            </div>
            {typeof reviewCount === 'number' && (
                <span className="text-xs text-text">({reviewCount})</span>
            )}
        </div>
    );
}
