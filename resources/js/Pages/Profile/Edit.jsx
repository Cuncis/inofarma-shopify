import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <StorefrontLayout>
            <Head title="Akun Saya" />

            <div className="bg-background">
                <div className="mx-auto max-w-container px-5 py-8 lap:px-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-medium text-heading">Akun Saya</h1>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm font-semibold text-text transition-colors hover:text-error"
                        >
                            Keluar
                        </Link>
                    </div>

                    <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col gap-6">
                        <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                        <UpdatePasswordForm />
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
