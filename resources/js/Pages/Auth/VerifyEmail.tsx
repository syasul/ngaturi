import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, Loader2, LogOut, Mail } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';

interface VerifyEmailProps {
    status?: string;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ status }) => {
    const { post, processing } = useForm({});

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () =>
                toast.success('Link verifikasi baru telah dikirim!'),
        });
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    const isLinkSent = status === 'verification-link-sent';

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-cream py-12 font-sans sm:px-6 lg:px-8">
            <Head title="Verifikasi Email" />

            {/* Premium background abstract elements */}
            <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-50 opacity-65 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-rustic-100 opacity-45 blur-3xl" />

            <div className="z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mb-6 flex cursor-default items-center justify-center gap-2">
                    <Heart
                        className="animate-pulse fill-gold-500 text-gold-500"
                        size={28}
                    />
                    <span className="font-sans text-3xl font-bold tracking-wide text-gold-600">
                        Ngaturi
                    </span>
                </div>
                <h2 className="text-center font-sans text-3xl font-bold tracking-wide text-charcoal">
                    Verifikasi Email Anda
                </h2>
                <p className="mt-2 px-4 text-center font-poppins text-sm text-charcoal/60">
                    Terima kasih telah mendaftar! Sebelum memulai, silakan
                    verifikasi email Anda dengan mengklik tautan yang baru saja
                    kami kirimkan.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="space-y-6 border border-sand bg-white/80 px-6 py-8 shadow-xl backdrop-blur-md sm:rounded-3xl sm:px-10">
                    {isLinkSent && (
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 font-poppins text-xs text-green-700">
                            Tautan verifikasi baru telah dikirimkan ke alamat
                            email yang Anda daftarkan.
                        </div>
                    )}

                    <div className="my-4 flex justify-center text-gold-500">
                        <Mail size={48} className="animate-bounce" />
                    </div>

                    <form onSubmit={handleResend} className="space-y-4">
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
                                    <span>Mengirim Ulang...</span>
                                </>
                            ) : (
                                'Kirim Ulang Email Verifikasi'
                            )}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between border-t border-sand/40 pt-4 font-poppins text-xs">
                        <span className="text-charcoal/50">
                            Gunakan akun lain?
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex cursor-pointer items-center gap-1 font-semibold text-red-600 hover:text-red-500 hover:underline"
                        >
                            <LogOut size={14} />
                            <span>Keluar</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
