import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInputSchema, type LoginInput } from '@wedding/shared';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth';

export const AdminLogin: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginInputSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
            });

            const { user, accessToken } = response.data;

            if (user.role !== 'ADMIN') {
                toast.error(
                    'Akses ditolak: Akun Anda tidak memiliki hak akses Administrator.',
                );
                setIsLoading(false);
                return;
            }

            setAuth(user, accessToken);
            toast.success(`Selamat datang Admin, ${user.name}!`);
            navigate('/admin', { replace: true });
        } catch (error: any) {
            console.error('Admin login error:', error);
            const errorData = error.response?.data;
            toast.error(errorData?.message || 'Email atau kata sandi salah.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-900 py-12 font-sans text-slate-100 sm:px-6 lg:px-8">
            {/* Premium dark abstract background */}
            <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-6 flex items-center justify-center gap-2.5">
                    <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-3 text-amber-500">
                        <Shield size={28} />
                    </div>
                    <span className="font-sans text-3xl font-bold tracking-wide text-amber-500">
                        Ngaturi Admin
                    </span>
                </div>
                <h2 className="text-center font-sans text-3xl font-bold tracking-wide text-white">
                    Portal Administrator
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Silakan masuk untuk mengelola sistem dan data undangan
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="border border-slate-700 bg-slate-800/80 px-6 py-8 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:px-10">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Alamat Email Admin
                            </label>
                            <div className="shadow-xs relative mt-1.5 rounded-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    disabled={isLoading}
                                    autoComplete="email"
                                    className={`block w-full rounded-full border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-sm text-slate-100 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                                        errors.email
                                            ? 'border-red-400 bg-red-900/10'
                                            : ''
                                    }`}
                                    placeholder="admin@ngaturi.id"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Kata Sandi
                            </label>
                            <div className="shadow-xs relative mt-1.5 rounded-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    className={`block w-full rounded-full border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-sm text-slate-100 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                                        errors.password
                                            ? 'border-red-400 bg-red-900/10'
                                            : ''
                                    }`}
                                    placeholder="••••••••"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-slate-400 transition-colors hover:text-amber-500"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="primary"
                                className="flex w-full items-center justify-center gap-2 border-amber-500 bg-amber-500 py-3 font-bold text-slate-950 hover:border-amber-600 hover:bg-amber-600"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                        <span>Masuk ke System...</span>
                                    </>
                                ) : (
                                    'Masuk System'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
