import {
    AlertCircle,
    ArrowLeft,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Copy,
    CreditCard,
    QrCode,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Checkout: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [transaction, setTransaction] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [openStep, setOpenStep] = useState<number | null>(0);
    const [timeLeft, setTimeLeft] = useState<string>('24:00:00');

    const fetchOrderDetail = async () => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            if (res.data.status === 'success') {
                setOrder(res.data.order);
                setTransaction(res.data.transaction);

                // If order status is already PAID, redirect to success
                if (res.data.order.status === 'PAID') {
                    navigate(`/payment/success?id=${orderId}`);
                } else if (res.data.order.status === 'EXPIRED') {
                    navigate(`/payment/failed?id=${orderId}`);
                }
            }
        } catch (err) {
            toast.error('Gagal memuat detail transaksi.');
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch & Polling
    useEffect(() => {
        fetchOrderDetail();

        // Poll order status every 5 seconds
        const interval = setInterval(() => {
            fetchOrderDetail();
        }, 5000);

        return () => clearInterval(interval);
    }, [orderId]);

    // Countdown Timer
    useEffect(() => {
        if (!transaction || !transaction.payload) return;

        const expiryTime = transaction.payload.expired_time * 1000; // Convert to ms

        const updateTimer = () => {
            const now = Date.now();
            const difference = expiryTime - now;

            if (difference <= 0) {
                setTimeLeft('Expired');
                clearInterval(timerInterval);
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60),
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const formatted = [
                String(hours).padStart(2, '0'),
                String(minutes).padStart(2, '0'),
                String(seconds).padStart(2, '0'),
            ].join(':');

            setTimeLeft(formatted);
        };

        updateTimer(); // run once immediately
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, [transaction]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Disalin ke papan klip!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
                <p className="text-sm font-medium text-slate-400">
                    Memuat detail tagihan...
                </p>
            </div>
        );
    }

    if (!order || !transaction) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
                <AlertCircle className="text-rose-500" size={48} />
                <h3 className="text-lg font-bold text-white">
                    Transaksi Tidak Ditemukan
                </h3>
                <p className="max-w-sm text-sm text-slate-400">
                    Tagihan pembayaran tidak valid atau Anda tidak memiliki
                    akses ke tagihan ini.
                </p>
                <Button
                    onClick={() => navigate('/dashboard/billing')}
                    className="mt-2 bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                    Kembali ke Billing
                </Button>
            </div>
        );
    }

    const payload = transaction.payload;
    const isQris = order.paymentMethod === 'QRIS';
    const isExpired = timeLeft === 'Expired' || order.status === 'EXPIRED';

    return (
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 font-sans">
            {/* Header Back Button */}
            <button
                onClick={() => navigate('/dashboard/billing')}
                className="flex cursor-pointer items-center gap-2 border-0 bg-transparent text-xs font-semibold text-slate-400 transition-all hover:text-white"
            >
                <ArrowLeft size={16} />
                <span>Kembali ke Billing & Paket</span>
            </button>

            {/* Expiration Banner */}
            <Card
                className={`flex flex-col items-center justify-between gap-4 rounded-2xl border p-5 sm:flex-row ${
                    isExpired
                        ? 'border-rose-950 bg-rose-950/20 text-rose-300'
                        : 'border-amber-500/20 bg-amber-500/5 text-amber-300'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Clock
                        className={
                            isExpired
                                ? 'text-rose-400'
                                : 'animate-pulse text-amber-400'
                        }
                        size={24}
                    />
                    <div>
                        <span className="block text-xs font-semibold text-slate-400">
                            Selesaikan Pembayaran Dalam:
                        </span>
                        <span className="font-mono text-xl font-bold tracking-wider">
                            {timeLeft}
                        </span>
                    </div>
                </div>
                <div className="text-center sm:text-right">
                    <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Batas Pembayaran
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                        {new Date(payload.expired_time * 1000).toLocaleString(
                            'id-ID',
                            {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            },
                        )}
                    </span>
                </div>
            </Card>

            {/* Main Billing Card */}
            <Card className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md sm:p-8">
                {/* Payment Summary */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                    <div>
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-amber-500">
                            Invoice ID
                        </span>
                        <h3 className="text-sm font-bold text-white">
                            INV-{order.id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="mt-1 text-xs text-slate-400">
                            Paket {order.packageName}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Metode Pembayaran
                        </span>
                        <span className="text-slate-350 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold">
                            {isQris ? (
                                <QrCode size={12} />
                            ) : (
                                <CreditCard size={12} />
                            )}
                            {payload.payment_name}
                        </span>
                    </div>
                </div>

                {/* QR Code or VA Code Input */}
                <div className="border-slate-850 flex flex-col items-center justify-center rounded-2xl border bg-slate-950/60 p-6 text-center">
                    {isQris ? (
                        <div className="space-y-4">
                            <span className="block text-xs font-semibold text-slate-400">
                                Scan Kode QRIS di bawah ini:
                            </span>
                            <div className="inline-block rounded-2xl border-2 border-amber-500/30 bg-white p-4 shadow-lg">
                                {payload.qr_url ? (
                                    <img
                                        src={payload.qr_url}
                                        alt="QRIS Payment"
                                        className="mx-auto h-48 w-48"
                                    />
                                ) : (
                                    <div className="flex h-48 w-48 items-center justify-center font-mono text-xs text-slate-400">
                                        Generating QR...
                                    </div>
                                )}
                            </div>
                            <p className="mx-auto max-w-xs text-[10px] text-slate-500">
                                Dapat discan menggunakan GoPay, OVO, Dana,
                                LinkAja, BCA, Mandiri, dan aplikasi perbankan
                                lainnya.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full space-y-3">
                            <span className="block text-xs font-semibold text-slate-400">
                                Nomor Virtual Account:
                            </span>
                            <div className="mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
                                <span className="font-mono text-xl font-bold tracking-wider text-amber-500">
                                    {payload.payment_code}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(payload.payment_code)
                                    }
                                    className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition-all hover:bg-slate-700"
                                >
                                    {copied ? (
                                        <Check
                                            className="text-green-500"
                                            size={16}
                                        />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500">
                                Gunakan menu transfer virtual account pada bank
                                pilihan Anda.
                            </p>
                        </div>
                    )}
                </div>

                {/* Total Amount */}
                <div className="border-slate-850 flex items-center justify-between rounded-xl border bg-slate-950/40 p-4">
                    <div>
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Jumlah Tagihan
                        </span>
                        <span className="text-xs text-slate-400">
                            (Sudah termasuk biaya admin)
                        </span>
                    </div>
                    <span className="font-mono text-xl font-bold text-amber-500">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                        }).format(order.amount)}
                    </span>
                </div>

                {/* Instructions */}
                {payload.instructions && payload.instructions.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Instruksi Cara Pembayaran
                        </h4>
                        <div className="space-y-2">
                            {payload.instructions.map(
                                (inst: any, idx: number) => {
                                    const isOpen = openStep === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className="border-slate-850 overflow-hidden rounded-xl border"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenStep(
                                                        isOpen ? null : idx,
                                                    )
                                                }
                                                className="flex w-full cursor-pointer items-center justify-between border-0 bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-200 transition-all hover:text-white"
                                            >
                                                <span>{inst.title}</span>
                                                {isOpen ? (
                                                    <ChevronUp size={14} />
                                                ) : (
                                                    <ChevronDown size={14} />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="border-slate-850 space-y-2 border-t bg-slate-950/40 p-4 font-poppins text-xs text-slate-400">
                                                    {inst.steps.map(
                                                        (
                                                            step: string,
                                                            sIdx: number,
                                                        ) => (
                                                            <div
                                                                key={sIdx}
                                                                className="flex items-start gap-2 leading-relaxed"
                                                            >
                                                                <span className="font-bold text-amber-500">
                                                                    {sIdx + 1}.
                                                                </span>
                                                                <span>
                                                                    {step}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* Realtime Note */}
            <div className="flex animate-pulse items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>
                    Menunggu pembayaran... Halaman ini akan otomatis ter-update
                </span>
            </div>
        </div>
    );
};

Checkout.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Checkout;
