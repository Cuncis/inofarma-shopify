function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

function formatDate(isoDate) {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(isoDate));
}

const STATUS_BADGE = {
    paid: { label: 'Dibayar', className: 'bg-accent/10 text-accent' },
    pending: { label: 'Menunggu Pembayaran', className: 'bg-background text-heading' },
    failed: { label: 'Gagal', className: 'bg-error/10 text-error' },
};

export default function OrderHistory({ orders }) {
    return (
        <div className="rounded border border-border bg-secondary-background p-5">
            <h2 className="font-medium text-heading">Riwayat Pesanan</h2>

            {orders.length === 0 ? (
                <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
                    <p className="text-sm text-text">Anda belum memiliki riwayat pesanan.</p>
                    <a
                        href="/collections/semua-produk"
                        className="text-sm font-semibold text-accent transition-colors hover:underline"
                    >
                        Jelajahi Produk
                    </a>
                </div>
            ) : (
                <div className="mt-4 flex flex-col gap-3">
                    {orders.map((order) => {
                        const badge = STATUS_BADGE[order.paymentStatus] ?? STATUS_BADGE.pending;

                        return (
                            <a
                                key={order.orderNumber}
                                href={order.statusPageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col gap-2 rounded-sm border border-border p-3 text-sm transition-colors hover:border-heading tablet:flex-row tablet:items-center tablet:justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-heading">{order.orderNumber}</p>
                                    <p className="text-xs text-text">
                                        {`${formatDate(order.date)} · ${order.itemCount} produk`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded-sm px-2 py-1 text-xs font-semibold ${badge.className}`}>
                                        {badge.label}
                                    </span>
                                    <span className="font-semibold text-heading">{formatPrice(order.total)}</span>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
