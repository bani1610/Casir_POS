import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

const schema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    remember: z.boolean().optional(),
});

export default function LoginPage() {
    const { isAuthenticated, user, setAuth } = useAuthStore();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);

    // Redirect jika sudah login
    if (isAuthenticated) {
        return <Navigate to={user?.role === 'admin' ? '/admin' : '/karyawan'} replace />;
    }

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values) => {
        try {
            const { data } = await authService.login(values);
            setAuth(data.token, data.user);
            toast.success(`Selamat datang, ${data.user.name}!`);
            navigate(data.user.role === 'admin' ? '/admin' : '/karyawan', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Email atau password salah';
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#4d50f0]/5 via-white to-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-primary)] shadow-lg mb-4">
                        <LogIn size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Casir POS</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Masuk ke akun Anda</p>
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    autoComplete="current-password"
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

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                className="rounded border-[var(--color-border)] text-[var(--color-primary)]"
                                {...register('remember')}
                            />
                            <label htmlFor="remember" className="text-sm text-[var(--color-text-muted)]">
                                Ingat saya
                            </label>
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
                                <LogIn size={16} />
                            )}
                            {isSubmitting ? 'Masuk...' : 'Masuk'}
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
