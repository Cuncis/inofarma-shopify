import Icon from '@/Components/UI/Icon';

function pageList(current, last) {
    const pages = new Set([1, last, current, current - 1, current + 1]);
    const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);

    const withGaps = [];
    sorted.forEach((page, index) => {
        if (index > 0 && page - sorted[index - 1] > 1) {
            withGaps.push('gap');
        }
        withGaps.push(page);
    });

    return withGaps;
}

export default function Pagination({ pagination, onNavigate }) {
    if (pagination.lastPage <= 1) {
        return null;
    }

    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            {pageList(pagination.currentPage, pagination.lastPage).map((item, index) => (
                item === 'gap' ? (
                    <span key={`gap-${index}`} className="px-1 text-text">...</span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onNavigate(item)}
                        className={`flex h-8 w-8 items-center justify-center rounded-sm text-sm font-semibold transition-all duration-200 ${
                            item === pagination.currentPage
                                ? 'scale-110 bg-primary-button-bg text-primary-button-text'
                                : 'text-heading hover:bg-background'
                        }`}
                    >
                        {item}
                    </button>
                )
            ))}

            {pagination.currentPage < pagination.lastPage && (
                <button
                    type="button"
                    onClick={() => onNavigate(pagination.currentPage + 1)}
                    className="group ml-2 flex items-center gap-1 text-sm font-semibold text-heading transition-colors hover:text-accent hover:underline"
                >
                    Berikutnya
                    <Icon name="arrow-right" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
            )}
        </div>
    );
}
