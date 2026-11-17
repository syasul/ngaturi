import {
    AlertTriangle,
    ArrowRight,
    Clock,
    Flame,
    Heart,
    Palette,
    RefreshCw,
    TrendingUp,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { toast } from 'sonner';
import api from '../../lib/api';
import AdminDashboardLayout from './DashboardLayout';

interface KPI {
    totalRevenueAllTime: number;
    totalRevenueMonth: number;
    totalUsers: number;
    payingCustomers: number;
    freeUsers: number;
    recentUsersCount: number;
    olderUsersCount: number;
    totalWeddings: number;
    liveWeddings: number;
    draftWeddings: number;
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    mostPopularTheme?: string;
    mostPopularThemeCount?: number;
    totalWeddingsWithTheme?: number;
}

interface PackageItem {
    name: string;
    value: number;
    amount: number;
}

export interface TopThemeItem {
    themeId: string;
    name: string;
    packageLevel: 'BASIC' | 'PREMIUM' | 'CUSTOM' | string;
    thumbnailUrl?: string | null;
    count: number;
}

interface AnalyticsData {
    kpis: KPI;
    dailyRevenue: Array<{ date: string; amount: number }>;
    weeklyUsers: Array<{ week: string; count: number }>;
    packageDistribution: Array<PackageItem>;
    packageDistributionMonth?: Array<PackageItem>;
    topThemes?: Array<TopThemeItem>;
    mostPopularTheme?: TopThemeItem | null;
    recentTransactions: Array<{
        id: string;
        userName: string;
        userEmail: string;
        packageName: string;
        amount: number;
        status: string;
        paymentMethod: string;
        createdAt: string;
    }>;
    expiringWeddings: Array<{
        id: string;
        slug: string;
        expiredAt: string;
        userName: string;
        userEmail: string;
    }>;
}

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

export const AdminOverview: React.FC = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [packageFilter, setPackageFilter] = useState<'all' | 'month'>('all');
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchAnalytics = async (isManual = false) => {
        if (isManual) {
            setIsRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await api.get('/admin/analytics');
            setData(response.data.analytics);
            setLastUpdated(
                new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
            );
            if (isManual) {
                toast.success('Data analitik berhasil disinkronkan.');
            }
        } catch (err: any) {
            toast.error('Gagal mengambil data analytics.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(false);
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="py-12 text-center">
                <p className="text-slate-400">Data tidak tersedia.</p>
            </div>
        );
    }

    const {
        kpis,
        dailyRevenue,
        weeklyUsers,
        packageDistribution,
        packageDistributionMonth = [],
        topThemes = [],
        mostPopularTheme = null,
        recentTransactions,
        expiringWeddings,
    } = data;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const activePackages =
        packageFilter === 'month'
            ? packageDistributionMonth
            : packageDistribution;

    const activeTotalPackages = activePackages.reduce(
        (sum, item) => sum + item.value,
        0,
    );
    const activeTotalAmount = activePackages.reduce(
        (sum, item) => sum + (item.amount || 0),
        0,
    );

    const thirtyDaysRevenueTotal = dailyRevenue.reduce(
        (acc, curr) => acc + (curr.amount || 0),
        0,
    );

    return (
        <div className="space-y-8">
            {/* Header with Refresh Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Overview Analytics
                    </h1>
                    <p className="text-sm text-slate-400">
                        Kinerja operasional dan performa keuangan Ngaturi
                        {lastUpdated && (
                            <span className="ml-2 inline-flex items-center text-xs text-slate-500">
                                • Terakhir diperbarui: {lastUpdated}
                            </span>
                        )}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => fetchAnalytics(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw
                            size={14}
                            className={
                                isRefreshing
                                    ? 'animate-spin text-amber-400'
                                    : 'text-slate-400'
                            }
                        />
                        <span>
                            {isRefreshing ? 'Menyinkronkan...' : 'Segarkan Data'}
                        </span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* KPI 1 - Omset / Revenue */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Omset Penjualan
                            </p>
                            <h3 className="mt-1.5 text-2xl font-bold text-white">
                                {formatCurrency(
                                    kpis.totalRevenueAllTime ??
                                        kpis.totalRevenueMonth,
                                )}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
                            Bulan Ini: {formatCurrency(kpis.totalRevenueMonth)}
                        </span>
                        <span className="text-slate-500">
                            • {kpis.paidOrders ?? 0} order lunas
                        </span>
                    </div>
                </div>

                {/* KPI 2 - Total Customer */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Customer
                            </p>
                            <h3 className="mt-1.5 text-2xl font-bold text-white">
                                {kpis.totalUsers}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 font-medium text-blue-400">
                            {kpis.payingCustomers ?? 0} Berlangganan
                        </span>
                        <span className="text-slate-500">
                            • {kpis.freeUsers ?? 0} Belum Order
                        </span>
                    </div>
                </div>

                {/* KPI 3 - Undangan Live */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Undangan Live
                            </p>
                            <h3 className="mt-1.5 text-2xl font-bold text-white">
                                {kpis.liveWeddings}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
                            <Heart size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 font-medium text-amber-400">
                            {kpis.liveWeddings} Published
                        </span>
                        <span className="text-slate-500">
                            {kpis.mostPopularTheme && kpis.mostPopularTheme !== '-'
                                ? `• Favorit: ${kpis.mostPopularTheme} (${kpis.mostPopularThemeCount}x)`
                                : kpis.draftWeddings > 0
                                  ? `• ${kpis.draftWeddings} Draf`
                                  : '• Semua ditayangkan'}
                        </span>
                    </div>
                </div>

                {/* KPI 4 - Order Pending */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Order Pending
                            </p>
                            <h3 className="mt-1.5 text-2xl font-bold text-white">
                                {kpis.pendingOrders}
                            </h3>
                        </div>
                        <div
                            className={`rounded-xl border p-3 ${
                                kpis.pendingOrders > 0
                                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                            }`}
                        >
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                        <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${
                                kpis.pendingOrders > 0
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                            }`}
                        >
                            {kpis.pendingOrders > 0
                                ? `${kpis.pendingOrders} Perlu Konfirmasi`
                                : 'Tidak Ada Antrean'}
                        </span>
                        <span className="text-slate-500">
                            • {kpis.paidOrders ?? 0} Lunas
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Daily Revenue Chart */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Revenue Harian (30 Hari Terakhir)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Total omset 30 hari: {formatCurrency(thirtyDaysRevenueTotal)}
                            </p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dailyRevenue}
                                margin={{
                                    top: 10,
                                    right: 15,
                                    left: -15,
                                    bottom: 0,
                                }}
                            >
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    tickFormatter={(str) => {
                                        try {
                                            const d = new Date(str);
                                            return `${d.getDate()}/${d.getMonth() + 1}`;
                                        } catch {
                                            return str;
                                        }
                                    }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    tickFormatter={(v) => {
                                        if (v >= 1000000)
                                            return `${(v / 1000000).toFixed(1)}jt`;
                                        if (v >= 1000)
                                            return `${(v / 1000).toFixed(0)}k`;
                                        return `${v}`;
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        borderColor: '#334155',
                                        borderRadius: '0.75rem',
                                        fontSize: '12px',
                                    }}
                                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                                    formatter={(value: any) => [
                                        formatCurrency(Number(value)),
                                        'Omset Harian',
                                    ]}
                                    labelFormatter={(label: any) => {
                                        try {
                                            return new Date(
                                                label,
                                            ).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            });
                                        } catch {
                                            return label;
                                        }
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#f59e0b"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5, fill: '#f59e0b' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Package Sales Distribution */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                Distribusi Paket Terjual
                            </h3>
                            <p className="text-xs text-slate-500">
                                {packageFilter === 'month'
                                    ? 'Penjualan lunas bulan ini'
                                    : 'Akumulasi paket semua waktu'}
                            </p>
                        </div>
                        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-[11px]">
                            <button
                                onClick={() => setPackageFilter('all')}
                                className={`rounded-md px-2.5 py-1 font-medium transition ${
                                    packageFilter === 'all'
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setPackageFilter('month')}
                                className={`rounded-md px-2.5 py-1 font-medium transition ${
                                    packageFilter === 'month'
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                Bulan Ini
                            </button>
                        </div>
                    </div>

                    <div className="flex h-56 items-center justify-center">
                        {activePackages.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activePackages}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {activePackages.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (
                                                active &&
                                                payload &&
                                                payload.length
                                            ) {
                                                const item =
                                                    payload[0]
                                                        .payload as PackageItem;
                                                return (
                                                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
                                                        <p className="text-xs font-semibold text-white">
                                                            {item.name}
                                                        </p>
                                                        <p className="mt-1 text-[11px] text-slate-400">
                                                            Jumlah:{' '}
                                                            <span className="font-semibold text-slate-200">
                                                                {item.value} paket
                                                            </span>
                                                        </p>
                                                        {item.amount > 0 && (
                                                            <p className="text-[11px] text-amber-400">
                                                                Total:{' '}
                                                                <span className="font-semibold">
                                                                    {formatCurrency(
                                                                        item.amount,
                                                                    )}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(val, entry: any) => {
                                            const item = entry.payload;
                                            return (
                                                <span className="text-xs text-slate-300">
                                                    {val} ({item.value})
                                                </span>
                                            );
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-xs text-slate-500">
                                Belum ada data paket terjual untuk periode ini.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-800/60 pt-2 text-center">
                        <p className="text-xs font-medium text-slate-400">
                            Total:{' '}
                            <span className="font-bold text-white">
                                {activeTotalPackages} Paket Terjual
                            </span>
                            {activeTotalAmount > 0 && (
                                <span className="ml-1.5 font-semibold text-amber-400">
                                    ({formatCurrency(activeTotalAmount)})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Weekly Users Chart */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-1">
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            Registrasi User Baru
                        </h3>
                        <p className="text-xs text-slate-500">
                            Aktivitas customer 4 minggu terakhir
                        </p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={weeklyUsers}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -25,
                                    bottom: 25,
                                }}
                            >
                                <XAxis
                                    dataKey="week"
                                    stroke="#64748b"
                                    fontSize={9}
                                    tickLine={false}
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        borderColor: '#334155',
                                        borderRadius: '0.75rem',
                                        fontSize: '12px',
                                    }}
                                    labelStyle={{
                                        color: '#fff',
                                        fontWeight: 600,
                                    }}
                                    formatter={(value: any) => [
                                        `${value} user terdaftar`,
                                        'Customer Baru',
                                    ]}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="border-t border-slate-800/60 pt-2 text-[11px] text-slate-500">
                        {kpis.olderUsersCount > 0 ? (
                            <span>
                                * {kpis.recentUsersCount || weeklyUsers.reduce((s, w) => s + w.count, 0)} customer baru dalam 28 hari terakhir. {kpis.olderUsersCount} customer terdaftar sebelumnya.
                            </span>
                        ) : (
                            <span>
                                * Menampilkan perkembangan registrasi akun 28 hari terakhir.
                            </span>
                        )}
                    </div>
                </div>

                {/* Expiring Weddings List */}
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                                <AlertTriangle
                                    className="text-amber-500"
                                    size={16}
                                />
                                <span>Undangan Expire Dalam 7 Hari</span>
                            </h3>
                            <p className="text-xs text-slate-500">
                                Undangan berbayar yang akan dinonaktifkan sistem
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="py-2.5">Slug Undangan</th>
                                    <th className="py-2.5">User Pemilik</th>
                                    <th className="py-2.5">
                                        Tanggal Kadaluwarsa
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {expiringWeddings.length > 0 ? (
                                    expiringWeddings.map((w) => (
                                        <tr
                                            key={w.id}
                                            className="hover:bg-slate-800/25"
                                        >
                                            <td className="py-3 font-semibold text-slate-200">
                                                /u/{w.slug}
                                            </td>
                                            <td className="py-3 text-slate-400">
                                                <div>{w.userName}</div>
                                                <div className="text-[10px] text-slate-500">
                                                    {w.userEmail}
                                                </div>
                                            </td>
                                            <td className="py-3 font-semibold text-amber-500">
                                                {w.expiredAt
                                                    ? new Date(
                                                          w.expiredAt,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              dateStyle:
                                                                  'medium',
                                                          },
                                                      )
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="py-8 text-center text-slate-500"
                                        >
                                            Tidak ada undangan yang segera
                                            kedaluwarsa.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Top Themes & Popularity Section */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <Flame className="text-amber-500" size={18} />
                            <span>Tema Paling Sering Digunakan (Leaderboard Terpopuler)</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                            Peringkat tema undangan berdasarkan jumlah customer yang menggunakannya
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/themes"
                            className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400"
                        >
                            <span>Katalog Semua Tema</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {topThemes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {topThemes.map((theme, idx) => {
                            const totalThemeUsages = kpis.totalWeddingsWithTheme || topThemes.reduce((s, t) => s + t.count, 0);
                            const percent = totalThemeUsages > 0 ? Math.round((theme.count / totalThemeUsages) * 100) : 0;
                            return (
                                <div
                                    key={theme.themeId}
                                    className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-700"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                                                    idx === 0
                                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                                        : idx === 1
                                                          ? 'bg-slate-300 text-slate-900'
                                                          : idx === 2
                                                            ? 'bg-amber-700/60 text-amber-200'
                                                            : 'bg-slate-800 text-slate-400'
                                                }`}
                                            >
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">
                                                    {theme.name}
                                                </h4>
                                                <span className="font-mono text-[10px] text-slate-500">
                                                    {theme.themeId}
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                                theme.packageLevel === 'PREMIUM'
                                                    ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                                                    : theme.packageLevel === 'CUSTOM'
                                                      ? 'border border-purple-500/20 bg-purple-500/10 text-purple-400'
                                                      : 'border border-sky-500/20 bg-sky-500/10 text-sky-400'
                                            }`}
                                        >
                                            {theme.packageLevel}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400">Pengguna:</span>
                                            <span className="font-bold text-white">
                                                {theme.count} Customer ({percent}%)
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    idx === 0
                                                        ? 'bg-amber-500'
                                                        : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${Math.max(percent, 8)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px]">
                                        <Link
                                            href={`/admin/users?theme=${theme.themeId}`}
                                            className="text-slate-400 hover:text-amber-400"
                                        >
                                            Lihat customer pemakai &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
                        Belum ada customer yang memilih atau menggunakan tema undangan.
                    </div>
                )}
            </div>

            {/* Recent Transactions List */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            5 Transaksi Terbaru
                        </h3>
                        <p className="text-xs text-slate-500">
                            Pembayaran dan log tagihan invoice terbaru
                        </p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400"
                    >
                        <span>Semua Transaksi</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="py-3">Invoice</th>
                                <th className="py-3">Customer</th>
                                <th className="py-3">Paket</th>
                                <th className="py-3">Jumlah</th>
                                <th className="py-3">Metode</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {recentTransactions.map((trx) => (
                                <tr
                                    key={trx.id}
                                    className="hover:bg-slate-800/25"
                                >
                                    <td className="py-3.5 font-semibold text-slate-300">
                                        INV-
                                        {trx.id.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="py-3.5">
                                        <div className="text-slate-200">
                                            {trx.userName}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            {trx.userEmail}
                                        </div>
                                    </td>
                                    <td className="py-3.5">
                                        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold">
                                            {trx.packageName}
                                        </span>
                                    </td>
                                    <td className="py-3.5 font-semibold text-white">
                                        {formatCurrency(trx.amount)}
                                    </td>
                                    <td className="py-3.5 text-slate-400">
                                        {trx.paymentMethod || 'Web'}
                                    </td>
                                    <td className="py-3.5">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                trx.status === 'PAID'
                                                    ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                    : trx.status === 'PENDING'
                                                      ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                                                      : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                                            }`}
                                        >
                                            {trx.status === 'PAID'
                                                ? 'LUNAS'
                                                : trx.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 text-slate-500">
                                        {new Date(
                                            trx.createdAt,
                                        ).toLocaleDateString('id-ID', {
                                            dateStyle: 'medium',
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

AdminOverview.layout = (page: React.ReactNode) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);

export default AdminOverview;
