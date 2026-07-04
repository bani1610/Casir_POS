import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store — Casir POS
 *
 * Menyimpan token dan data user yang sedang login.
 * Dipersist ke localStorage agar sesi tetap ada setelah refresh.
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            setAuth: (token, user) =>
                set({ token, user, isAuthenticated: true }),

            logout: () =>
                set({ token: null, user: null, isAuthenticated: false }),

            setUser: (user) => set({ user }),
        }),
        {
            name: 'casir-auth',
            // Hanya simpan token dan user, bukan fungsi
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
