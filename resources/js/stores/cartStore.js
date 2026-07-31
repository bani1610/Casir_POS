import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart Store untuk Self-Order Pembeli
 * - Disimpan di localStorage
 * - Sesi expire 24 jam
 * - customer_identifier: UUID yang unik per device/sesi
 */

function generateIdentifier() {
    return 'buyer_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

function isSessionExpired(createdAt) {
    if (!createdAt) return true;
    const HOURS_24 = 24 * 60 * 60 * 1000;
    return Date.now() - createdAt > HOURS_24;
}

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],            // [{ id, name, price, image, category, qty }]
            sessionCreatedAt: null,
            customerIdentifier: null,
            lastOrderId: null,

            // ── Inisialisasi / reset sesi ──────────────────────────────────
            initSession: () => {
                const { sessionCreatedAt } = get();
                if (!sessionCreatedAt || isSessionExpired(sessionCreatedAt)) {
                    set({
                        items: [],
                        sessionCreatedAt: Date.now(),
                        customerIdentifier: generateIdentifier(),
                        lastOrderId: null,
                    });
                }
            },

            // ── Cart operations ────────────────────────────────────────────
            addItem: (menu) => set((state) => {
                const existing = state.items.find(i => i.id === menu.id);
                if (existing) {
                    return {
                        items: state.items.map(i =>
                            i.id === menu.id ? { ...i, qty: i.qty + 1 } : i
                        ),
                    };
                }
                return {
                    items: [...state.items, {
                        id: menu.id,
                        name: menu.name,
                        price: menu.price,
                        image: menu.image,
                        category: menu.category?.name,
                        qty: 1,
                    }],
                };
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id),
            })),

            increment: (id) => set((state) => ({
                items: state.items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i),
            })),

            decrement: (id) => set((state) => {
                const item = state.items.find(i => i.id === id);
                if (!item) return state;
                if (item.qty === 1) return { items: state.items.filter(i => i.id !== id) };
                return { items: state.items.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i) };
            }),

            clearCart: () => set({ items: [] }),

            setLastOrderId: (id) => set({ lastOrderId: id }),

            // ── Computed ───────────────────────────────────────────────────
            getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
            getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
            getQty: (id) => get().items.find(i => i.id === id)?.qty ?? 0,
        }),
        {
            name: 'casir-cart',
            // Hanya persist data yang perlu
            partialize: (state) => ({
                items: state.items,
                sessionCreatedAt: state.sessionCreatedAt,
                customerIdentifier: state.customerIdentifier,
                lastOrderId: state.lastOrderId,
            }),
        }
    )
);
