import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-4">
                    <ShieldOff size={28} className="text-[var(--color-danger)]" />
                </div>
                <p className="text-5xl font-bold text-[var(--color-danger)]">403</p>
                <h1 className="text-2xl font-bold text-slate-800 mt-3">Akses Tidak Diizinkan</h1>
                <p className="text-slate-500 mt-2 text-sm">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                <Link to="/" className="mt-6 inline-block px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
