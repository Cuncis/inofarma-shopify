import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

const inputClass = 'h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none';
const labelClass = 'mb-1 block text-sm text-heading';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <div className="rounded border border-border bg-secondary-background p-5">
            <h2 className="font-medium text-heading">Ubah Kata Sandi</h2>
            <p className="mt-1 text-sm text-text">
                Gunakan kata sandi yang panjang dan acak agar akun Anda tetap aman.
            </p>

            <form onSubmit={updatePassword} className="mt-4 flex flex-col gap-4">
                <div>
                    <label htmlFor="current_password" className={labelClass}>Kata sandi saat ini</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        autoComplete="current-password"
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                        className={inputClass}
                    />
                    {errors.current_password && <p className="mt-1 text-sm text-error">{errors.current_password}</p>}
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>Kata sandi baru</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        className={inputClass}
                    />
                    {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className={labelClass}>Konfirmasi kata sandi baru</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        className={inputClass}
                    />
                    {errors.password_confirmation && <p className="mt-1 text-sm text-error">{errors.password_confirmation}</p>}
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
        </div>
    );
}
