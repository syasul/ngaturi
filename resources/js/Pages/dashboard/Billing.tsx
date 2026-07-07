import { AlertCircle, Check, History, Loader2, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Billing: React.FC = () => {
    const navigate = useNavigate();
    const [wedding, setWedding] = useState<any>(null);
    const [packages, setPackages] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulation states
    const [selectedPkg, setSelectedPkg] = useState<any>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');

    const loadBillingData = async () => {
        try {
            const weddingRes = await api.get('/weddings/me');
            if (weddingRes.data.status === 'success') {
                setWedding(weddingRes.data.wedding);
            }

            const packagesRes = await api.get('/orders/packages');
            if (packagesRes.data.status === 'success') {
                setPackages(packagesRes.data.packages);
            }

            const historyRes = await api.get('/orders/history');
            if (historyRes.data.status === 'success') {
                setHistory(historyRes.data.history);
            }
        } catch (err) {
            toast.error('Gagal memuat data pembayaran.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBillingData();
    }, []);

    const handleCheckout = async () => {
        if (!selectedPkg) return;
        setCheckoutLoading(true);
        try {
            const res = await api.post('/orders/checkout', {
                packageId: selectedPkg.id,
                paymentMethod: paymentMethod,
            });

            if (res.data.status === 'success') {
                toast.success(
                    `Tagihan untuk paket ${selectedPkg.name} berhasil dibuat!`,
                );
                setIsPaymentModalOpen(false);
                navigate(`/dashboard/checkout/${res.data.order.id}`);
            }
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || 'Gagal memproses transaksi.',
            );
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <p className="text-sm font-medium text-charcoal/60">
                    Memuat data pembayaran...
                </p>
            </div>
        );
    }

    const userPkg = wedding?.package?.packageName || 'BASIC';

    return (
        <div className="space-y-6 font-sans">
            <div className="border-b border-sand/35 pb-4">
                <h2 className="font-sans text-3xl font-bold text-charcoal">
                    Paket & Billing Pembayaran
                </h2>
                <p className="mt-1 text-sm text-charcoal/60">
                    Lakukan upgrade paket fitur undangan digital Anda dan lihat
                    riwayat pembayaran.
                </p>
            </div>

            {/* Current Package Card */}
            <Card className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-gold-500/40 bg-gold-500/5 p-6 shadow-inner sm:flex-row sm:items-center">
                <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gold-600">
                        Status Paket Saat Ini
                    </span>
                    <h3 className="mt-1 font-sans text-2xl font-bold text-charcoal">
                        Paket {userPkg}
                    </h3>
                    <p className="mt-1 text-xs text-charcoal/50">
                        Undangan aktif hingga:{' '}
                        <span className="font-bold text-charcoal/70">
                            {wedding?.expiredAt
                                ? new Date(
                                      wedding.expiredAt,
                                  ).toLocaleDateString('id-ID')
                                : '-'}
                        </span>
                    </p>
                </div>

                <Badge
                    variant="success"
                    className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
                >
                    Aktif / Paid
                </Badge>
            </Card>

            {/* Package comparison grids */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-charcoal">
                    <TrendingUp className="text-gold-500" size={20} />
                    <span>Bandingkan & Upgrade Paket</span>
                </h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {packages.map((pkg) => {
                        const isCurrent = userPkg === pkg.name;
                        const isUpgrade =
                            !isCurrent &&
                            pkg.name === 'PREMIUM' &&
                            userPkg === 'BASIC';

                        return (
                            <Card
                                key={pkg.id}
                                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-6 shadow-sm ${
                                    isCurrent
                                        ? 'border-gold-500 ring-2 ring-gold-500/20'
                                        : 'border-sand'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-sans text-lg font-bold text-charcoal">
                                            {pkg.name}
                                        </h4>
                                        {isCurrent && (
                                            <span className="rounded bg-gold-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                                                Aktif
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-3 text-2xl font-bold text-gold-600">
                                        Rp {pkg.price.toLocaleString('id-ID')}
                                    </p>
                                    <p className="mt-1 text-[10px] text-charcoal/40">
                                        Aktif selama {pkg.durationDays} hari (
                                        {pkg.maxGuests} Tamu)
                                    </p>

                                    <ul className="mt-6 space-y-2 text-xs text-charcoal/70">
                                        {pkg.features.map(
                                            (feat: string, idx: number) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Check
                                                        className="mt-0.5 shrink-0 text-green-600"
                                                        size={14}
                                                    />
                                                    <span>{feat}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                <div className="mt-8 border-t border-sand/35 pt-4">
                                    {isCurrent ? (
                                        <Button
                                            variant="outline"
                                            disabled
                                            className="w-full text-xs"
                                        >
                                            Paket Aktif
                                        </Button>
                                    ) : isUpgrade ? (
                                        <Button
                                            variant="primary"
                                            className="w-full text-xs"
                                            onClick={() => {
                                                setSelectedPkg(pkg);
                                                setIsPaymentModalOpen(true);
                                            }}
                                        >
                                            Upgrade Sekarang
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            disabled
                                            className="w-full text-xs"
                                        >
                                            Tersedia
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Transaction history logs */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-charcoal">
                    <History className="text-gold-500" size={20} />
                    <span>Riwayat Pembayaran</span>
                </h3>

                <Card className="overflow-x-auto rounded-3xl border border-sand/45 bg-white p-2 shadow-sm">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-charcoal/40">
                            <AlertCircle
                                className="mb-2 text-charcoal/20"
                                size={28}
                            />
                            <p>Belum ada riwayat pembayaran.</p>
                        </div>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-sand/30 bg-cream/15 text-xs font-semibold uppercase text-charcoal/50">
                                    <th className="p-3">ID Pembayaran</th>
                                    <th className="p-3">Nama Paket</th>
                                    <th className="p-3">Total Tagihan</th>
                                    <th className="p-3">Metode</th>
                                    <th className="p-3">Tanggal Lunas</th>
                                    <th className="p-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-sand/20 hover:bg-cream/10"
                                    >
                                        <td className="max-w-[120px] truncate p-3 font-mono text-xs text-charcoal/60">
                                            {row.id}
                                        </td>
                                        <td className="p-3 font-bold text-charcoal">
                                            {row.packageName}
                                        </td>
                                        <td className="p-3 font-semibold text-gold-600">
                                            Rp{' '}
                                            {row.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 text-charcoal/70">
                                            {row.paymentMethod}
                                        </td>
                                        <td className="p-3 text-xs text-charcoal/50">
                                            {row.paidAt
                                                ? new Date(
                                                      row.paidAt,
                                                  ).toLocaleString('id-ID')
                                                : '-'}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Badge
                                                    variant={
                                                        row.status === 'PAID'
                                                            ? 'success'
                                                            : row.status ===
                                                                'PENDING'
                                                              ? 'warning'
                                                              : 'danger'
                                                    }
                                                >
                                                    {row.status}
                                                </Badge>
                                                {row.status === 'PENDING' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/checkout/${row.id}`,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-xl border-0 bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 transition-all hover:bg-amber-600"
                                                    >
                                                        Bayar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>

            {/* TRIPAY PAYMENT METHOD MODAL */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title={`Upgrade Paket: ${selectedPkg?.name}`}
            >
                <div className="space-y-6 text-center font-sans">
                    <p className="text-sm text-charcoal/70">
                        Pilih metode pembayaran di bawah untuk melanjutkan ke
                        proses tagihan pembayaran otomatis platform Tripay.
                    </p>

                    <div className="space-y-2 text-left">
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                            Pilih Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {[
                                {
                                    id: 'QRIS',
                                    name: 'QRIS (E-Wallet / Bank)',
                                    desc: 'Scan & bayar instan',
                                },
                                {
                                    id: 'BCAVA',
                                    name: 'BCA Virtual Account',
                                    desc: 'Transfer otomatis BCA',
                                },
                                {
                                    id: 'BNIVA',
                                    name: 'BNI Virtual Account',
                                    desc: 'Transfer otomatis BNI',
                                },
                                {
                                    id: 'MANDIRIVA',
                                    name: 'Mandiri Virtual Account',
                                    desc: 'Transfer otomatis Mandiri',
                                },
                                {
                                    id: 'BRIVA',
                                    name: 'BRI Virtual Account',
                                    desc: 'Transfer otomatis BRI',
                                },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                                        paymentMethod === method.id
                                            ? 'border-amber-500 bg-amber-500/5 shadow-sm'
                                            : 'border-sand hover:border-amber-500/40'
                                    }`}
                                >
                                    <span className="text-xs font-bold text-charcoal">
                                        {method.name}
                                    </span>
                                    <span className="mt-0.5 text-[9px] text-charcoal/50">
                                        {method.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-sand/35 bg-cream/30 p-4 text-xs text-charcoal/80">
                        <span>Total Tagihan:</span>
                        <span className="text-sm font-bold text-amber-600">
                            Rp {selectedPkg?.price.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setIsPaymentModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            className="flex flex-1 items-center justify-center gap-2"
                            disabled={checkoutLoading}
                            onClick={handleCheckout}
                        >
                            {checkoutLoading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : null}
                            <span>Lanjut Bayar</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

Billing.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Billing;
