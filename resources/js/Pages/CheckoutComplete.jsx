import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import Icon from '@/Components/UI/Icon';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const STATUS_COPY = {
    paid: {
        icon: 'check',
        iconClass: 'bg-accent/10 text-accent',
        title: 'Pesanan Anda telah dibayar!',
    },
    failed: {
        icon: 'close',
        iconClass: 'bg-error/10 text-error',
        title: 'Pembayaran gagal atau dibatalkan',
    },
    pending: {
        icon: 'warning',
        iconClass: 'bg-background text-heading',
        title: 'Menunggu konfirmasi pembayaran',
    },
};

export default function CheckoutComplete({ order }) {
    const status = STATUS_COPY[order.paymentStatus] ?? STATUS_COPY.pending;

    return (
        <StorefrontLayout>
            <Head title="Status Pesanan" />

            <div className="mx-auto max-w-container px-5 py-16 lap:px-10">
                <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                    <span className={`flex h-16 w-16 items-center justify-center rounded-full ${status.iconClass}`}>
                        <Icon name={status.icon} className="h-8 w-8" />
                    </span>
                    <h1 className="text-2xl font-medium text-heading">{status.title}</h1>
                    <p className="text-sm text-text">
                        {'Nomor pesanan Anda '}
                        <span className="font-semibold text-heading">{order.orderNumber}</span>
                        {' senilai '}
                        <span className="font-semibold text-heading">{formatPrice(order.total)}</span>.
                    </p>
                    {order.paymentStatus === 'pending' && (
                        <p className="text-sm text-text">
                            Kami sedang mengonfirmasi pembayaran Anda. Konfirmasi akan dikirim ke
                            {' '}
                            <span className="font-semibold text-heading">{order.email}</span>
                            {' '}
                            setelah pembayaran diverifikasi.
                        </p>
                    )}
                    <a
                        href="/"
                        className="mt-3 inline-flex h-12 items-center rounded-sm bg-primary-button-bg px-8 font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                    >
                        Kembali ke Beranda
                    </a>
                </div>
            </div>
        </StorefrontLayout>
    );
}
