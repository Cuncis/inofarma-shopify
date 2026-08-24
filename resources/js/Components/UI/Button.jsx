import { Link } from '@inertiajs/react';

const VARIANTS = {
    primary: 'bg-primary-button-bg text-primary-button-text hover:opacity-90',
    secondary: 'bg-secondary-button-bg text-secondary-button-text hover:opacity-90',
    outline: 'border border-heading text-heading hover:bg-heading/5',
};

export default function Button({ href, variant = 'primary', className = '', children, ...props }) {
    const classes = `inline-flex h-12 items-center justify-center rounded-sm px-[30px] font-semibold transition-all duration-200 active:scale-95 ${VARIANTS[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
}
