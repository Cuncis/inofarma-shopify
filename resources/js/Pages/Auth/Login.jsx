import { Head, Link, useForm } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <StorefrontLayout>
            <Head title="Masuk ke Akun Saya" />

            <div className="mx-auto max-w-container px-5 py-10 lap:px-10">
                <div className="mx-auto w-full max-w-md rounded border border-border bg-secondary-background p-6 lap:p-8">
                    <h1 className="text-2xl font-medium text-heading">Masuk ke akun saya</h1>

                    {status && (
                        <div className="mt-4 rounded-sm bg-background p-3 text-sm font-medium text-accent">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
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
                                autoFocus
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
                                autoComplete="current-password"
                                onChange={(event) => setData('password', event.target.value)}
                                className="h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none"
                            />
                            {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-text">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(event) => setData('remember', event.target.checked)}
                                className="h-4 w-4 rounded-sm border-border text-accent focus:ring-accent"
                            />
                            Ingat saya
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-sm bg-primary-button-bg text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Masuk
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col items-center gap-2 text-sm text-text">
                        <p>
                            {'Pelanggan baru? '}
                            <Link href={route('register')} className="font-semibold text-accent hover:underline">
                                Buat akun Anda
                            </Link>
                        </p>
                        {canResetPassword && (
                            <p>
                                {'Lupa kata sandi? '}
                                <Link href={route('password.request')} className="font-semibold text-accent hover:underline">
                                    Pulihkan kata sandi
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
