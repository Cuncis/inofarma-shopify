export default function PlaceholderImage({ label, aspect = 'aspect-square', className = '', fit = 'object-contain' }) {
    if (typeof label === 'string' && /^https?:\/\//.test(label)) {
        return (
            <div className={`overflow-hidden bg-secondary-background ${aspect} ${className}`}>
                <img
                    src={label}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full ${fit}`}
                />
            </div>
        );
    }

    return (
        <div
            className={`flex items-center justify-center border border-border bg-secondary-background text-center ${aspect} ${className}`}
        >
            <span className="px-2 text-xs text-text/70">{label}</span>
        </div>
    );
}
