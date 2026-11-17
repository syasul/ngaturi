import {
    Copy,
    Edit3,
    ExternalLink,
    Eye,
    Flame,
    Image as ImageIcon,
    Loader2,
    Palette,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

interface Theme {
    id: string;
    code?: string;
    tierCode?: string;
    demoUrl?: string;
    name: string;
    thumbnailUrl: string | null;
    isActive: boolean;
    packageLevel: 'BASIC' | 'PREMIUM' | 'CUSTOM';
    usersCount: number;
}

export const AdminThemes: React.FC = () => {
    const [themesList, setThemesList] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'BASIC' | 'PREMIUM' | 'CUSTOM'>('ALL');
    const [sortBy, setSortBy] = useState<'POPULAR' | 'NAME' | 'ID'>('POPULAR');
    const [totalWeddingsCount, setTotalWeddingsCount] = useState(0);

    // Drawer / Form state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

    // Form Fields
    const [name, setName] = useState('');
    const [slugId, setSlugId] = useState(''); // theme id (e.g. rustic)
    const [code, setCode] = useState(''); // random demo code
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [packageLevel, setPackageLevel] = useState<'BASIC' | 'PREMIUM' | 'CUSTOM'>(
        'BASIC',
    );
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/themes');
            setThemesList(response.data.themes || []);
            if (response.data.totalWeddingsCount !== undefined) {
                setTotalWeddingsCount(response.data.totalWeddingsCount);
            }
        } catch (err: any) {
            toast.error('Gagal memuat katalog tema.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, []);

    const openAddDrawer = () => {
        setEditMode(false);
        setSelectedThemeId(null);
        setName('');
        setSlugId('');
        setCode('');
        setThumbnailUrl('');
        setPackageLevel('BASIC');
        setIsActive(true);
        setDrawerOpen(true);
    };

    const openEditDrawer = (theme: Theme) => {
        setEditMode(true);
        setSelectedThemeId(theme.id);
        setName(theme.name);
        setSlugId(theme.id);
        setCode(theme.code || '');
        setThumbnailUrl(theme.thumbnailUrl || '');
        setPackageLevel(theme.packageLevel);
        setIsActive(theme.isActive);
        setDrawerOpen(true);
    };

    // Handle Thumbnail File Upload
    const handleThumbnailUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const loadingToast = toast.loading('Mengunggah gambar thumbnail...');
        try {
            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.dismiss(loadingToast);
            toast.success('Thumbnail berhasil diunggah!');
            setThumbnailUrl(response.data.url);
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal mengunggah thumbnail.');
        }
    };

    // Submit Add/Edit Theme Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !slugId) {
            toast.error('Nama dan Slug ID tema wajib diisi.');
            return;
        }

        setSaving(true);
        const payload = {
            id: slugId,
            code,
            name,
            thumbnailUrl,
            packageLevel,
            isActive,
        };

        try {
            if (editMode && selectedThemeId) {
                await api.put(`/admin/themes/${selectedThemeId}`, payload);
                toast.success('Tema berhasil diperbarui!');
            } else {
                await api.post('/admin/themes', payload);
                toast.success('Tema baru berhasil ditambahkan!');
            }
            setDrawerOpen(false);
            fetchThemes();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan tema.');
        } finally {
            setSaving(false);
        }
    };

    // Toggle Theme Activation
    const handleToggleActive = async (theme: Theme) => {
        const nextStatus = !theme.isActive;
        try {
            await api.put(`/admin/themes/${theme.id}`, {
                name: theme.name,
                thumbnailUrl: theme.thumbnailUrl,
                packageLevel: theme.packageLevel,
                isActive: nextStatus,
            });
            toast.success(
                `Tema ${theme.name} berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}!`,
            );
            fetchThemes();
        } catch (err: any) {
            toast.error('Gagal memperbarui status tema.');
        }
    };

    // Delete Theme
    const handleDeleteTheme = async (theme: Theme) => {
        if (theme.usersCount > 0) {
            toast.error(
                'Gagal menghapus: Tema masih aktif digunakan oleh customer.',
            );
            return;
        }

        if (!window.confirm(`Hapus tema "${theme.name}" secara permanen?`))
            return;

        try {
            await api.delete(`/admin/themes/${theme.id}`);
            toast.success('Tema berhasil dihapus.');
            fetchThemes();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menghapus tema.');
        }
    };

    const maxUsersCount = Math.max(...themesList.map((t) => t.usersCount || 0), 0);
    const mostPopularTheme = themesList.reduce<Theme | null>((max, t) => {
        if (!max || (t.usersCount || 0) > (max.usersCount || 0)) {
            return t;
        }
        return max;
    }, null);

    const filteredThemes = themesList
        .filter((t) => {
            const matchesSearch =
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                categoryFilter === 'ALL' || t.packageLevel === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'POPULAR') {
                return (b.usersCount || 0) - (a.usersCount || 0);
            }
            if (sortBy === 'NAME') {
                return a.name.localeCompare(b.name);
            }
            return a.id.localeCompare(b.id);
        });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Katalog Tema
                    </h1>
                    <p className="text-sm text-slate-400">
                        Kelola katalog design layout dan package restriction
                        tema
                    </p>
                </div>
                <button
                    onClick={openAddDrawer}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-600"
                >
                    <Plus size={16} />
                    <span>Tambah Tema</span>
                </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Koleksi Tema
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-white">
                                {themesList.length} Desain
                            </h3>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400">
                            <Palette size={22} />
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                        {themesList.filter((t) => t.packageLevel === 'BASIC').length} Basic •{' '}
                        {themesList.filter((t) => t.packageLevel === 'PREMIUM').length} Premium •{' '}
                        {themesList.filter((t) => t.packageLevel === 'CUSTOM').length} Custom
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Tema Paling Sering Digunakan
                            </p>
                            <h3 className="mt-1 text-xl font-bold text-amber-400">
                                {mostPopularTheme && (mostPopularTheme.usersCount || 0) > 0
                                    ? mostPopularTheme.name
                                    : 'Belum Ada Data'}
                            </h3>
                        </div>
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
                            <Flame size={22} />
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                        {mostPopularTheme && (mostPopularTheme.usersCount || 0) > 0 ? (
                            <span>
                                Dipakai oleh <strong className="text-white">{mostPopularTheme.usersCount}</strong> customer ({mostPopularTheme.id})
                            </span>
                        ) : (
                            'Belum ada customer memilih tema'
                        )}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Penggunaan Tema
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-white">
                                {totalWeddingsCount || themesList.reduce((sum, t) => sum + (t.usersCount || 0), 0)} Undangan
                            </h3>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-400">
                            <Users size={22} />
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                        Akumulasi undangan customer yang sudah memilih tema
                    </p>
                </div>
            </div>

            {/* Filter, Search & Sort Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari tema berdasarkan nama atau ID..."
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-100 transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Filter Pills */}
                    <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1 text-[11px]">
                        {(['ALL', 'BASIC', 'PREMIUM', 'CUSTOM'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                                    categoryFilter === cat
                                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {cat === 'ALL' ? 'Semua' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
                    >
                        <option value="POPULAR">🔥 Paling Sering Digunakan</option>
                        <option value="NAME">Nama Tema (A-Z)</option>
                        <option value="ID">ID Tema</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2
                        className="animate-spin text-amber-500"
                        size={32}
                    />
                </div>
            ) : filteredThemes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
                    Tidak ada tema yang cocok dengan kriteria pencarian.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredThemes.map((t) => {
                        const isTopPopular = t.usersCount > 0 && t.usersCount === maxUsersCount;
                        return (
                            <div
                                key={t.id}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700"
                            >
                                {/* Thumbnail Area */}
                                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-slate-800/80 bg-slate-950">
                                    {t.thumbnailUrl ? (
                                        <img
                                            src={
                                                t.thumbnailUrl.startsWith('/')
                                                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${t.thumbnailUrl}`
                                                    : t.thumbnailUrl
                                            }
                                            alt={t.name}
                                            className="duration-550 h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-700">
                                            <ImageIcon size={48} />
                                            <span className="text-xs">
                                                No Thumbnail
                                            </span>
                                        </div>
                                    )}

                                    {/* Badges Left */}
                                    <div className="absolute left-4 top-4 flex items-center gap-2">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase shadow-lg ${
                                                t.packageLevel === 'PREMIUM'
                                                    ? 'bg-amber-500 text-slate-950'
                                                    : t.packageLevel === 'CUSTOM'
                                                      ? 'bg-purple-500 text-white'
                                                      : 'border border-slate-700 bg-slate-850 text-slate-300'
                                            }`}
                                        >
                                            {t.packageLevel}
                                        </span>
                                        {isTopPopular && (
                                            <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/90 px-2 py-0.5 text-[9px] font-bold text-slate-950 shadow-md">
                                                <Flame size={10} />
                                                <span>Terpopuler</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Users Count Badge */}
                                    <Link
                                        href={`/admin/users?theme=${t.id}`}
                                        className="backdrop-blur-xs absolute bottom-4 right-4 flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-400"
                                        title="Klik untuk melihat user yang menggunakan tema ini"
                                    >
                                        <Users size={11} />
                                        <span>{t.usersCount} Pengguna</span>
                                    </Link>
                                </div>

                                {/* Title & Info */}
                                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white">
                                                {t.name}
                                            </h3>
                                            <span className="font-mono text-[10px] text-amber-500/80">
                                                Code: {t.code || '-'}
                                            </span>
                                        </div>
                                        <p className="font-mono text-xs text-slate-500">
                                            ID: {t.id}
                                        </p>

                                        {/* Demo URL Bar */}
                                        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950 p-2 text-[10px] font-mono text-slate-400">
                                            <span className="truncate">
                                                /demo/{t.tierCode || 'b'}/{t.code || t.id}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const url =
                                                        t.demoUrl ||
                                                        `https://ngaturi.inxdvi.com/demo/${t.tierCode || 'b'}/${t.code || t.id}`;
                                                    navigator.clipboard.writeText(url);
                                                    toast.success('Link demo disalin!');
                                                }}
                                                className="ml-1 cursor-pointer text-amber-500 hover:text-amber-400"
                                                title="Salin link demo"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
                                        {/* Status Toggle */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleToggleActive(t)
                                                }
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                                    t.isActive
                                                        ? 'bg-amber-500'
                                                        : 'bg-slate-800'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                                                        t.isActive
                                                            ? 'translate-x-4'
                                                            : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <span className="text-xs text-slate-400">
                                                {t.isActive ? 'Aktif' : 'Draft'}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5">
                                            <Link
                                                href={`/admin/users?theme=${t.id}`}
                                                className="cursor-pointer rounded-lg bg-slate-800 px-2 py-1.5 text-[11px] font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-amber-400"
                                                title="Filter User Pemakai"
                                            >
                                                <span>User ({t.usersCount})</span>
                                            </Link>
                                            <a
                                                href={`/demo/${t.tierCode || 'b'}/${t.code || t.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                                title="Lihat Live Demo"
                                            >
                                                <Eye size={14} />
                                            </a>
                                            <button
                                                onClick={() => openEditDrawer(t)}
                                                className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                                title="Edit Tema"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTheme(t)}
                                                className="cursor-pointer rounded-lg bg-red-500/10 p-1.5 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                                                title="Hapus Tema"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Slide-over Drawer for Theme Form */}
            {drawerOpen && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex justify-end bg-slate-950/70">
                    <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                            <h3 className="font-sans text-base font-bold text-white">
                                {editMode
                                    ? 'Edit Tema Undangan'
                                    : 'Tambah Tema Baru'}
                            </h3>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-1 flex-col justify-between overflow-hidden"
                        >
                            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                                {/* Slug ID (non-editable in editMode) */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Slug ID / Unique Key
                                    </label>
                                    <input
                                        type="text"
                                        value={slugId}
                                        disabled={editMode}
                                        onChange={(e) =>
                                            setSlugId(e.target.value)
                                        }
                                        placeholder="e.g. elegant-gold, rustic-blossom"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:bg-slate-900/50 disabled:opacity-50"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-500">
                                        Hanya karakter huruf kecil, angka, dan
                                        garis penghubung (-). Tidak bisa diubah
                                        setelah dibuat.
                                    </p>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Nama Tema
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. Elegant Gold"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                {/* Code (Demo URL Random Code) */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Kode Demo Acak (URL Slug)
                                    </label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        placeholder="e.g. b1k9a2 (kosongkan untuk auto-generate)"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                    <span className="mt-1 block text-[10px] text-slate-500">
                                        Digunakan pada URL demo: ngaturi.inxdvi.com/demo/(tier)/[kode]
                                    </span>
                                </div>

                                {/* Package Level */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Tingkat Paket
                                    </label>
                                    <select
                                        value={packageLevel}
                                        onChange={(e) =>
                                            setPackageLevel(
                                                e.target.value as any,
                                            )
                                        }
                                        className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    >
                                        <option value="BASIC">
                                            BASIC (b)
                                        </option>
                                        <option value="PREMIUM">
                                            PREMIUM (p)
                                        </option>
                                        <option value="CUSTOM">
                                            CUSTOM (c)
                                        </option>
                                    </select>
                                </div>

                                {/* Thumbnail Upload & Preview */}
                                <div className="space-y-2">
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Thumbnail Tema
                                    </label>

                                    {/* File input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="block w-full cursor-pointer text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-slate-700"
                                    />

                                    {/* Manual URL input */}
                                    <input
                                        type="text"
                                        value={thumbnailUrl}
                                        onChange={(e) =>
                                            setThumbnailUrl(e.target.value)
                                        }
                                        placeholder="Atau tempel URL gambar eksternal..."
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />

                                    {thumbnailUrl && (
                                        <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                                            <img
                                                src={
                                                    thumbnailUrl.startsWith('/')
                                                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${thumbnailUrl}`
                                                        : thumbnailUrl
                                                }
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                                    <div>
                                        <span className="block text-xs font-semibold text-slate-300">
                                            Tampilkan ke Katalog
                                        </span>
                                        <span className="block text-[10px] text-slate-500">
                                            Tampilkan pilihan tema di onboarding
                                            user
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                            isActive
                                                ? 'bg-amber-500'
                                                : 'bg-slate-850'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                                                isActive
                                                    ? 'translate-x-4'
                                                    : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 border-t border-slate-800 bg-slate-950/20 p-6">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-600"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan Tema'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="border-slate-800 bg-slate-950 py-2.5 text-xs text-slate-400"
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

import AdminDashboardLayout from './DashboardLayout';

AdminThemes.layout = (page: React.ReactNode) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);

export default AdminThemes;
