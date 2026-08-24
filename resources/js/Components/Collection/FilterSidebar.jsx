import { useState } from 'react';
import Icon from '@/Components/UI/Icon';

function CollapsibleGroup({ title, children }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="border-b border-border py-4 first:pt-0">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between text-sm font-semibold text-heading"
            >
                {title}
                <Icon
                    name="plus"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="mt-3">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default function FilterSidebar({ facets, filters, onChange }) {
    const [minPrice, setMinPrice] = useState(filters.minPrice ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? '');

    const toggleAvailability = (key) => {
        const current = filters.availability ?? [];
        const next = current.includes(key)
            ? current.filter((value) => value !== key)
            : [...current, key];

        onChange({ ...filters, availability: next });
    };

    const applyPrice = (event) => {
        event.preventDefault();
        onChange({
            ...filters,
            minPrice: minPrice === '' ? null : Number(minPrice),
            maxPrice: maxPrice === '' ? null : Number(maxPrice),
        });
    };

    return (
        <div className="rounded border border-border bg-secondary-background p-5">
            <h2 className="text-lg font-medium text-heading">Filter</h2>

            <CollapsibleGroup title="Availability">
                <label className="flex items-center gap-2 py-1 text-sm text-text">
                    <input
                        type="checkbox"
                        checked={(filters.availability ?? []).includes('in_stock')}
                        onChange={() => toggleAvailability('in_stock')}
                        className="rounded-sm border-border text-accent focus:ring-accent"
                    />
                    Tersedia ({facets.availability.in_stock.count})
                </label>
                <label className="flex items-center gap-2 py-1 text-sm text-text">
                    <input
                        type="checkbox"
                        checked={(filters.availability ?? []).includes('sold_out')}
                        onChange={() => toggleAvailability('sold_out')}
                        className="rounded-sm border-border text-accent focus:ring-accent"
                    />
                    Habis ({facets.availability.sold_out.count})
                </label>
            </CollapsibleGroup>

            <CollapsibleGroup title="Price">
                <form onSubmit={applyPrice} className="flex items-center gap-2">
                    <label className="flex-1">
                        <span className="sr-only">Harga minimum</span>
                        <input
                            type="number"
                            min={facets.price.min}
                            max={facets.price.max}
                            value={minPrice}
                            onChange={(event) => setMinPrice(event.target.value)}
                            placeholder={`Rp ${facets.price.min}`}
                            className="h-9 w-full rounded-sm border border-border px-2 text-sm focus:border-heading focus:outline-none"
                        />
                    </label>
                    <span className="text-text">-</span>
                    <label className="flex-1">
                        <span className="sr-only">Harga maksimum</span>
                        <input
                            type="number"
                            min={facets.price.min}
                            max={facets.price.max}
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(event.target.value)}
                            placeholder={`Rp ${facets.price.max}`}
                            className="h-9 w-full rounded-sm border border-border px-2 text-sm focus:border-heading focus:outline-none"
                        />
                    </label>
                    <button
                        type="submit"
                        className="h-9 flex-shrink-0 rounded-sm bg-primary-button-bg px-3 text-xs font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                    >
                        Terapkan
                    </button>
                </form>
            </CollapsibleGroup>
        </div>
    );
}
