import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'inofarma-cart';

function readStoredItems() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readStoredItems);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Storage unavailable (private browsing, quota) — cart stays in-memory only.
        }
    }, [items]);

    const value = useMemo(() => ({
        items,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((open) => !open),
        addItem: (product, qty = 1) => {
            setItems((current) => {
                const existing = current.find((item) => item.id === product.id);

                if (existing) {
                    return current.map((item) => (
                        item.id === product.id
                            ? { ...item, qty: item.qty + qty }
                            : item
                    ));
                }

                return [...current, { ...product, qty }];
            });
            setIsOpen(true);
        },
        removeItem: (id) => {
            setItems((current) => current.filter((item) => item.id !== id));
        },
        updateQty: (id, qty) => {
            if (qty < 1) {
                setItems((current) => current.filter((item) => item.id !== id));

                return;
            }

            setItems((current) => current.map((item) => (
                item.id === id ? { ...item, qty } : item
            )));
        },
    }), [items, isOpen]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}
