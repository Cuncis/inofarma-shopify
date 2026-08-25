import { Head, Link, useForm } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        terms: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <StorefrontLayout>
            <Head title="Buat Akun Saya" />

            <div className="mx-auto max-w-container px-5 py-10 lap:px-10">
                <div className="mx-auto w-full max-w-md rounded border border-border bg-secondary-background p-6 lap:p-8">
                    <h1 className="text-2xl font-medium text-heading">Buat akun saya</h1>

                    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="mb-1 block text-sm text-heading">
                                    Nama depan
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    autoComplete="given-name"
                                    autoFocus
                                    onChange={(event) => setData('first_name', event.target.value)}
                                    className="h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                                />
                                {errors.first_name && <p className="mt-1 text-sm text-error">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="last_name" className="mb-1 block text-sm text-heading">
                                    Nama belakang
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    autoComplete="family-name"
                                    onChange={(event) => setData('last_name', event.target.value)}
                                    className="h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                                />
                                {errors.last_name && <p className="mt-1 text-sm text-error">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="mb-1 block text-sm text-heading">
                                Nomor Telepon
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone}
                                autoComplete="tel"
                                onChange={(event) => setData('phone', event.target.value)}
                                className="h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm text-heading">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(event) => setData('email', event.target.value)}
                                className="h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                            />
                            {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm text-heading">
                                Kata sandi
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(event) => setData('password', event.target.value)}
                                className="h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                            />
                            {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                        </div>

                        <label className="flex items-start gap-2 text-sm text-text">
                            <input
                                type="checkbox"
                                name="terms"
                                checked={data.terms}
                                onChange={(event) => setData('terms', event.target.checked)}
                                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border-border text-accent focus:ring-accent"
                            />
                            <span>
                                Saya telah membaca dan menyetujui{' '}
                                <a href="/pages/kebijakan-privasi" className="text-accent hover:underline">
                                    Kebijakan Privasi
                                </a>{' '}
                                dan{' '}
                                <a href="/pages/syarat-ketentuan" className="text-accent hover:underline">
                                    Syarat &amp; Ketentuan
                                </a>
                            </span>
                        </label>
                        {errors.terms && <p className="text-sm text-error">{errors.terms}</p>}

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-sm bg-primary-button-bg text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Buat akun saya
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-1 text-sm text-text">
                        Sudah punya akun?
                        <Link href={route('login')} className="font-semibold text-accent hover:underline">
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
