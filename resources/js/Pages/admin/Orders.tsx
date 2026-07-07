import {
    CheckCircle,
    Eye,
    FileSpreadsheet,
    Loader2,
    RefreshCw,
    Search,
    X,
    XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

interface Order {
    id: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUND';
    paymentMethod: string | null;
    paidAt: string | null;
    createdAt: string;
    userName: string;
    userEmail: string;
    packageName: string;
}

interface OrderDetail {
    order: Order;
    transaction: {
        id: string;
        gatewayRef: string | null;
        status: string;
        payload: Record<string, any>;
        createdAt: string;
    } | null;
}

export const AdminOrders: React.FC = () => {
    const [ordersList, setOrdersList] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Detail Modal
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/orders', {
                params: {
                    search,
                    status: statusFilter,
                },
            });
            setOrdersList(response.data.orders);
        } catch (err: any) {
            toast.error('Gagal mengambil daftar order.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders();
    };

    // View Detailed Invoice & Webhook log
    const viewOrderDetails = async (id: string) => {
        setSelectedOrderId(id);
        setLoadingDetail(true);
        try {
            const response = await api.get(`/admin/orders/${id}`);
            setOrderDetail(response.data);
        } catch (err: any) {
            toast.error('Gagal memuat detail order.');
            setSelectedOrderId(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Confirm Manual Payment
    const handleConfirmPayment = async (id: string) => {
        if (
            !window.confirm(
                'Konfirmasi pembayaran manual untuk order ini? Status undangan user akan diterbitkan secara otomatis.',
            )
        )
            return;
        const loadingToast = toast.loading('Mengonfirmasi pembayaran...');
        try {
            await api.post(`/admin/orders/${id}/confirm`);
            toast.dismiss(loadingToast);
            toast.success('Pembayaran manual berhasil dikonfirmasi!');
            fetchOrders();
            if (selectedOrderId === id) {
                viewOrderDetails(id); // reload details
            }
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error(
                err.response?.data?.message ||
                    'Gagal mengonfirmasi pembayaran.',
            );
        }
    };

    // Cancel Pending Order
    const handleCancelOrder = async (id: string) => {
        if (
            !window.confirm(
                'Apakah Anda yakin ingin membatalkan order pending ini?',
            )
        )
            return;
        const loadingToast = toast.loading('Membatalkan order...');
        try {
            await api.post(`/admin/orders/${id}/cancel`);
            toast.dismiss(loadingToast);
            toast.success('Order berhasil dibatalkan.');
            fetchOrders();
            if (selectedOrderId === id) {
                viewOrderDetails(id);
            }
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal membatalkan order.');
        }
    };

    // Mark Order as Refunded
    const handleRefundOrder = async (id: string) => {
        if (!window.confirm('Tandai order ini sebagai REFUND?')) return;
        const loadingToast = toast.loading('Menandai refund...');
        try {
            await api.post(`/admin/orders/${id}/refund`);
            toast.dismiss(loadingToast);
            toast.success('Order ditandai sebagai refund.');
            fetchOrders();
            if (selectedOrderId === id) {
                viewOrderDetails(id);
            }
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal memproses refund.');
        }
    };

    // Export orders list to Excel/CSV
    const handleExportCSV = () => {
        if (ordersList.length === 0) return;
        const headers =
            'ID Invoice,Customer,Email,Paket,Jumlah Pembayaran,Status,Metode Bayar,Tanggal\n';
        const rows = ordersList
            .map(
                (o) =>
                    `"INV-${o.id.substring(0, 8).toUpperCase()}","${o.userName}","${o.userEmail}","${o.packageName}",${
                        o.amount
                    },"${o.status}","${o.paymentMethod || '-'}","${new Date(o.createdAt).toLocaleDateString('id-ID')}"`,
            )
            .join('\n');

        const blob = new Blob([headers + rows], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `laporan-transaksi-${new Date().toISOString().split('T')[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Order & Transaksi
                    </h1>
                    <p className="text-sm text-slate-400">
                        Verifikasi manual dan pantau log tagihan invoice
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800"
                >
                    <FileSpreadsheet size={16} />
                    <span>Export Excel/CSV</span>
                </button>
            </div>

            {/* Filter Options */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <form
                    onSubmit={handleSearchSubmit}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                    <div className="relative rounded-full md:col-span-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari transaksi berdasarkan nama customer atau email..."
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-11 pr-4 text-sm text-slate-100 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                            <option value="all">Semua Status</option>
                            <option value="PAID">PAID</option>
                            <option value="PENDING">PENDING</option>
                            <option value="EXPIRED">EXPIRED</option>
                            <option value="REFUND">REFUND</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2
                            className="animate-spin text-amber-500"
                            size={32}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/20 text-slate-400">
                                    <th className="px-6 py-4 font-semibold">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Paket
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Metode
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {ordersList.length > 0 ? (
                                    ordersList.map((o) => (
                                        <tr
                                            key={o.id}
                                            className="hover:bg-slate-800/10"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-200">
                                                INV-
                                                {o.id
                                                    .substring(0, 8)
                                                    .toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-200">
                                                    {o.userName}
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    {o.userEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[9px] font-bold text-slate-300">
                                                    {o.packageName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                {formatCurrency(o.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                        o.status === 'PAID'
                                                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                            : o.status ===
                                                                'PENDING'
                                                              ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                                                              : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                                                    }`}
                                                >
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {o.paymentMethod || 'Web'}
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        viewOrderDetails(o.id)
                                                    }
                                                    className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                                    title="Detail Transaksi"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                {o.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleConfirmPayment(
                                                                    o.id,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400 transition-all hover:bg-emerald-500/20 hover:text-emerald-300"
                                                            title="Konfirmasi Manual"
                                                        >
                                                            <CheckCircle
                                                                size={14}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleCancelOrder(
                                                                    o.id,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-lg bg-rose-500/10 p-1.5 text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
                                                            title="Batalkan Order"
                                                        >
                                                            <XCircle
                                                                size={14}
                                                            />
                                                        </button>
                                                    </>
                                                )}
                                                {o.status === 'PAID' && (
                                                    <button
                                                        onClick={() =>
                                                            handleRefundOrder(
                                                                o.id,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg bg-amber-500/10 p-1.5 text-amber-400 transition-all hover:bg-amber-500/20 hover:text-amber-300"
                                                        title="Tandai Refund"
                                                    >
                                                        <RefreshCw size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-center text-slate-500"
                                        >
                                            Transaksi tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detailed Modal Drawer */}
            {selectedOrderId && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex justify-end bg-slate-950/70">
                    <div className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                            <h3 className="font-sans text-base font-bold text-white">
                                Detail Transaksi & Webhook
                            </h3>
                            <button
                                onClick={() => setSelectedOrderId(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto p-6">
                            {loadingDetail ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2
                                        className="animate-spin text-amber-500"
                                        size={24}
                                    />
                                </div>
                            ) : (
                                orderDetail && (
                                    <>
                                        {/* Summary Info */}
                                        <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950 p-5">
                                            <div>
                                                <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                                                    ID Invoice
                                                </span>
                                                <h4 className="text-base font-bold text-white">
                                                    INV-
                                                    {orderDetail.order.id.toUpperCase()}
                                                </h4>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Customer
                                                    </span>
                                                    <span className="font-semibold text-slate-300">
                                                        {
                                                            orderDetail.order
                                                                .userName
                                                        }
                                                    </span>
                                                    <span className="block text-[10px] text-slate-500">
                                                        {
                                                            orderDetail.order
                                                                .userEmail
                                                        }
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Status Pembayaran
                                                    </span>
                                                    <span
                                                        className={`font-bold ${
                                                            orderDetail.order
                                                                .status ===
                                                            'PAID'
                                                                ? 'text-emerald-400'
                                                                : 'text-amber-400'
                                                        }`}
                                                    >
                                                        {
                                                            orderDetail.order
                                                                .status
                                                        }
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Paket Undangan
                                                    </span>
                                                    <span className="font-semibold text-slate-300">
                                                        {
                                                            orderDetail.order
                                                                .packageName
                                                        }
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Metode Pembayaran
                                                    </span>
                                                    <span className="font-semibold text-slate-300">
                                                        {orderDetail.order
                                                            .paymentMethod ||
                                                            'Web / Manual'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Harga Paket
                                                    </span>
                                                    <span className="font-bold text-white">
                                                        {formatCurrency(
                                                            orderDetail.order
                                                                .amount,
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Tanggal Tagihan
                                                    </span>
                                                    <span className="text-slate-400">
                                                        {new Date(
                                                            orderDetail.order
                                                                .createdAt,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gateway Log Webhook payload */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Log Webhook / Payload Gateway
                                            </h4>
                                            {orderDetail.transaction ? (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
                                                        <div>
                                                            <span className="block text-slate-500">
                                                                Gateway Ref
                                                            </span>
                                                            <span className="font-mono text-slate-300">
                                                                {orderDetail
                                                                    .transaction
                                                                    .gatewayRef ||
                                                                    'Manual / None'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-slate-500">
                                                                Status Respon
                                                            </span>
                                                            <span className="font-semibold uppercase text-slate-300">
                                                                {
                                                                    orderDetail
                                                                        .transaction
                                                                        .status
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                                                            Raw Webhook JSON
                                                        </span>
                                                        <pre className="max-h-60 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[10px] text-slate-300">
                                                            {JSON.stringify(
                                                                orderDetail
                                                                    .transaction
                                                                    .payload,
                                                                null,
                                                                2,
                                                            )}
                                                        </pre>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs italic text-slate-500">
                                                    Belum ada respon/payload
                                                    dari gateway payment.
                                                </p>
                                            )}
                                        </div>

                                        {/* Pending Actions */}
                                        {orderDetail.order.status ===
                                            'PENDING' && (
                                            <div className="flex gap-3 border-t border-slate-800 pt-6">
                                                <Button
                                                    onClick={() =>
                                                        handleConfirmPayment(
                                                            orderDetail.order
                                                                .id,
                                                        )
                                                    }
                                                    className="flex-1 bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-600"
                                                >
                                                    Konfirmasi Lunas
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        handleCancelOrder(
                                                            orderDetail.order
                                                                .id,
                                                        )
                                                    }
                                                    className="border-slate-800 bg-slate-950 py-2.5 text-xs text-rose-400 hover:bg-slate-800"
                                                >
                                                    Batalkan Order
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
