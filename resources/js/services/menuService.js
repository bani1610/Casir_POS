import axios from '@/lib/axios';

export const menuService = {
    async getAll() {
        const { data } = await axios.get('/api/v1/menus');
        return data.data;
    },

    async getById(id) {
        const { data } = await axios.get(`/api/v1/menus/${id}`);
        return data.data;
    },

    async create(formData) {
        const { data } = await axios.post('/api/v1/menus', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async update(id, formData) {
        formData.append('_method', 'PUT');
        const { data } = await axios.post(`/api/v1/menus/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async delete(id) {
        const { data } = await axios.delete(`/api/v1/menus/${id}`);
        return data;
    },
};
