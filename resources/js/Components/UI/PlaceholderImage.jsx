export default function PlaceholderImage({ label, aspect = 'aspect-square', className = '', fit = 'object-contain', zoom = false }) {
    if (typeof label === 'string' && /^https?:\/\//.test(label)) {
        return (
            <div className={`overflow-hidden bg-secondary-background ${aspect} ${className}`}>
                <img
                    src={label}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full ${fit} ${zoom ? 'transition-transform duration-500 ease-out group-hover:scale-110' : ''}`}
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
