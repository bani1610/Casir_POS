import axios from '@/lib/axios';

export const orderService = {
    /**
     * Paginated + filtered list
     * @param {Object} params - { status, date, from_date, to_date, page, per_page }
     */
    async getPaginated(params = {}) {
        const { data } = await axios.get('/orders', { params });
        return data; // { message, data, meta }
    },

    async getById(id) {
        const { data } = await axios.get(`/orders/${id}`);
        return data.data;
    },

    async create(payload) {
        const { data } = await axios.post('/orders', payload);
        return data.data;
    },

    async updateStatus(id, status) {
        const { data } = await axios.patch(`/orders/${id}/status`, { status });
        return data.data;
    },

    async delete(id) {
        const { data } = await axios.delete(`/orders/${id}`);
        return data;
    },
};
