export default function Toolbar({ pagination, sort, perPageOptions, onSortChange, onPerPageChange }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <span className="text-sm text-text">
                {pagination.total === 0
                    ? 'Tidak ada produk ditemukan'
                    : `Menampilkan ${pagination.from} - ${pagination.to} dari ${pagination.total} produk`}
            </span>

            <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2">
                    <span className="text-text">Menampilkan:</span>
                    <select
                        value={pagination.perPage}
                        onChange={(event) => onPerPageChange(Number(event.target.value))}
                        className="rounded-sm border border-border py-1.5 pl-2 pr-6 text-heading transition-colors focus:border-heading focus:outline-none"
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>{option} per halaman</option>
                        ))}
                    </select>
                </label>

                <label className="flex items-center gap-2">
                    <span className="text-text">Urutkan berdasarkan:</span>
                    <select
                        value={sort.current}
                        onChange={(event) => onSortChange(event.target.value)}
                        className="rounded-sm border border-border py-1.5 pl-2 pr-6 text-heading transition-colors focus:border-heading focus:outline-none"
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
