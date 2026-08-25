import { Head, Link, useForm } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('password.email'));
    };

    return (
        <StorefrontLayout>
            <Head title="Pulihkan Kata Sandi" />

            <div className="mx-auto max-w-container px-5 py-10 lap:px-10">
                <div className="mx-auto w-full max-w-md rounded border border-border bg-secondary-background p-6 lap:p-8">
                    <h1 className="text-2xl font-medium text-heading">Pulihkan kata sandi</h1>

                    <p className="mt-2 text-sm text-text">
                        Masukkan alamat e-mail Anda dan kami akan mengirimkan tautan untuk membuat kata sandi baru.
                    </p>

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

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-sm bg-primary-button-bg text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Pulih
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center border-t border-border pt-4 text-sm">
                        <Link href={route('login')} className="font-semibold text-accent hover:underline">
                            Kembali ke halaman masuk
                        </Link>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
