import { usePage } from '@inertiajs/react';
import SiteNotice from '@/Components/Layout/SiteNotice';
import AnnouncementBar from '@/Components/Layout/AnnouncementBar';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';
import CartPopover from '@/Components/Layout/CartPopover';

export default function StorefrontLayout({ children }) {
    const { siteNotice, announcementBar, header, footer } = usePage().props;

    return (
        <>
            <AnnouncementBar announcement={announcementBar} />
            <Header header={header} />

            <main id="main">
                <SiteNotice notice={siteNotice} />
                {children}
            </main>

            <Footer footer={footer} />
            <CartPopover />
        </>
    );
}
