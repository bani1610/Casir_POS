import axios from '@/lib/axios';

export const categoryService = {
    async getAll() {
        const { data } = await axios.get('/categories');
        return data.data;
    },

    async create(categoryData) {
        const { data } = await axios.post('/categories', categoryData);
        return data;
    },

    async update(id, categoryData) {
        const { data } = await axios.put(`/categories/${id}`, categoryData);
        return data;
    },

    async delete(id) {
        const { data } = await axios.delete(`/categories/${id}`);
        return data;
    },
};
