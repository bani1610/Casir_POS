import axios from '@/lib/axios';

export const dashboardService = {
    /**
     * Ambil statistik dashboard admin
     */
    async getAdminStats() {
        const { data } = await axios.get('/dashboard/admin');
        return data.data;
    },

    /**
     * Ambil data dashboard karyawan
     */
    async getKaryawanStats() {
        const { data } = await axios.get('/dashboard/karyawan');
        return data.data;
    },
};
