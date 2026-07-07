import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Loader2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../components/ui/Button';

export const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream py-12 font-sans sm:px-6 lg:px-8">
            <Head title="Masuk" />

            {/* Premium background abstract elements */}
            <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-50 opacity-65 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-rustic-100 opacity-45 blur-3xl" />

            <div className="z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <Link
                    href="/"
                    className="mb-6 flex cursor-pointer items-center justify-center gap-2"
                >
                    <Heart
                        className="animate-pulse fill-gold-500 text-gold-500"
                        size={28}
                    />
                    <span className="font-sans text-3xl font-bold tracking-wide text-gold-600">
                        Ngaturi
                    </span>
                </Link>
                <h2 className="text-center font-sans text-3xl font-bold tracking-wide text-charcoal">
                    Masuk ke Akun Anda
                </h2>
                <p className="mt-2 text-center font-poppins text-sm text-charcoal/60">
                    Kelola undangan digital premium Anda dengan mudah
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="border border-sand bg-white/80 px-6 py-8 shadow-xl backdrop-blur-md sm:rounded-3xl sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmit}>
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block font-poppins text-sm font-medium text-charcoal"
                            >
                                Alamat Email
                            </label>
                            <div className="shadow-xs relative mt-1.5 rounded-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/40">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    disabled={processing}
                                    autoComplete="email"
                                    className={`block w-full rounded-full border py-3 pl-11 pr-4 font-poppins text-sm transition-all focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 ${
                                        errors.email
                                            ? 'border-red-400 bg-red-50/10'
                                            : 'border-sand bg-white'
                                    }`}
                                    placeholder="name@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 font-poppins text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block font-poppins text-sm font-medium text-charcoal"
                                >
                                    Kata Sandi
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="font-poppins text-xs font-semibold text-gold-600 hover:text-gold-500"
                                >
                                    Lupa kata sandi?
                                </Link>
                            </div>
                            <div className="shadow-xs relative mt-1.5 rounded-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/40">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={processing}
                                    autoComplete="current-password"
                                    className={`block w-full rounded-full border py-3 pl-11 pr-12 font-poppins text-sm transition-all focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 ${
                                        errors.password
                                            ? 'border-red-400 bg-red-50/10'
                                            : 'border-sand bg-white'
                                    }`}
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-charcoal/40 transition-colors hover:text-gold-500"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 font-poppins text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                disabled={processing}
                                className="rounded-xs h-4 w-4 cursor-pointer border-sand text-gold-500 accent-gold-500 focus:ring-gold-500/20"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 block cursor-pointer font-poppins text-xs text-charcoal/70"
                            >
                                Ingat Saya
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button
                                type="submit"
                                disabled={processing}
                                variant="primary"
                                className="flex w-full items-center justify-center gap-2 py-3"
                            >
                                {processing ? (
                                    <>
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-sand"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/80 px-3 font-poppins text-charcoal/50 backdrop-blur-md">
                                atau
                            </span>
                        </div>
                    </div>

                    {/* Google OAuth Login Button */}
                    <div className="mb-6">
                        <a href="/auth/google" className="block w-full">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex w-full cursor-pointer items-center justify-center gap-2.5 border-sand py-3 hover:bg-gold-50/10"
                            >
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#EA4335"
                                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.23 2.73 1.258 6.708l3.992 3.057z"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M16.04 15.345c-1.07.727-2.43 1.164-4.04 1.164a7.077 7.077 0 0 1-6.75-4.909l-3.99 3.064C3.23 21.27 7.27 24 12 24c3.09 0 5.82-1.023 7.82-2.782l-3.78-1.873z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.21 11.6c0-.527.09-1.036.25-1.527L1.47 7.01C.53 8.92 0 11.08 0 13.37c0 2.227.5 4.345 1.41 6.227l4.02-3.08c-.14-.52-.22-1.055-.22-1.617z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M23.49 12.27c0-.79-.07-1.545-.19-2.27H12v4.51h6.46c-.28 1.48-.11 2.94-.97 4.18l3.78 1.87c2.22-2.055 2.22-6.19 2.22-8.29z"
                                    />
                                </svg>
                                <span className="font-poppins font-medium text-charcoal">
                                    Masuk dengan Google
                                </span>
                            </Button>
                        </a>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="font-poppins text-xs text-charcoal/60">
                            Belum memiliki akun?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-gold-600 hover:text-gold-500"
                            >
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
