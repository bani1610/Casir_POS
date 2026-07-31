import axios from '@/lib/axios';

/**
 * Self-Order Service — untuk pembeli tanpa autentikasi
 * Endpoint: /api/v1/self-order/...
 */
export const selfOrderService = {
    async getMenus() {
        const { data } = await axios.get('/self-order/menus');
        // SelfOrderController returns image_url, normalize to image for MenuCard
        return (data.data ?? []).map(m => ({ ...m, image: m.image_url ?? m.image }));
    },

    async placeOrder(payload) {
        // payload: { customer_identifier, payment_method_id, table_number, notes, items }
        const { data } = await axios.post('/self-order/orders', payload);
        return data.data;
    },

    async getOrderStatus(customerIdentifier) {
        const { data } = await axios.get(`/self-order/orders/${customerIdentifier}`);
        return data.data ?? [];
    },
};
