import { Link } from '@inertiajs/react';
import Icon from '@/Components/UI/Icon';

export default function Breadcrumb({ title }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-text" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-heading">Rumah</Link>
            <Icon name="arrow-right" className="h-3 w-3" />
            <span className="text-heading">{title}</span>
        </nav>
    );
}
