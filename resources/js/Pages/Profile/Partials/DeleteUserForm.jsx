import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const inputClass = 'h-11 w-full rounded-sm border border-border px-3 text-sm text-heading placeholder:text-text focus:border-heading focus:outline-none';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const deleteUser = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className="rounded border border-border bg-secondary-background p-5">
            <h2 className="font-medium text-heading">Hapus Akun</h2>
            <p className="mt-1 text-sm text-text">
                Setelah akun Anda dihapus, semua data akan dihapus secara permanen.
            </p>

            <button
                type="button"
                onClick={() => setConfirmingUserDeletion(true)}
                className="mt-4 h-11 rounded-sm border border-error px-6 text-sm font-semibold text-error transition-colors hover:bg-error hover:text-white"
            >
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-heading">
                        Apakah Anda yakin ingin menghapus akun Anda?
                    </h2>

                    <p className="mt-1 text-sm text-text">
                        Setelah akun Anda dihapus, semua data akan dihapus secara permanen. Masukkan kata sandi Anda untuk konfirmasi.
                    </p>

                    <div className="mt-6">
                        <input
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="Kata sandi"
                            className={inputClass}
                        />
                        {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="h-11 rounded-sm border border-border px-6 text-sm font-semibold text-heading transition-colors hover:border-heading"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-11 rounded-sm bg-error px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Hapus Akun
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
