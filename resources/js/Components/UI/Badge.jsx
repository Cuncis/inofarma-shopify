const VARIANTS = {
    sale: 'bg-custom-label-2-bg text-white',
    new: 'bg-custom-label-1-bg text-white',
};

export default function Badge({ label, variant = 'sale' }) {
    if (!label) {
        return null;
    }

    const key = label.toLowerCase() === 'baru' ? 'new' : 'sale';

    return (
        <span className={`inline-block rounded-sm px-2 py-1 text-xs font-semibold ${VARIANTS[key]}`}>
            {label}
        </span>
    );
}
