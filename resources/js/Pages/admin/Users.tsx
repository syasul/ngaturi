import {
    Calendar,
    Check,
    Copy,
    Crown,
    Download,
    Eye,
    KeyRound,
    Loader2,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Trash2,
    UserCheck,
    UserPlus,
    UserX,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import AdminDashboardLayout from './DashboardLayout';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
    tier: 'BASIC' | 'PREMIUM' | 'CUSTOM' | string;
    packageId?: string | null;
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

const TIER_OPTIONS = [
    {
        id: 'BASIC',
        name: 'BASIC',
        badgeColor: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
        activeRing: 'border-sky-500 ring-2 ring-sky-500/30',
        desc: 'Akses template kategori Basic (30 hari aktif). Cocok untuk paket hemat.',
    },
    {
        id: 'PREMIUM',
        name: 'PREMIUM',
        badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
        activeRing: 'border-amber-500 ring-2 ring-amber-500/30',
        desc: 'Semua template Basic + Premium (365 hari aktif), fitur RSVP, QR, & Amplop.',
    },
    {
        id: 'CUSTOM',
        name: 'CUSTOM',
        badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
        activeRing: 'border-purple-500 ring-2 ring-purple-500/30',
        desc: 'Akses penuh ke semua tema termasuk Custom eksklusif (365 hari aktif).',
    },
];

export const AdminUsers: React.FC = () => {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [tierFilter, setTierFilter] = useState('all');

    // Modals state
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Password Reset state (inside drawer)
    const [resettingPassword, setResettingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // Create User Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER' as 'USER' | 'ADMIN',
        status: 'ACTIVE' as 'ACTIVE' | 'PENDING' | 'BLOCKED',
        tier: 'PREMIUM',
        notes: '',
        isSubmitting: false,
    });

    // Created User Success popup
    const [createdSuccessData, setCreatedSuccessData] = useState<{
        user: any;
        rawPassword?: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    // Edit User Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'USER' as 'USER' | 'ADMIN',
        status: 'ACTIVE' as 'ACTIVE' | 'PENDING' | 'BLOCKED',
        tier: 'BASIC',
        notes: '',
        isSubmitting: false,
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users', {
                params: {
                    search,
                    role: roleFilter,
                    status: statusFilter,
                    tier: tierFilter,
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
    }, [roleFilter, statusFilter, tierFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const generateRandomPassword = () => {
        const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';
        let pass = '';
        for (let i = 0; i < 9; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    };

    // Open Create Modal
    const openCreateModal = () => {
        setCreateForm({
            name: '',
            email: '',
            password: generateRandomPassword(),
            role: 'USER',
            status: 'ACTIVE',
            tier: 'PREMIUM',
            notes: 'Kemitraan Wedding Organizer (WO)',
            isSubmitting: false,
        });
        setIsCreateModalOpen(true);
    };

    // Handle Create User
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
            toast.error('Silakan lengkapi nama, email, dan password.');
            return;
        }

        setCreateForm((prev) => ({ ...prev, isSubmitting: true }));
        try {
            const res = await api.post('/admin/users', {
                name: createForm.name,
                email: createForm.email,
                password: createForm.password,
                role: createForm.role,
                status: createForm.status,
                tier: createForm.tier,
                notes: createForm.notes,
            });

            toast.success(res.data.message || 'User berhasil dibuat!');
            setCreatedSuccessData({
                user: res.data.user,
                rawPassword: createForm.password,
            });
            setIsCreateModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Gagal membuat user.';
            toast.error(msg);
        } finally {
            setCreateForm((prev) => ({ ...prev, isSubmitting: false }));
        }
    };

    // Open Edit Modal
    const openEditModal = (u: User) => {
        setEditForm({
            id: u.id,
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
            status: u.status,
            tier: (u.tier as any) || 'BASIC',
            notes: '',
            isSubmitting: false,
        });
        setIsEditModalOpen(true);
    };

    // Handle Update User
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.name.trim() || !editForm.email.trim()) {
            toast.error('Nama dan email wajib diisi.');
            return;
        }

        setEditForm((prev) => ({ ...prev, isSubmitting: true }));
        try {
            const payload: any = {
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
                status: editForm.status,
                tier: editForm.tier,
                notes: editForm.notes,
            };
            if (editForm.password.trim()) {
                payload.password = editForm.password.trim();
            }

            const res = await api.put(`/admin/users/${editForm.id}`, payload);
            toast.success(res.data.message || 'Data user & tier berhasil diperbarui!');
            setIsEditModalOpen(false);
            fetchUsers();
            if (selectedUserId === editForm.id) {
                viewUserDetails(editForm.id);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Gagal memperbarui user.';
            toast.error(msg);
        } finally {
            setEditForm((prev) => ({ ...prev, isSubmitting: false }));
        }
    };

    // Copy credentials message for WhatsApp / Client
    const copyCredentials = (data: { user: any; rawPassword?: string }) => {
        const text = `Halo kak ${data.user.name},\n\nAkun Ngaturi Anda telah dibuat via rekanan Wedding Organizer (WO).\nBerikut detail login Anda:\n- Email: ${data.user.email}\n- Password: ${data.rawPassword || '(Password yang telah ditentukan)'}\n- Tier Paket: ${data.user.tier}\n- Link Login: ${window.location.origin}/login\n\nSetelah login, Anda bisa langsung memilih template undangan pernikahan sesuai tier paket dan melengkapi detail acara. Terima kasih!`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Kredensial & pesan WhatsApp berhasil disalin!');
        setTimeout(() => setCopied(false), 3000);
    };

    // View User Details
    const viewUserDetails = async (id: string) => {
        setSelectedUserId(id);
        setLoadingDetail(true);
        setResettingPassword(false);
        setNewPassword('');
        try {
            const response = await api.get(`/admin/users/${id}`);
            const data = response.data;
            setUserDetail({
                ...data.user,
                orders: data.orders || [],
                wedding: data.wedding || null,
            });
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
        const headers = 'ID,Nama,Email,Tier,Role,Status,Tanggal Terdaftar\n';
        const rows = usersList
            .map(
                (u) =>
                    `"${u.id}","${u.name}","${u.email}","${u.tier || 'BASIC'}","${u.role}","${u.status}","${new Date(
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

    const renderTierBadge = (tier?: string) => {
        const t = (tier || 'BASIC').toUpperCase();
        if (t === 'CUSTOM') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                    <Sparkles size={11} className="text-purple-400" />
                    <span>CUSTOM</span>
                </span>
            );
        }
        if (t === 'PREMIUM') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                    <Crown size={11} className="text-amber-400" />
                    <span>PREMIUM</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-400">
                <span>BASIC</span>
            </span>
        );
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Kelola User & Kemitraan WO
                    </h1>
                    <p className="text-sm text-slate-400">
                        Pendaftaran client, atur tier paket undangan (Basic / Premium / Custom), dan kelola kredensial.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={openCreateModal}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-95"
                    >
                        <UserPlus size={16} />
                        <span>+ Tambah User Baru</span>
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800"
                    >
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <form
                    onSubmit={handleSearchSubmit}
                    className="grid grid-cols-1 gap-4 md:grid-cols-5"
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
                            value={tierFilter}
                            onChange={(e) => setTierFilter(e.target.value)}
                            className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                            <option value="all">Semua Tier</option>
                            <option value="BASIC">Tier: BASIC</option>
                            <option value="PREMIUM">Tier: PREMIUM</option>
                            <option value="CUSTOM">Tier: CUSTOM</option>
                        </select>
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
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
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
                                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                                    <th className="px-6 py-4 font-semibold">Nama</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Tier / Paket</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Terdaftar</th>
                                    <th className="px-6 py-4 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {usersList.length > 0 ? (
                                    usersList.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="transition-colors hover:bg-slate-800/20"
                                        >
                                            <td className="px-6 py-4 font-semibold text-slate-200">
                                                {u.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {u.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderTierBadge(u.tier)}
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
                                                            : u.status === 'PENDING'
                                                              ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
                                                              : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                                                    }`}
                                                >
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(u.createdAt).toLocaleDateString('id-ID', {
                                                    dateStyle: 'medium',
                                                })}
                                            </td>
                                            <td className="space-x-1.5 px-6 py-4 text-right">
                                                {/* Edit User & Tier Button */}
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="cursor-pointer rounded-lg bg-amber-500/10 p-1.5 text-amber-400 transition-all hover:bg-amber-500/20 hover:text-amber-300"
                                                    title="Edit User & Ganti Tier"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                {/* View Detail Button */}
                                                <button
                                                    onClick={() => viewUserDetails(u.id)}
                                                    className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                                    title="Detail Profile"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                {/* Status Toggle Button */}
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(u.id, u.status)
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
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
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
                                            colSpan={7}
                                            className="py-10 text-center text-slate-500"
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

            {/* CREATE USER MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                                    <UserPlus size={18} />
                                </div>
                                <div>
                                    <h3 className="font-sans text-base font-bold text-white">
                                        Tambah User Baru (WO Client)
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Buat akun langsung aktif dengan pilihan tier paket undangan
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4 p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Nama Lengkap / Mempelai <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.name}
                                        onChange={(e) =>
                                            setCreateForm({ ...createForm, name: e.target.value })
                                        }
                                        placeholder="Contoh: Arya & Nisa"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Email Login <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={createForm.email}
                                        onChange={(e) =>
                                            setCreateForm({ ...createForm, email: e.target.value })
                                        }
                                        placeholder="client@gmail.com"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Password Awal <span className="text-rose-400">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCreateForm({
                                                ...createForm,
                                                password: generateRandomPassword(),
                                            })
                                        }
                                        className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                                    >
                                        <RefreshCw size={11} />
                                        <span>Acak Password</span>
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={createForm.password}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, password: e.target.value })
                                    }
                                    placeholder="Minimal 6 karakter"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-amber-300 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                            </div>

                            {/* Select Tier */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                    Pilih Tier Paket Undangan <span className="text-rose-400">*</span>
                                </label>
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                    {TIER_OPTIONS.map((tier) => (
                                        <div
                                            key={tier.id}
                                            onClick={() =>
                                                setCreateForm({ ...createForm, tier: tier.id })
                                            }
                                            className={`cursor-pointer rounded-xl border p-3 transition-all ${
                                                createForm.tier === tier.id
                                                    ? `${tier.activeRing} bg-slate-950`
                                                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tier.badgeColor}`}
                                                >
                                                    {tier.name}
                                                </span>
                                                {createForm.tier === tier.id && (
                                                    <Check size={14} className="text-amber-400" />
                                                )}
                                            </div>
                                            <p className="mt-2 text-[11px] leading-tight text-slate-400">
                                                {tier.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Role User
                                    </label>
                                    <select
                                        value={createForm.role}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                role: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                                    >
                                        <option value="USER">USER (Customer Undangan)</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Status Akun
                                    </label>
                                    <select
                                        value={createForm.status}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                status: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                                    >
                                        <option value="ACTIVE">ACTIVE (Langsung Aktif)</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="BLOCKED">BLOCKED</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-300">
                                    Catatan Kemitraan WO / Referensi
                                </label>
                                <input
                                    type="text"
                                    value={createForm.notes}
                                    onChange={(e) =>
                                        setCreateForm({ ...createForm, notes: e.target.value })
                                    }
                                    placeholder="Contoh: Paket WO Mahkota Wedding, client resepsi 25 Des"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                                >
                                    Batal
                                </button>
                                <Button
                                    type="submit"
                                    disabled={createForm.isSubmitting}
                                    className="flex items-center gap-2 bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                                >
                                    {createForm.isSubmitting ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={14} />
                                            <span>Buat User & Aktifkan Tier</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATED SUCCESS CREDENTIAL POPUP */}
            {createdSuccessData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                <Check size={20} />
                            </div>
                            <div>
                                <h3 className="font-sans text-base font-bold text-white">
                                    Akun Berhasil Dibuat!
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Tier: <strong className="text-amber-400">{createdSuccessData.user.tier}</strong> | Siap dibagikan ke client/WO
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nama:</span>
                                <span className="font-semibold text-slate-200">
                                    {createdSuccessData.user.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <span className="font-semibold text-slate-200">
                                    {createdSuccessData.user.email}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Password:</span>
                                <span className="font-semibold text-amber-300">
                                    {createdSuccessData.rawPassword}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tier:</span>
                                <span className="font-semibold text-emerald-400">
                                    {createdSuccessData.user.tier}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 space-y-2">
                            <button
                                onClick={() => copyCredentials(createdSuccessData)}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-500"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copied ? 'Tersalin!' : 'Salin Detail Akun & Pesan WA'}</span>
                            </button>
                            <button
                                onClick={() => setCreatedSuccessData(null)}
                                className="w-full rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT USER & TIER MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                                    <Pencil size={18} />
                                </div>
                                <div>
                                    <h3 className="font-sans text-base font-bold text-white">
                                        Edit User & Ganti Tier Paket
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Ubah profil, reset password, dan perbarui tier paket undangan
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-4 p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Nama Lengkap <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.name}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, name: e.target.value })
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Email <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={editForm.email}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, email: e.target.value })
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-300">
                                    Ganti Password (Kosongkan jika tidak ingin diubah)
                                </label>
                                <input
                                    type="text"
                                    value={editForm.password}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, password: e.target.value })
                                    }
                                    placeholder="Masukkan password baru..."
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* Select Tier */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                    Pilih Tier Paket Undangan
                                </label>
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                    {TIER_OPTIONS.map((tier) => (
                                        <div
                                            key={tier.id}
                                            onClick={() =>
                                                setEditForm({ ...editForm, tier: tier.id })
                                            }
                                            className={`cursor-pointer rounded-xl border p-3 transition-all ${
                                                editForm.tier === tier.id
                                                    ? `${tier.activeRing} bg-slate-950`
                                                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tier.badgeColor}`}
                                                >
                                                    {tier.name}
                                                </span>
                                                {editForm.tier === tier.id && (
                                                    <Check size={14} className="text-amber-400" />
                                                )}
                                            </div>
                                            <p className="mt-2 text-[11px] leading-tight text-slate-400">
                                                {tier.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Role
                                    </label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                role: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-300">
                                        Status
                                    </label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                status: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="BLOCKED">BLOCKED</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-300">
                                    Catatan Tambahan
                                </label>
                                <input
                                    type="text"
                                    value={editForm.notes}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, notes: e.target.value })
                                    }
                                    placeholder="Catatan WO / update tier"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                                >
                                    Batal
                                </button>
                                <Button
                                    type="submit"
                                    disabled={editForm.isSubmitting}
                                    className="flex items-center gap-2 bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                                >
                                    {editForm.isSubmitting ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check size={14} />
                                            <span>Simpan Perubahan</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Details Slide-Over Drawer */}
            {selectedUserId && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
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
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-lg font-bold text-white">
                                                        {userDetail.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-500">
                                                        {userDetail.email}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openEditModal(userDetail)}
                                                    className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
                                                >
                                                    <Pencil size={12} />
                                                    <span>Ubah</span>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 text-xs">
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Tier Paket
                                                    </span>
                                                    <div className="mt-1">
                                                        {renderTierBadge(userDetail.tier)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500">
                                                        Status Akun
                                                    </span>
                                                    <span
                                                        className={`mt-1 inline-block font-semibold ${
                                                            userDetail.status === 'ACTIVE'
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
                                                    <span className="mt-1 inline-block font-semibold text-slate-300">
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
                                                            /u/{userDetail.wedding.slug}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                                                                userDetail.wedding.status === 'published'
                                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                                    : 'bg-slate-800 text-slate-400'
                                                            }`}
                                                        >
                                                            {userDetail.wedding.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Calendar size={14} />
                                                        <span>
                                                            Expire:{' '}
                                                            {userDetail.wedding.expiredAt
                                                                ? new Date(
                                                                      userDetail.wedding.expiredAt,
                                                                  ).toLocaleDateString('id-ID', {
                                                                      dateStyle: 'medium',
                                                                  })
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
                                                Riwayat Pembayaran & Paket
                                            </h4>
                                            {userDetail.orders && userDetail.orders.length > 0 ? (
                                                <div className="space-y-2">
                                                    {userDetail.orders.map((o) => (
                                                        <div
                                                            key={o.id}
                                                            className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-xs"
                                                        >
                                                            <div>
                                                                <p className="font-semibold text-slate-200">
                                                                    INV-{o.id.substring(0, 8).toUpperCase()} ({o.packageName || 'BASIC'})
                                                                </p>
                                                                <p className="text-[10px] text-slate-500">
                                                                    {new Date(o.createdAt).toLocaleDateString('id-ID')} &bull; Met: {o.paymentMethod || 'WO'}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-white">
                                                                    {new Intl.NumberFormat('id-ID', {
                                                                        style: 'currency',
                                                                        currency: 'IDR',
                                                                        minimumFractionDigits: 0,
                                                                    }).format(o.amount)}
                                                                </p>
                                                                <span
                                                                    className={`text-[9px] font-bold ${
                                                                        o.status === 'PAID'
                                                                            ? 'text-emerald-400'
                                                                            : 'text-amber-400'
                                                                    }`}
                                                                >
                                                                    {o.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs italic text-slate-500">
                                                    Belum ada riwayat transaksi.
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
                                                    onClick={() => setResettingPassword(true)}
                                                    className="flex w-full items-center justify-center gap-2 border-slate-800 bg-slate-950 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                                                >
                                                    <KeyRound size={14} />
                                                    <span>Reset Password Customer</span>
                                                </Button>
                                            ) : (
                                                <form
                                                    onSubmit={handleResetPassword}
                                                    className="space-y-3"
                                                >
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={newPassword}
                                                            onChange={(e) =>
                                                                setNewPassword(e.target.value)
                                                            }
                                                            placeholder="Masukkan password baru (min 6 karakter)..."
                                                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="submit"
                                                            disabled={newPassword.length < 6}
                                                            className="flex-1 bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-600"
                                                        >
                                                            Simpan Password Baru
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => setResettingPassword(false)}
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

AdminUsers.layout = (page: React.ReactNode) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);

export default AdminUsers;
