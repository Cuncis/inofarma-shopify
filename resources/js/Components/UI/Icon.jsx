const PATHS = {
    hamburger: 'M3 6h18M3 12h18M3 18h18',
    close: 'M6 6l12 12M18 6L6 18',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.35-4.35',
    account: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c1.6-3.6 4.8-5.5 8-5.5s6.4 1.9 8 5.5',
    heart: 'M12 20.5S3.5 15.2 3.5 9.4C3.5 6.4 5.9 4 8.8 4c1.7 0 3.2.9 4.2 2.2C14 4.9 15.5 4 17.2 4c2.9 0 5.3 2.4 5.3 5.4 0 5.8-8.5 11.1-8.5 11.1Z',
    warning: 'M12 3 2 21h20L12 3ZM12 10v5M12 18h.01',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    check: 'M5 13l4 4L19 7',
    'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
    'arrow-right': 'M5 12h14M13 6l6 6-6 6',
    sale: 'M20.6 12.3 12.7 20a1.5 1.5 0 0 1-2.1 0l-6.6-6.6a1.5 1.5 0 0 1 0-2.1l7.7-7.7A2 2 0 0 1 13.1 3H19a2 2 0 0 1 2 2v5.9a2 2 0 0 1-.4 1.4ZM15.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
    facebook: 'M14 8.5h2.5V5h-2.5C11.5 5 10 6.6 10 9v2H8v3.5h2V20h3.5v-5.5H16l.5-3.5h-3V9c0-.4.2-.5.5-.5Z',
    instagram: 'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3ZM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM16.7 7.3h.01',
    pinterest: 'M12 4a8 8 0 0 0-3 15.4c-.05-.7-.1-1.8 0-2.6l1.1-4.6s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2-.8 3.1-.2 1 .5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.3 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.1 0 .8.3 1.7.7 2.1a.3.3 0 0 1 .1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.5-1.9-2.2-1.9-3.5C6.1 8.9 8.5 6.5 12 6.5c2.8 0 5 2 5 4.7 0 2.8-1.8 5.1-4.3 5.1-.8 0-1.6-.4-1.9-1l-.5 2c-.2.7-.7 1.6-1 2.1.8.2 1.6.4 2.5.4a8 8 0 0 0 8-8 8 8 0 0 0-8-8Z',
    tiktok: 'M14.5 3h2.6c.2 1.6 1.4 2.9 3 3.2v2.6c-1.1 0-2.2-.3-3-.9v6.4a4.9 4.9 0 1 1-4.9-4.9c.2 0 .4 0 .6.03v2.7a2.2 2.2 0 1 0 1.7 2.2V3Z',
    threads: 'M12 3.5c-4.7 0-7.8 3-7.8 8.5s3.1 8.5 7.8 8.5c3.9 0 6.7-2 7.4-5.4l-2.3-.5c-.5 2.1-2.1 3.4-4.6 3.4-2.9 0-4.7-1.6-5.2-4.4 1 .3 2.2.5 3.6.5 3.5 0 6-1.3 6-4 0-2.3-1.9-3.9-5-3.9-2.6 0-4.6 1.1-5.5 3l2.2.9c.5-1.1 1.6-1.7 3.1-1.7 1.4 0 2.3.6 2.3 1.6 0 1-1.2 1.6-3.5 1.6-1.2 0-2.3-.2-3.2-.5.3-3.4 2-5.1 4.7-5.1 2.9 0 4.7 1.7 5 4.6l2.3-.3c-.5-4-3.2-6.3-7.3-6.3Z',
    'bi-price': 'M20 12 12.6 4.6a2 2 0 0 0-1.4-.6H5a1 1 0 0 0-1 1v6.2c0 .5.2 1 .6 1.4L12 20l8-8ZM8 9h.01',
    'bi-savings': 'M19 10a5.5 5.5 0 0 0-9.3-4H8a3 3 0 0 0-3 3v.5L4 11v3h2v3h3v-2h4v2h3v-3.3c1.2-.6 2-1.9 2-3.2Zm-4-1h.01',
    'bi-complete': 'M4 4h7v7H4V4ZM13 4h7v7h-7V4ZM4 13h7v7H4v-7ZM13 13h7v7h-7v-7Z',
    'bi-shop': 'M4 10 5.5 4h13L20 10M4 10v9h16v-9M4 10h16M9 19v-5h6v5',
    'bi-delivery': 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    'bi-location': 'M12 21s-6.5-5.7-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.3 12 21 12 21ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    'bi-consultation': 'M4 5h16v10H8l-4 4V5Z',
    'bi-member': 'M12 3l2.4 5 5.6.5-4.2 3.7 1.3 5.5L12 14.9 6.9 17.7l1.3-5.5-4.2-3.7L9.6 8 12 3Z',
    'bi-easy-shopping': 'M6 6h15l-1.5 9h-12L6 6ZM6 6 5 3H2M9.5 19a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM17 19a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM10 10.5l1.5 1.5 3-3',
    'bi-customer-support': 'M4 12a8 8 0 0 1 16 0M4 12v4a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1ZM20 12v4a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1ZM9 20h4a2 2 0 0 0 2-2',
    'bi-shield': 'M12 3 4.5 6v6c0 4.5 3.2 7.7 7.5 9 4.3-1.3 7.5-4.5 7.5-9V6L12 3ZM9.5 12.5l1.8 1.8 3.2-3.6',
};

const CART_PATH = 'M6 6h15l-1.5 9h-12L6 6ZM6 6 5 3H2M9.5 19a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM17 19a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z';

function Star({ half = false, className }) {
    const points = '12 2.5 14.6 8.6 21.2 9.3 16.3 13.7 17.7 20.3 12 16.9 6.3 20.3 7.7 13.7 2.8 9.3 9.4 8.6';

    if (!half) {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
                <polygon points={points} />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <defs>
                <clipPath id="half-star-clip">
                    <rect x="0" y="0" width="12" height="24" />
                </clipPath>
            </defs>
            <polygon points={points} fill="none" stroke="currentColor" strokeWidth="1" />
            <polygon points={points} fill="currentColor" clipPath="url(#half-star-clip)" />
        </svg>
    );
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.75 }) {
    if (name === 'cart' || name === 'big-cart') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
                <path d={CART_PATH} />
            </svg>
        );
    }

    if (name === 'rating-star') {
        return <Star className={className} />;
    }

    if (name === 'rating-star-half') {
        return <Star half className={className} />;
    }

    const d = PATHS[name];

    if (!d) {
        return null;
    }

    const isBrandOrBadge = name === 'facebook' || name === 'instagram' || name === 'pinterest'
        || name === 'tiktok' || name === 'threads' || name === 'sale';

    return (
        <svg
            viewBox="0 0 24 24"
            fill={isBrandOrBadge ? 'currentColor' : 'none'}
            stroke={isBrandOrBadge ? 'none' : 'currentColor'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d={d} />
        </svg>
    );
}
