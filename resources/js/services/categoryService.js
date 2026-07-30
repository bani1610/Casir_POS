import axios from '@/lib/axios';

export const categoryService = {
    async getAll() {
        const { data } = await axios.get('/api/v1/categories');
        return data.data;
    },

    async create(categoryData) {
        const { data } = await axios.post('/api/v1/categories', categoryData);
        return data;
    },

    async update(id, categoryData) {
        const { data } = await axios.put(`/api/v1/categories/${id}`, categoryData);
        return data;
    },

    async delete(id) {
        const { data } = await axios.delete(`/api/v1/categories/${id}`);
        return data;
    },
};
