import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
            <div className="text-center">
                <p className="text-7xl font-bold text-[var(--color-primary)]">404</p>
                <h1 className="text-2xl font-bold text-slate-800 mt-4">Halaman Tidak Ditemukan</h1>
                <p className="text-slate-500 mt-2 text-sm">Halaman yang Anda cari tidak ada.</p>
                <Link to="/" className="mt-6 inline-block px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
