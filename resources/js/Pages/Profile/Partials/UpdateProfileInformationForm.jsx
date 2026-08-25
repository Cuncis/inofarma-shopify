import { Link, useForm, usePage } from '@inertiajs/react';

const inputClass = 'h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none';
const labelClass = 'mb-1 block text-sm text-heading';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        phone: user.phone ?? '',
        email: user.email ?? '',
        address: user.address ?? '',
        city: user.city ?? '',
        province: user.province ?? '',
        postal_code: user.postal_code ?? '',
    });

    const setField = (field) => (event) => setData(field, event.target.value);

    const submit = (event) => {
        event.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="rounded border border-border bg-secondary-background p-5">
                <h2 className="font-medium text-heading">Informasi Akun</h2>

                <div className="mt-4 grid grid-cols-1 gap-4 tablet:grid-cols-2">
                    <div>
                        <label htmlFor="first_name" className={labelClass}>Nama depan</label>
                        <input
                            id="first_name"
                            required
                            autoComplete="given-name"
                            value={data.first_name}
                            onChange={setField('first_name')}
                            className={inputClass}
                        />
                        {errors.first_name && <p className="mt-1 text-sm text-error">{errors.first_name}</p>}
                    </div>
                    <div>
                        <label htmlFor="last_name" className={labelClass}>Nama belakang</label>
                        <input
                            id="last_name"
                            required
                            autoComplete="family-name"
                            value={data.last_name}
                            onChange={setField('last_name')}
                            className={inputClass}
                        />
                        {errors.last_name && <p className="mt-1 text-sm text-error">{errors.last_name}</p>}
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="phone" className={labelClass}>Nomor Telepon</label>
                    <input
                        id="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={data.phone}
                        onChange={setField('phone')}
                        className={inputClass}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className={labelClass}>E-mail</label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="username"
                        value={data.email}
                        onChange={setField('email')}
                        className={inputClass}
                    />
                    {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-4 text-sm text-text">
                        Alamat e-mail Anda belum diverifikasi.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ml-1 font-semibold text-accent hover:underline"
                        >
                            Kirim ulang e-mail verifikasi.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-medium text-accent">
                                Tautan verifikasi baru telah dikirim ke e-mail Anda.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="rounded border border-border bg-secondary-background p-5">
                <h2 className="font-medium text-heading">Alamat Pengiriman</h2>
                <p className="mt-1 text-sm text-text">
                    Alamat ini akan digunakan untuk mengisi otomatis formulir checkout Anda.
                </p>

                <div className="mt-4">
                    <label htmlFor="address" className={labelClass}>Alamat</label>
                    <input
                        id="address"
                        autoComplete="street-address"
                        value={data.address}
                        onChange={setField('address')}
                        className={inputClass}
                    />
                    {errors.address && <p className="mt-1 text-sm text-error">{errors.address}</p>}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 tablet:grid-cols-3">
                    <div>
                        <label htmlFor="city" className={labelClass}>Kota</label>
                        <input
                            id="city"
                            autoComplete="address-level2"
                            value={data.city}
                            onChange={setField('city')}
                            className={inputClass}
                        />
                        {errors.city && <p className="mt-1 text-sm text-error">{errors.city}</p>}
                    </div>
                    <div>
                        <label htmlFor="province" className={labelClass}>Provinsi</label>
                        <input
                            id="province"
                            autoComplete="address-level1"
                            value={data.province}
                            onChange={setField('province')}
                            className={inputClass}
                        />
                        {errors.province && <p className="mt-1 text-sm text-error">{errors.province}</p>}
                    </div>
                    <div>
                        <label htmlFor="postal_code" className={labelClass}>Kode Pos</label>
                        <input
                            id="postal_code"
                            inputMode="numeric"
                            maxLength={5}
                            autoComplete="postal-code"
                            value={data.postal_code}
                            onChange={setField('postal_code')}
                            className={inputClass}
                        />
                        {errors.postal_code && <p className="mt-1 text-sm text-error">{errors.postal_code}</p>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="h-11 rounded-sm bg-primary-button-bg px-6 text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Simpan
                </button>

                {recentlySuccessful && <p className="text-sm text-accent">Tersimpan.</p>}
            </div>
        </form>
    );
}
