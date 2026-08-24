export default function Toolbar({ pagination, sort, perPageOptions, onSortChange, onPerPageChange }) {
    return (
        <div className="flex flex-col gap-3 border-b border-border pb-4 tablet:flex-row tablet:flex-wrap tablet:items-center tablet:justify-between">
            <span className="text-sm text-text">
                {pagination.total === 0
                    ? 'Tidak ada produk ditemukan'
                    : `Menampilkan ${pagination.from} - ${pagination.to} dari ${pagination.total} produk`}
            </span>

            <div className="flex flex-col gap-2 text-sm max-phone:gap-3 tablet:flex-row tablet:items-center tablet:gap-4">
                <label className="flex items-center justify-between gap-2 tablet:justify-start">
                    <span className="flex-shrink-0 text-text">Menampilkan:</span>
                    <select
                        value={pagination.perPage}
                        onChange={(event) => onPerPageChange(Number(event.target.value))}
                        className="min-w-0 rounded-sm border border-border py-1.5 pl-2 pr-6 text-heading transition-colors focus:border-heading focus:outline-none"
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>{option} per halaman</option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center justify-between gap-2 tablet:justify-start">
                    <span className="flex-shrink-0 text-text">Urutkan berdasarkan:</span>
                    <select
                        value={sort.current}
                        onChange={(event) => onSortChange(event.target.value)}
                        className="min-w-0 rounded-sm border border-border py-1.5 pl-2 pr-6 text-heading transition-colors focus:border-heading focus:outline-none"
                    >
                        {sort.options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
