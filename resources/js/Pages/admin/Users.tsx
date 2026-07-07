import {
    Calendar,
    Download,
    Eye,
    KeyRound,
    Loader2,
    Search,
    Trash2,
    UserCheck,
    UserX,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
    createdAt: string;
}

interface UserDetail extends User {
    orders: Array<{
        id: string;
        packageName: string;
        amount: number;
        status: string;
        paymentMethod: string;
        createdAt: string;
    }>;
    wedding: {
        id: string;
        slug: string;
        status: string;
        expiredAt: string | null;
        createdAt: string;
    } | null;
}

export const AdminUsers: React.FC = () => {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modals state
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Password Reset state
    const [resettingPassword, setResettingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users', {
                params: {
                    search,
                    role: roleFilter,
                    status: statusFilter,
                },
            });
            setUsersList(response.data.users);
        } catch (err: any) {
            toast.error('Gagal memuat daftar user.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    // View User Details
    const viewUserDetails = async (id: string) => {
        setSelectedUserId(id);
        setLoadingDetail(true);
        setResettingPassword(false);
        setNewPassword('');
        try {
            const response = await api.get(`/admin/users/${id}`);
            setUserDetail(response.data);
        } catch (err: any) {
            toast.error('Gagal mengambil detail user.');
            setSelectedUserId(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Toggle User Status
    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        const loadingToast = toast.loading('Mengubah status user...');
        try {
            await api.put(`/admin/users/${id}/status`, { status: nextStatus });
            toast.dismiss(loadingToast);
            toast.success(
                `User berhasil ${nextStatus === 'ACTIVE' ? 'diaktifkan' : 'diblokir'}!`,
            );
            fetchUsers();
            if (userDetail && userDetail.id === id) {
                setUserDetail({ ...userDetail, status: nextStatus as any });
            }
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal mengubah status user.');
        }
    };

    // Force Password Reset
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || newPassword.length < 6) return;
        const loadingToast = toast.loading('Mereset password user...');
        try {
            await api.put(`/admin/users/${selectedUserId}/reset-password`, {
                password: newPassword,
            });
            toast.dismiss(loadingToast);
            toast.success('Password user berhasil direset!');
            setResettingPassword(false);
            setNewPassword('');
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error(
                err.response?.data?.message || 'Gagal mereset password.',
            );
        }
    };

    // Delete User Account
    const handleDeleteUser = async (id: string) => {
        if (
            !window.confirm(
                'Apakah Anda yakin ingin menghapus akun user ini secara permanen? Seluruh data undangan, foto, tamu, dan rsvp akan terhapus.',
            )
        )
            return;
        const loadingToast = toast.loading('Menghapus user...');
        try {
            await api.delete(`/admin/users/${id}`);
            toast.dismiss(loadingToast);
            toast.success('User berhasil dihapus.');
            setSelectedUserId(null);
            setUserDetail(null);
            fetchUsers();
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal menghapus user.');
        }
    };

    // Export User List to CSV
    const handleExportCSV = () => {
        if (usersList.length === 0) return;
        const headers = 'ID,Nama,Email,Role,Status,Tanggal Terdaftar\n';
        const rows = usersList
            .map(
                (u) =>
                    `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${new Date(
                        u.createdAt,
                    ).toLocaleDateString('id-ID')}"`,
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
            `daftar-user-ngaturi-${new Date().toISOString().split('T')[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Kelola User
                    </h1>
                    <p className="text-sm text-slate-400">
                        Kelola credentials, status, dan data customer Ngaturi
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800"
                >
                    <Download size={16} />
                    <span>Export ke CSV</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <form
                    onSubmit={handleSearchSubmit}
                    className="grid grid-cols-1 gap-4 md:grid-cols-4"
                >
                    <div className="relative rounded-full md:col-span-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari user berdasarkan nama atau email..."
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-11 pr-4 text-sm text-slate-100 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                    </div>

                    <div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                            <option value="all">Semua Role</option>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                            <option value="all">Semua Status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PENDING">PENDING</option>
                            <option value="BLOCKED">BLOCKED</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* Users Table */}
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
                                        Nama
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Terdaftar
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {usersList.length > 0 ? (
                                    usersList.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-slate-800/10"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-200">
                                                {u.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {u.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                                        u.role === 'ADMIN'
                                                            ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                                                            : 'border border-slate-700 bg-slate-800 text-slate-400'
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                        u.status === 'ACTIVE'
                                                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                            : u.status ===
                                                                'PENDING'
                                                              ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
                                                              : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                                                    }`}
                                                >
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(
                                                    u.createdAt,
                                                ).toLocaleDateString('id-ID', {
                                                    dateStyle: 'medium',
                                                })}
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        viewUserDetails(u.id)
                                                    }
                                                    className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                                    title="Detail User"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            u.id,
                                                            u.status,
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                                                        u.status === 'ACTIVE'
                                                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
                                                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'
                                                    }`}
                                                    title={
                                                        u.status === 'ACTIVE'
                                                            ? 'Blokir User'
                                                            : 'Aktifkan User'
                                                    }
                                                >
                                                    {u.status === 'ACTIVE' ? (
                                                        <UserX size={14} />
                                                    ) : (
                                                        <UserCheck size={14} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(u.id)
                                                    }
                                                    className="cursor-pointer rounded-lg bg-red-500/10 p-1.5 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                                                    title="Hapus Akun"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-slate-500"
                                        >
                                            User tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Details Slide-Over / Modal */}
            {selectedUserId && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex justify-end bg-slate-950/70">
                    <div className="relative flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
                        {/* Header */}
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                            <h3 className="font-sans text-base font-bold text-white">
                                Detail Profile Customer
                            </h3>
                            <button
                                onClick={() => setSelectedUserId(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable details */}
                        <div className="flex-1 space-y-6 overflow-y-auto p-6">
                            {loadingDetail ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2
                                        className="animate-spin text-amber-500"
                                        size={24}
                                    />
                                </div>
                            ) : (
                                userDetail && (
                                    <>
                                        {/* User Card */}
                                        <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950 p-5">
                                            <div>
                                                <h4 className="text-lg font-bold text-white">
                                                    {userDetail.name}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    {userDetail.email}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Status Akun
                                                    </span>
                                                    <span
                                                        className={`font-semibold ${
                                                            userDetail.status ===
                                                            'ACTIVE'
                                                                ? 'text-emerald-400'
                                                                : 'text-rose-400'
                                                        }`}
                                                    >
                                                        {userDetail.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Role
                                                    </span>
                                                    <span className="font-semibold text-slate-300">
                                                        {userDetail.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active Wedding Invitation */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Undangan Digital
                                            </h4>
                                            {userDetail.wedding ? (
                                                <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-950 p-4">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-semibold text-white">
                                                            /u/
                                                            {
                                                                userDetail
                                                                    .wedding
                                                                    .slug
                                                            }
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                                                                userDetail
                                                                    .wedding
                                                                    .status ===
                                                                'published'
                                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                                    : 'bg-slate-800 text-slate-400'
                                                            }`}
                                                        >
                                                            {
                                                                userDetail
                                                                    .wedding
                                                                    .status
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Calendar size={14} />
                                                        <span>
                                                            Expire:{' '}
                                                            {userDetail.wedding
                                                                .expiredAt
                                                                ? new Date(
                                                                      userDetail
                                                                          .wedding
                                                                          .expiredAt,
                                                                  ).toLocaleDateString(
                                                                      'id-ID',
                                                                      {
                                                                          dateStyle:
                                                                              'medium',
                                                                      },
                                                                  )
                                                                : 'Draft (Belum lunas)'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs italic text-slate-500">
                                                    User belum membuat undangan.
                                                </p>
                                            )}
                                        </div>

                                        {/* Invoice History */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Riwayat Pembayaran
                                            </h4>
                                            {userDetail.orders.length > 0 ? (
                                                <div className="space-y-2">
                                                    {userDetail.orders.map(
                                                        (o) => (
                                                            <div
                                                                key={o.id}
                                                                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-xs"
                                                            >
                                                                <div>
                                                                    <p className="font-semibold text-slate-200">
                                                                        INV-
                                                                        {o.id
                                                                            .substring(
                                                                                0,
                                                                                8,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-500">
                                                                        {new Date(
                                                                            o.createdAt,
                                                                        ).toLocaleDateString(
                                                                            'id-ID',
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-white">
                                                                        {new Intl.NumberFormat(
                                                                            'id-ID',
                                                                            {
                                                                                style: 'currency',
                                                                                currency:
                                                                                    'IDR',
                                                                                minimumFractionDigits: 0,
                                                                            },
                                                                        ).format(
                                                                            o.amount,
                                                                        )}
                                                                    </p>
                                                                    <span
                                                                        className={`text-[9px] font-bold ${
                                                                            o.status ===
                                                                            'PAID'
                                                                                ? 'text-emerald-400'
                                                                                : 'text-amber-400'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            o.status
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs italic text-slate-500">
                                                    Belum ada transaksi.
                                                </p>
                                            )}
                                        </div>

                                        {/* Reset Password Form */}
                                        <div className="space-y-3 border-t border-slate-800 pt-6">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Aksi Keamanan
                                            </h4>
                                            {!resettingPassword ? (
                                                <Button
                                                    onClick={() =>
                                                        setResettingPassword(
                                                            true,
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                                                >
                                                    <KeyRound size={14} />
                                                    <span>
                                                        Reset Password Customer
                                                    </span>
                                                </Button>
                                            ) : (
                                                <form
                                                    onSubmit={
                                                        handleResetPassword
                                                    }
                                                    className="space-y-3"
                                                >
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={newPassword}
                                                            onChange={(e) =>
                                                                setNewPassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Masukkan password baru (min 6 karakter)..."
                                                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                newPassword.length <
                                                                6
                                                            }
                                                            className="flex-1 bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-600"
                                                        >
                                                            Simpan Password Baru
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() =>
                                                                setResettingPassword(
                                                                    false,
                                                                )
                                                            }
                                                            className="border-slate-800 bg-slate-950 py-2 text-xs text-slate-400"
                                                        >
                                                            Batal
                                                        </Button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
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

export default AdminUsers;
