import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

const EMPTY_CART = { id: null, checkoutUrl: null, itemCount: 0, subtotal: 0, items: [] };

export function CartProvider({ children }) {
    const [cart, setCart] = useState(EMPTY_CART);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/cart')
            .then((response) => setCart(response.data))
            .catch(() => {});
    }, []);

    const value = useMemo(() => ({
        items: cart.items,
        itemCount: cart.itemCount,
        subtotal: cart.subtotal,
        checkoutUrl: cart.checkoutUrl,
        isOpen,
        isLoading,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((open) => !open),
        addItem: async (handle, qty = 1) => {
            setIsLoading(true);

            try {
                const response = await axios.post('/api/cart/lines', { handle, qty });
                setCart(response.data);
                setIsOpen(true);
            } finally {
                setIsLoading(false);
            }
        },
        removeItem: async (lineId) => {
            const response = await axios.post('/api/cart/lines/remove', { lineId });
            setCart(response.data);
        },
        updateQty: async (lineId, qty) => {
            const response = await axios.post('/api/cart/lines/update', { lineId, qty });
            setCart(response.data);
        },
    }), [cart, isOpen, isLoading]);

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
