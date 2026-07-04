import api from '@/lib/axios';

/**
 * Auth Service — Casir POS
 */

export const authService = {
    /**
     * Login dengan email & password
     * @returns {{ token: string, user: object }}
     */
    login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    },

    /**
     * Logout — revoke token di server
     */
    logout: async () => {
        await api.post('/auth/logout');
    },

    /**
     * Ambil data user yang sedang login
     */
    me: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },

    /**
     * Kirim email reset password
     */
    forgotPassword: async (email) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
    },

    /**
     * Reset password dengan token
     */
    resetPassword: async (payload) => {
        const { data } = await api.post('/auth/reset-password', payload);
        return data;
    },
};
