import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Heart, Loader2, Lock } from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../components/ui/Button';

interface ResetPasswordProps {
    email: string;
    token: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
    email,
    token,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream py-12 font-sans sm:px-6 lg:px-8">
            <Head title="Atur Kata Sandi Baru" />

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
                    Atur Kata Sandi Baru
                </h2>
                <p className="mt-2 text-center font-poppins text-sm text-charcoal/60">
                    Silakan masukkan kata sandi baru Anda di bawah ini untuk
                    mengakses kembali akun Anda.
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
                        {/* Hidden Fields */}
                        <input type="hidden" value={data.email} />
                        <input type="hidden" value={data.token} />

                        {/* Email field info (static/disabled) */}
                        <div>
                            <label className="block font-poppins text-sm font-medium text-charcoal/60">
                                Email Akun
                            </label>
                            <input
                                type="text"
                                disabled
                                className="mt-1 block w-full rounded-full border border-sand bg-gray-100 px-4 py-3 font-poppins text-sm text-charcoal/60"
                                value={data.email}
                            />
                            {errors.email && (
                                <p className="mt-1 font-poppins text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block font-poppins text-sm font-medium text-charcoal"
                            >
                                Kata Sandi Baru
                            </label>
                            <div className="shadow-xs relative mt-1.5 rounded-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/40">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={processing}
                                    autoComplete="new-password"
                                    className={`block w-full rounded-full border py-3 pl-11 pr-12 font-poppins text-sm transition-all focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 ${
                                        errors.password
                                            ? 'border-red-400 bg-red-50/10'
                                            : 'border-sand bg-white'
                                    }`}
                                    placeholder="Min. 8 karakter"
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

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block font-poppins text-sm font-medium text-charcoal"
                            >
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="shadow-xs relative mt-1.5 rounded-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-charcoal/40">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    disabled={processing}
                                    autoComplete="new-password"
                                    className={`block w-full rounded-full border py-3 pl-11 pr-12 font-poppins text-sm transition-all focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 ${
                                        errors.password_confirmation
                                            ? 'border-red-400 bg-red-50/10'
                                            : 'border-sand bg-white'
                                    }`}
                                    placeholder="Ulangi kata sandi baru"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-charcoal/40 transition-colors hover:text-gold-500"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 font-poppins text-xs text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
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
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    'Atur Ulang Kata Sandi'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-sand pt-4 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 font-poppins text-xs font-semibold text-charcoal/60 hover:text-gold-500"
                        >
                            <ArrowLeft size={14} />
                            <span>Kembali ke Halaman Masuk</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
