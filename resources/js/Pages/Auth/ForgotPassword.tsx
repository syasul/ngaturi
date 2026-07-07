import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Heart, Loader2, Mail } from 'lucide-react';
import React from 'react';
import Button from '../../components/ui/Button';

export const ForgotPassword: React.FC<{ status?: string }> = ({ status }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream py-12 font-sans sm:px-6 lg:px-8">
            <Head title="Lupa Kata Sandi" />

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
                    Atur Ulang Kata Sandi
                </h2>
                <p className="mt-2 text-center font-poppins text-sm text-charcoal/60">
                    Masukkan email Anda dan kami akan mengirimkan tautan untuk
                    menyetel ulang kata sandi Anda.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="border border-sand bg-white/80 px-6 py-8 shadow-xl backdrop-blur-md sm:rounded-3xl sm:px-10">
                    {!status ? (
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
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        'Kirim Tautan Atur Ulang'
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4 py-4 text-center"
                        >
                            <div className="flex justify-center text-gold-500">
                                <CheckCircle
                                    size={48}
                                    className="stroke-[1.5]"
                                />
                            </div>
                            <h3 className="font-sans text-xl font-bold text-charcoal">
                                Permintaan Berhasil Dikirim
                            </h3>
                            <p className="font-poppins text-sm text-charcoal/70">
                                {status}
                            </p>
                        </motion.div>
                    )}

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

export default ForgotPassword;
