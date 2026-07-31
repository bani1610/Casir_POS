import axios from '@/lib/axios';

export const paymentMethodService = {
    async getAll() {
        const { data } = await axios.get('/payment-methods');
        return data.data ?? [];
    },
};
