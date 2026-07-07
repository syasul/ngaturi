import { AlertCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const orderId = query.get('id') || '';

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 font-sans">
            <Card className="w-full max-w-md space-y-6 rounded-3xl border border-green-500/20 bg-green-500/5 p-8 text-center backdrop-blur-md">
                <div className="inline-flex animate-bounce items-center justify-center rounded-full bg-green-500/20 p-3 text-green-400">
                    <CheckCircle2 size={48} />
                </div>

                <div className="space-y-2">
                    <h2 className="font-sans text-2xl font-bold text-white">
                        Pembayaran Berhasil!
                    </h2>
                    <p className="text-slate-350 text-sm">
                        Terima kasih! Pembayaran tagihan Anda dengan nomor
                        invoice{' '}
                        <span className="font-mono font-bold text-green-400">
                            INV-{orderId.substring(0, 8).toUpperCase()}
                        </span>{' '}
                        telah kami terima.
                    </p>
                    <p className="text-xs text-slate-500">
                        Paket layanan premium Anda telah diaktifkan secara
                        otomatis. Silakan masuk kembali ke dashboard untuk
                        melihat fitur baru Anda.
                    </p>
                </div>

                <Button
                    onClick={() => navigate('/dashboard')}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-green-600"
                >
                    <span>Masuk Ke Dashboard</span>
                    <ArrowRight size={16} />
                </Button>
            </Card>
        </div>
    );
};

export const PaymentPending: React.FC = () => {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const orderId = query.get('id') || '';

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 font-sans">
            <Card className="w-full max-w-md space-y-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 text-center backdrop-blur-md">
                <div className="inline-flex animate-pulse items-center justify-center rounded-full bg-amber-500/20 p-3 text-amber-400">
                    <AlertCircle size={48} />
                </div>

                <div className="space-y-2">
                    <h2 className="font-sans text-2xl font-bold text-white">
                        Menunggu Pembayaran
                    </h2>
                    <p className="text-slate-350 text-sm">
                        Transaksi invoice{' '}
                        <span className="font-mono font-bold text-amber-400">
                            INV-{orderId.substring(0, 8).toUpperCase()}
                        </span>{' '}
                        sedang menunggu penyelesaian pembayaran Anda.
                    </p>
                    <p className="text-xs text-slate-500">
                        Silakan selesaikan pembayaran sesuai dengan petunjuk
                        yang telah diberikan pada halaman checkout.
                    </p>
                </div>

                <div className="space-y-3">
                    {orderId && (
                        <Button
                            onClick={() =>
                                navigate(`/dashboard/checkout/${orderId}`)
                            }
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-amber-600"
                        >
                            <span>Kembali Ke Halaman Bayar</span>
                            <ArrowRight size={16} />
                        </Button>
                    )}
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="border-slate-750 w-full cursor-pointer rounded-xl border bg-slate-800 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700"
                    >
                        Kembali Ke Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export const PaymentFailed: React.FC = () => {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const orderId = query.get('id') || '';

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 font-sans">
            <Card className="w-full max-w-md space-y-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center backdrop-blur-md">
                <div className="inline-flex items-center justify-center rounded-full bg-rose-500/20 p-3 text-rose-400">
                    <XCircle size={48} />
                </div>

                <div className="space-y-2">
                    <h2 className="font-sans text-2xl font-bold text-white">
                        Pembayaran Gagal
                    </h2>
                    <p className="text-slate-350 text-sm">
                        Transaksi invoice{' '}
                        <span className="font-mono font-bold text-rose-400">
                            INV-{orderId.substring(0, 8).toUpperCase()}
                        </span>{' '}
                        telah gagal, dibatalkan, atau masa berlaku pembayarannya
                        telah habis.
                    </p>
                    <p className="text-xs text-slate-500">
                        Silakan ajukan checkout ulang atau hubungi tim customer
                        service kami jika Anda merasa sudah melakukan transfer.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => navigate('/dashboard/billing')}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-rose-600"
                    >
                        <span>Ulangi Pemesanan</span>
                        <ArrowRight size={16} />
                    </Button>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="border-slate-750 w-full cursor-pointer rounded-xl border bg-slate-800 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700"
                    >
                        Kembali Ke Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
};
