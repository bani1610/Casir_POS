import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { authService } from '@/services/authService';

const schema = z.object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string().min(8, 'Password minimal 8 karakter'),
}).refine(data => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation'],
});

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values) => {
        if (!token || !email) {
            toast.error('Link reset password tidak valid.');
            return;
        }

        try {
            await authService.resetPassword({
                email,
                token,
                password: values.password,
                password_confirmation: values.password_confirmation,
            });
            toast.success('Password berhasil direset. Silakan login dengan password baru.');
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
                        <Lock size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Reset Password</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Masukkan password baru Anda
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md border border-[var(--color-border)] p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                                Password Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Minimal 8 karakter"
                                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all duration-200
                                        focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]
                                        ${errors.password ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
                                    {...register('password')}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Ulangi password"
                                    className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all duration-200
                                        focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]
                                        ${errors.password_confirmation ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'}`}
                                    {...register('password_confirmation')}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-xs text-[var(--color-danger)] mt-1">{errors.password_confirmation.message}</p>
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
                                <Lock size={16} />
                            )}
                            {isSubmitting ? 'Menyimpan...' : 'Reset Password'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
                    Casir POS &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
