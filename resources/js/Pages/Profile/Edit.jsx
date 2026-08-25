import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import OrderHistory from './Partials/OrderHistory';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const TABS = [
    { id: 'akun', label: 'Akun' },
    { id: 'pesanan', label: 'Riwayat Pesanan' },
];

export default function Edit({ mustVerifyEmail, status, orders }) {
    const [activeTab, setActiveTab] = useState('akun');

    return (
        <StorefrontLayout>
            <Head title="Akun Saya" />

            <div className="bg-background">
                <div className="mx-auto max-w-container px-5 py-8 lap:px-10">
                    <h1 className="text-2xl font-medium text-heading">Akun Saya</h1>

                    <div className="mt-6 flex flex-col gap-8 lap:flex-row">
                        <aside className="lap:w-64 lap:flex-shrink-0">
                            <nav className="flex flex-row gap-2 overflow-x-auto rounded border border-border bg-secondary-background p-2 lap:flex-col lap:overflow-visible">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-shrink-0 rounded-sm px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-background text-accent'
                                                : 'text-text hover:bg-background hover:text-heading'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}

                                <div className="my-1 hidden border-t border-border lap:block" />

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex-shrink-0 rounded-sm px-4 py-2.5 text-left text-sm font-semibold text-text transition-colors hover:bg-background hover:text-error"
                                >
                                    Keluar
                                </Link>
                            </nav>
                        </aside>

                        <div className="min-w-0 flex-1">
                            {activeTab === 'akun' ? (
                                <div className="flex flex-col gap-6">
                                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                                    <UpdatePasswordForm />
                                    <DeleteUserForm />
                                </div>
                            ) : (
                                <OrderHistory orders={orders} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
