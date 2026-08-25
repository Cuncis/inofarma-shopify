import { useState } from 'react';
import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useCart } from '@/Contexts/CartContext';
import Icon from '@/Components/UI/Icon';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

const SHIPPING_METHODS = [
    { id: 'reguler', label: 'Reguler', description: 'Estimasi tiba 2-3 hari', price: 15000 },
    { id: 'instan', label: 'Instan', description: 'Estimasi tiba hari ini', price: 25000 },
];

const PAYMENT_METHODS = [
    { id: 'transfer', label: 'Transfer Bank' },
    { id: 'qris', label: 'QRIS / E-Wallet' },
    { id: 'cod', label: 'Bayar di Tempat (COD)' },
];

const COUPONS = {
    HEMAT10: { type: 'percent', value: 10, label: 'Diskon 10%' },
    ONGKIRGRATIS: { type: 'free_shipping', label: 'Gratis Ongkir' },
};

const inputClass = 'h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none';
const labelClass = 'mb-1 block text-sm text-heading';

export default function Checkout() {
    const { items, clearCart } = useCart();
    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
    });
    const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0].id);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
    const [orderNumber, setOrderNumber] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

    const applyCoupon = (event) => {
        event.preventDefault();
        const code = couponCode.trim().toUpperCase();
        const coupon = COUPONS[code];

        if (!coupon) {
            setAppliedCoupon(null);
            setCouponError('Kode promo tidak valid.');

            return;
        }

        setAppliedCoupon({ code, ...coupon });
        setCouponError('');
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const rawShippingCost = SHIPPING_METHODS.find((method) => method.id === shippingMethod)?.price ?? 0;
    const shippingCost = appliedCoupon?.type === 'free_shipping' ? 0 : rawShippingCost;
    const discount = appliedCoupon?.type === 'percent' ? Math.round(subtotal * (appliedCoupon.value / 100)) : 0;
    const total = subtotal + shippingCost - discount;

    const submit = (event) => {
        event.preventDefault();
        const number = `INO-${Date.now().toString().slice(-8)}`;
        setOrderNumber(number);
        clearCart();
    };

    if (orderNumber) {
        return (
            <StorefrontLayout>
                <Head title="Pesanan Diterima" />

                <div className="mx-auto max-w-container px-5 py-16 lap:px-10">
                    <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <Icon name="check" className="h-8 w-8" />
                        </span>
                        <h1 className="text-2xl font-medium text-heading">Pesanan Anda telah diterima!</h1>
                        <p className="text-sm text-text">
                            {'Nomor pesanan Anda '}
                            <span className="font-semibold text-heading">{orderNumber}</span>
                            {'. Kami akan mengirimkan konfirmasi ke '}
                            <span className="font-semibold text-heading">{form.email}</span>.
                        </p>
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

    if (items.length === 0) {
        return (
            <StorefrontLayout>
                <Head title="Checkout" />

                <div className="mx-auto max-w-container px-5 py-16 text-center lap:px-10">
                    <p className="text-xl font-medium text-heading">Keranjang Anda kosong</p>
                    <a
                        href="/collections/semua-produk"
                        className="mt-4 inline-flex h-12 items-center rounded-sm bg-primary-button-bg px-8 font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                    >
                        Belanja produk kami
                    </a>
                </div>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="Checkout" />

            <div className="bg-background">
                <div className="mx-auto max-w-container px-5 py-8 lap:px-10">
                    <h1 className="text-2xl font-medium text-heading">Checkout</h1>

                    <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-8 lap:grid-cols-3">
                        <div className="flex flex-col gap-6 lap:col-span-2">
                            <div className="rounded border border-border bg-secondary-background p-5">
                                <h2 className="font-medium text-heading">Informasi Kontak</h2>
                                <div className="mt-4">
                                    <label htmlFor="email" className={labelClass}>E-mail</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={setField('email')}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="rounded border border-border bg-secondary-background p-5">
                                <h2 className="font-medium text-heading">Alamat Pengiriman</h2>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className={labelClass}>Nama depan</label>
                                        <input
                                            id="firstName"
                                            required
                                            value={form.firstName}
                                            onChange={setField('firstName')}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className={labelClass}>Nama belakang</label>
                                        <input
                                            id="lastName"
                                            required
                                            value={form.lastName}
                                            onChange={setField('lastName')}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="address" className={labelClass}>Alamat</label>
                                    <input
                                        id="address"
                                        required
                                        value={form.address}
                                        onChange={setField('address')}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 tablet:grid-cols-3">
                                    <div>
                                        <label htmlFor="city" className={labelClass}>Kota</label>
                                        <input
                                            id="city"
                                            required
                                            value={form.city}
                                            onChange={setField('city')}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="province" className={labelClass}>Provinsi</label>
                                        <input
                                            id="province"
                                            required
                                            value={form.province}
                                            onChange={setField('province')}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode" className={labelClass}>Kode Pos</label>
                                        <input
                                            id="postalCode"
                                            required
                                            value={form.postalCode}
                                            onChange={setField('postalCode')}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="phone" className={labelClass}>Nomor Telepon</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        value={form.phone}
                                        onChange={setField('phone')}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="rounded border border-border bg-secondary-background p-5">
                                <h2 className="font-medium text-heading">Metode Pengiriman</h2>
                                <div className="mt-4 flex flex-col gap-3">
                                    {SHIPPING_METHODS.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex cursor-pointer items-center justify-between rounded-sm border p-3 text-sm transition-colors ${
                                                shippingMethod === method.id ? 'border-heading' : 'border-border'
                                            }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="shippingMethod"
                                                    checked={shippingMethod === method.id}
                                                    onChange={() => setShippingMethod(method.id)}
                                                    className="h-4 w-4 border-border text-accent focus:ring-accent"
                                                />
                                                <span>
                                                    <span className="block text-heading">{method.label}</span>
                                                    <span className="block text-xs text-text">{method.description}</span>
                                                </span>
                                            </span>
                                            <span className="font-semibold text-heading">{formatPrice(method.price)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded border border-border bg-secondary-background p-5">
                                <h2 className="font-medium text-heading">Metode Pembayaran</h2>
                                <div className="mt-4 flex flex-col gap-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex cursor-pointer items-center gap-3 rounded-sm border p-3 text-sm transition-colors ${
                                                paymentMethod === method.id ? 'border-heading' : 'border-border'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id)}
                                                className="h-4 w-4 border-border text-accent focus:ring-accent"
                                            />
                                            <span className="text-heading">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-fit rounded border border-border bg-secondary-background p-5 lap:sticky lap:top-24">
                            <h2 className="font-medium text-heading">Ringkasan Pesanan</h2>

                            <ul className="mt-4 flex flex-col gap-3">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3">
                                        <PlaceholderImage label={item.image} className="h-10 w-10 flex-shrink-0" />
                                        <div className="flex flex-1 items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm text-heading">{item.title}</p>
                                                <p className="text-xs text-text">{`Qty: ${item.qty}`}</p>
                                            </div>
                                            <span className="whitespace-nowrap text-sm font-semibold text-heading">
                                                {formatPrice(item.price * item.qty)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 border-t border-border pt-4">
                                <label htmlFor="coupon" className={labelClass}>Kode Promo</label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between rounded-sm border border-accent bg-accent/5 px-3 py-2 text-sm">
                                        <span className="font-semibold text-accent">{`${appliedCoupon.code} — ${appliedCoupon.label}`}</span>
                                        <button
                                            type="button"
                                            onClick={removeCoupon}
                                            className="text-xs text-text transition-colors hover:text-error"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            id="coupon"
                                            value={couponCode}
                                            onChange={(event) => setCouponCode(event.target.value)}
                                            placeholder="Masukkan kode"
                                            className="h-10 w-full min-w-0 rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            className="h-10 flex-shrink-0 rounded-sm border border-heading px-4 text-sm font-semibold text-heading transition-colors hover:bg-heading hover:text-white"
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="mt-1 text-xs text-error">{couponError}</p>}
                            </div>

                            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-text">Subtotal</span>
                                    <span className="text-heading">{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-text">Diskon</span>
                                        <span className="text-accent">{`-${formatPrice(discount)}`}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-text">Pengiriman</span>
                                    <span className="text-heading">
                                        {shippingCost === 0 && appliedCoupon?.type === 'free_shipping' ? 'Gratis' : formatPrice(shippingCost)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                                <span className="text-lg font-medium text-heading">Total</span>
                                <span className="text-xl font-semibold text-heading">{formatPrice(total)}</span>
                            </div>

                            <button
                                type="submit"
                                className="mt-4 h-12 w-full rounded-sm bg-primary-button-bg font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                            >
                                Bayar Sekarang
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text">
                                <Icon name="lock" className="h-4 w-4" />
                                Pembayaran 100% Aman
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </StorefrontLayout>
    );
}
