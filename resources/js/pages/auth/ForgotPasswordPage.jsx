import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/authService';

const schema = z.object({
    email: z.string().email('Format email tidak valid'),
});

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values) => {
        try {
            await authService.forgotPassword(values.email);
            toast.success('Link reset password telah dikirim ke email Anda.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Terjadi kesalahan. Silakan coba lagi.';
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#4d50f0]/5 via-white to-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-primary)] shadow-lg mb-4">
                        <Mail size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Lupa Password?</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Masukkan email Anda untuk reset password
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md border border-[var(--color-border)] p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder="nama@email.com"
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200
                                    focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]
                                    ${errors.email ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-semibold
                                transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Mail size={16} />
                            )}
                            {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="text-center mt-4">
                        <Link
                            to="/login"
                            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors inline-flex items-center gap-1"
                        >
                            <ArrowLeft size={14} />
                            Kembali ke Login
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
                    Casir POS &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
