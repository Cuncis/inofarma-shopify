import { useEffect, useState } from 'react';
import axios from 'axios';
import { Head, usePage } from '@inertiajs/react';
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

function rateKey(rate) {
    return `${rate.courier}:${rate.service}`;
}

export default function Checkout() {
    const { items, clearCart } = useCart();
    const { auth } = usePage().props;
    const [form, setForm] = useState(() => ({
        email: auth.user?.email ?? '',
        firstName: auth.user?.first_name ?? '',
        lastName: auth.user?.last_name ?? '',
        phone: auth.user?.phone ?? '',
        address: auth.user?.address ?? '',
        city: auth.user?.city ?? '',
        province: auth.user?.province ?? '',
        postalCode: auth.user?.postal_code ?? '',
    }));
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const [rates, setRates] = useState([]);
    const [ratesLoading, setRatesLoading] = useState(false);
    const [ratesError, setRatesError] = useState('');
    const [selectedRateKey, setSelectedRateKey] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

    useEffect(() => {
        const postalCode = form.postalCode.trim();

        if (postalCode.length !== 5) {
            setRates([]);
            setSelectedRateKey(null);
            setRatesError('');

            return undefined;
        }

        setRatesLoading(true);
        setRatesError('');

        const timeout = setTimeout(() => {
            axios.post('/checkout/shipping-rates', {
                postal_code: postalCode,
                items: items.map((item) => ({ title: item.title, price: item.price, qty: item.qty })),
            })
                .then((response) => {
                    const fetchedRates = response.data.rates ?? [];
                    setRates(fetchedRates);
                    setSelectedRateKey(fetchedRates.length > 0 ? rateKey(fetchedRates[0]) : null);

                    if (fetchedRates.length === 0) {
                        setRatesError('Tidak ada layanan pengiriman untuk kode pos ini.');
                    }
                })
                .catch(() => {
                    setRates([]);
                    setSelectedRateKey(null);
                    setRatesError('Gagal memuat estimasi ongkos kirim. Periksa kode pos Anda.');
                })
                .finally(() => setRatesLoading(false));
        }, 500);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.postalCode]);

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

    const selectedRate = rates.find((rate) => rateKey(rate) === selectedRateKey) ?? null;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const rawShippingCost = selectedRate?.price ?? 0;
    const shippingCost = appliedCoupon?.type === 'free_shipping' ? 0 : rawShippingCost;
    const discount = appliedCoupon?.type === 'percent' ? Math.round(subtotal * (appliedCoupon.value / 100)) : 0;
    const total = Math.max(0, subtotal - discount + shippingCost);

    const submit = (event) => {
        event.preventDefault();

        if (!selectedRate) {
            setSubmitError('Pilih metode pengiriman terlebih dahulu.');

            return;
        }

        setSubmitting(true);
        setSubmitError('');

        axios.post('/checkout', {
            email: form.email,
            first_name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            province: form.province,
            postal_code: form.postalCode,
            coupon_code: appliedCoupon?.code ?? null,
            shipping_courier: selectedRate.courier,
            shipping_service: selectedRate.service,
            shipping_cost: selectedRate.price,
            payment_method: paymentMethod,
            items: items.map((item) => ({
                id: String(item.id),
                title: item.title,
                price: item.price,
                qty: item.qty,
                image: item.image,
            })),
        })
            .then((response) => {
                clearCart();
                window.location.href = response.data.redirect_url;
            })
            .catch((error) => {
                setSubmitError(error.response?.data?.message ?? 'Terjadi kesalahan, silakan coba lagi.');
                setSubmitting(false);
            });
    };

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
                                            inputMode="numeric"
                                            maxLength={5}
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

                                {form.postalCode.trim().length !== 5 && (
                                    <p className="mt-4 text-sm text-text">Masukkan kode pos untuk melihat pilihan pengiriman.</p>
                                )}

                                {ratesLoading && (
                                    <p className="mt-4 text-sm text-text">Menghitung ongkos kirim...</p>
                                )}

                                {!ratesLoading && ratesError && (
                                    <p className="mt-4 text-sm text-error">{ratesError}</p>
                                )}

                                {!ratesLoading && rates.length > 0 && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        {rates.map((rate) => (
                                            <label
                                                key={rateKey(rate)}
                                                className={`flex cursor-pointer items-center justify-between rounded-sm border p-3 text-sm transition-colors ${
                                                    selectedRateKey === rateKey(rate) ? 'border-heading' : 'border-border'
                                                }`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shippingMethod"
                                                        checked={selectedRateKey === rateKey(rate)}
                                                        onChange={() => setSelectedRateKey(rateKey(rate))}
                                                        className="h-4 w-4 border-border text-accent focus:ring-accent"
                                                    />
                                                    <span>
                                                        <span className="block text-heading">{`${rate.courier_name} - ${rate.service_name}`}</span>
                                                        <span className="block text-xs text-text">{rate.duration}</span>
                                                    </span>
                                                </span>
                                                <span className="font-semibold text-heading">{formatPrice(rate.price)}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
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
                                        {selectedRate === null
                                            ? '—'
                                            : shippingCost === 0 && appliedCoupon?.type === 'free_shipping'
                                                ? 'Gratis'
                                                : formatPrice(shippingCost)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                                <span className="text-lg font-medium text-heading">Total</span>
                                <span className="text-xl font-semibold text-heading">{formatPrice(total)}</span>
                            </div>

                            {submitError && <p className="mt-3 text-sm text-error">{submitError}</p>}

                            <button
                                type="submit"
                                disabled={submitting || !selectedRate}
                                className="mt-4 h-12 w-full rounded-sm bg-primary-button-bg font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? 'Memproses...' : 'Bayar Sekarang'}
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
