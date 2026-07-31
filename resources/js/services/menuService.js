import axios from '@/lib/axios';

export const menuService = {
    /**
     * Paginated + filtered list
     * @param {Object} params - { search, category_id, is_available, page, per_page }
     */
    async getPaginated(params = {}) {
        const { data } = await axios.get('/menus', { params });
        return data; // { success, data, meta }
    },

    async getAll() {
        const { data } = await axios.get('/menus', { params: { per_page: 1000 } });
        return data.data;
    },

    async getById(id) {
        const { data } = await axios.get(`/menus/${id}`);
        return data.data;
    },

    async create(formData) {
        const { data } = await axios.post('/menus', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async update(id, formData) {
        formData.append('_method', 'PUT');
        const { data } = await axios.post(`/menus/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async delete(id) {
        const { data } = await axios.delete(`/menus/${id}`);
        return data;
    },

    async toggleAvailable(id) {
        const { data } = await axios.patch(`/menus/${id}/toggle-available`);
        return data;
    },
};
